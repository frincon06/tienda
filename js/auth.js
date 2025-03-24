import { Database } from './db.js';

export class Auth {
    static currentUser = null;

    static async login(username, password) {
        const user = await Database.validateUser(username, password);
        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    }

    static logout() {
        this.currentUser = null;
    }

    static isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    static isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Setup login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await Auth.login(username, password)) {
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        if (Auth.isAdmin()) {
            document.getElementById('adminSection').classList.add('active');
        } else {
            document.getElementById('userSection').classList.add('active');
        }
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

// Setup logout handlers
['adminLogout', 'userLogout'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        Auth.logout();
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById('loginSection').classList.add('active');
    });
});