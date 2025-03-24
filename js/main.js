import { Database } from './db.js';
import { Auth } from './auth.js';
import './admin.js';
import './user.js';

// Initialize the database when the application starts
Database.init().then(() => {
    console.log('Database initialized successfully');
}).catch(error => {
    console.error('Error initializing database:', error);
});