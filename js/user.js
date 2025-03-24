import { Database } from './db.js';
import { Auth } from './auth.js';

class UserPanel {
    static cart = [];

    static async init() {
        this.loadProducts();
        this.setupCheckout();
    }

    static async loadProducts() {
        const products = await Database.getProducts();
        const catalog = document.getElementById('productCatalog');
        catalog.innerHTML = '';

        products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';
            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="UserPanel.addToCart(${JSON.stringify(product)})">
                    Agregar al Carrito
                </button>
            `;
            catalog.appendChild(div);
        });
    }

    static addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.updateCartDisplay();
    }

    static updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        cartItems.innerHTML = '';

        let total = 0;

        this.cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="UserPanel.removeFromCart(${item.id})">X</button>
            `;
            cartItems.appendChild(div);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    static removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
    }

    static setupCheckout() {
        document.getElementById('checkoutBtn').addEventListener('click', async () => {
            if (this.cart.length === 0) {
                alert('El carrito está vacío');
                return;
            }

            const order = {
                username: Auth.currentUser.username,
                items: this.cart,
                total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                date: new Date()
            };

            try {
                await Database.saveOrder(order);
                this.cart = [];
                this.updateCartDisplay();
                alert('¡Compra realizada con éxito!');
            } catch (error) {
                alert('Error al procesar la compra');
            }
        });
    }
}

// Make UserPanel available globally
window.UserPanel = UserPanel;

// Initialize user panel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (Auth.currentUser && !Auth.isAdmin()) {
        UserPanel.init();
    }
});