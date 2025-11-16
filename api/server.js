const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('Starting otammik API server...');

// PostgreSQL connection
const pool = new Pool({
  host: 'database',
  port: 5432,
  database: 'otammikdb',
  user: 'otammikuser',
  password: 'otammikpass',
});

pool.on('connect', () => console.log('otammik: Connected to PostgreSQL'));
pool.on('error', (err) => console.error('otammik: PostgreSQL error:', err));

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      database: 'connected', 
      timestamp: result.rows[0].now,
      author: 'otammik'
    });
  } catch (err) {
    res.status(503).json({ status: 'ERROR', message: err.message });
  }
});

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });
  
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: 'Title required' });

  try {
    const result = await pool.query(
      'UPDATE todos SET title=$1, description=$2, completed=$3 WHERE id=$4 RETURNING *',
      [title.trim(), description || null, completed || false, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM todos WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`otammik API server running on port ${PORT}`);
});
