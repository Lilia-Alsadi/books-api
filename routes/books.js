import express from 'express';
import pool from '../db.js';

const router = express.Router();

//get all books 
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
        res.json(result.rows);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//get a single book
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        if (result.rows.length === 0) 
            return res.status(404).json({ message: 'Book not found' });
        res.json(result.rows[0]);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//add a book
router.post('/', async (req, res) => {
    try {
        const { title, author, year } = req.body;
        const result = await pool.query(
            'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
            [title, author, year] 
        );
        res.status(201).json(result.rows[0]);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//update a book
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, year } = req.body;
        const result = await pool.query(
            'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *',
            [title, author, year, id]
        );
        if (result.rows.length === 0) 
            return res.status(404).json({ message: 'Book not found' });
        res.json(result.rows[0]);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//delete a book
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) 
            return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;