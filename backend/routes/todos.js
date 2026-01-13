const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all todos for a module
router.get('/modules/:moduleId/todos', async (req, res) => {
  try {
    const todos = await db.allAsync(
      'SELECT * FROM todos WHERE module_id = ? ORDER BY created_at DESC',
      [req.params.moduleId]
    );
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new todo
router.post('/modules/:moduleId/todos', async (req, res) => {
  const { title, description, priority } = req.body;
  const moduleId = req.params.moduleId;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validPriority = ['low', 'medium', 'high'].includes(priority) ? priority : 'medium';

  try {
    const result = await db.runAsync(
      'INSERT INTO todos (module_id, title, description, priority, completed) VALUES (?, ?, ?, ?, ?)',
      [moduleId, title, description || null, validPriority, 0]
    );

    const newTodo = await db.getAsync('SELECT * FROM todos WHERE id = ?', [result.id]);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update todo
router.put('/todos/:id', async (req, res) => {
  const { title, description, priority, completed } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await db.runAsync(
      'UPDATE todos SET title = ?, description = ?, priority = ?, completed = ? WHERE id = ?',
      [title, description, priority, completed ? 1 : 0, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = await db.getAsync('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH toggle todo completion
router.patch('/todos/:id/toggle', async (req, res) => {
  try {
    const todo = await db.getAsync('SELECT * FROM todos WHERE id = ?', [req.params.id]);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const newCompleted = todo.completed ? 0 : 1;
    await db.runAsync('UPDATE todos SET completed = ? WHERE id = ?', [newCompleted, req.params.id]);

    const updatedTodo = await db.getAsync('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE todo
router.delete('/todos/:id', async (req, res) => {
  try {
    const result = await db.runAsync('DELETE FROM todos WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
