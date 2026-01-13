const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all modules
router.get('/', async (req, res) => {
  try {
    const modules = await db.allAsync('SELECT * FROM modules ORDER BY created_at DESC');
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single module with resources and todos
router.get('/:id', async (req, res) => {
  try {
    const module = await db.getAsync('SELECT * FROM modules WHERE id = ?', [req.params.id]);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const resources = await db.allAsync('SELECT * FROM resources WHERE module_id = ?', [req.params.id]);
    const todos = await db.allAsync('SELECT * FROM todos WHERE module_id = ?', [req.params.id]);

    res.json({ ...module, resources, todos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new module
router.post('/', async (req, res) => {
  const { name, description, color } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await db.runAsync(
      'INSERT INTO modules (name, description, color) VALUES (?, ?, ?)',
      [name, description || null, color || '#3B82F6']
    );

    const newModule = await db.getAsync('SELECT * FROM modules WHERE id = ?', [result.id]);
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update module
router.put('/:id', async (req, res) => {
  const { name, description, color } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const result = await db.runAsync(
      'UPDATE modules SET name = ?, description = ?, color = ? WHERE id = ?',
      [name, description, color, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const updatedModule = await db.getAsync('SELECT * FROM modules WHERE id = ?', [req.params.id]);
    res.json(updatedModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE module
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.runAsync('DELETE FROM modules WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
