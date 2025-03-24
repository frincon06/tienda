import { Database } from './db.js';
import { Auth } from './auth.js';

class AdminPanel {
    static async init() {
        this.setupProductForm();
        this.loadProducts();
    }

    static async setupProductForm() {
        const form = document.getElementById('productForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const product = {
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value)
            };

            await Database.addProduct(product);
            form.reset();
            this.loadProducts();
        });
    }

    static async loadProducts() {
        const products = await Database.getProducts();
        const tbody = document.getElementById('productTableBody');
        tbody.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button onclick="AdminPanel.editProduct(${product.id})">Editar</button>
                    <button onclick="AdminPanel.deleteProduct(${product.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    static async editProduct(id) {
        // Implementation for editing a product
        const newName = prompt('Nuevo nombre:');
        if (newName) {
            const product = {
                id: id,
                name: newName,
                // Add other fields here
            };
            await Database.updateProduct(product);
            this.loadProducts();
        }
    }

    static async deleteProduct(id) {
        if (confirm('¿Está seguro de eliminar este producto?')) {
            await Database.deleteProduct(id);
            this.loadProducts();
        }
    }
}

// Make AdminPanel available globally
window.AdminPanel = AdminPanel;

// Initialize admin panel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (Auth.isAdmin()) {
        AdminPanel.init();
    }
});