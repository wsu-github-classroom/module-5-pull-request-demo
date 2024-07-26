// This is a simple example of a function that saves a cart item to a PostgreSQL database.
// Do not try and run it, as the DB does not exist.
import { Client } from 'pg';

const client = new Client({
    user: 'yourusername',
    host: 'localhost',
    database: 'shopdb',
    password: 'yourpassword',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

    export async function saveCartItem(userId, productId, quantity) {
        if (!userId || !productId || !quantity) {
            throw new Error('Invalid input: userId, productId, and quantity are required');
        }
    
        if (typeof quantity !== 'number' || quantity <= 0) {
            throw new Error('Invalid quantity: must be a positive number');
        }
    
        const query = `
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userId, productId, quantity];
    
        try {
            const res = await client.query(query, values);
            console.log('Cart item saved:', res.rows[0]);
            return res.rows[0];
        } catch (err) {
            console.error('Error saving cart item:', err.stack);
            throw err; // Re-throw the error after logging it
        }
    }

process.on('exit', () => {
    client.end()
        .then(() => console.log('Disconnected from PostgreSQL'))
        .catch(err => console.error('Disconnection error', err.stack));
});