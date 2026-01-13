const express = require('express');
const router = express.Router();
const db = require('../database/db');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// GET all resources for a module
router.get('/modules/:moduleId/resources', async (req, res) => {
  try {
    const resources = await db.allAsync(
      'SELECT * FROM resources WHERE module_id = ? ORDER BY created_at DESC',
      [req.params.moduleId]
    );
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new resource
router.post('/modules/:moduleId/resources', upload.single('file'), async (req, res) => {
  const { title, type, content } = req.body;
  const moduleId = req.params.moduleId;

  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' });
  }

  if (!['url', 'note', 'file'].includes(type)) {
    return res.status(400).json({ error: 'Invalid resource type' });
  }

  try {
    let resourceContent = content;
    let filePath = null;

    if (type === 'file') {
      if (!req.file) {
        return res.status(400).json({ error: 'File is required for file type resources' });
      }
      filePath = req.file.filename;
      resourceContent = req.file.originalname;
    } else if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await db.runAsync(
      'INSERT INTO resources (module_id, title, type, content, file_path) VALUES (?, ?, ?, ?, ?)',
      [moduleId, title, type, resourceContent, filePath]
    );

    const newResource = await db.getAsync('SELECT * FROM resources WHERE id = ?', [result.id]);
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update resource
router.put('/resources/:id', async (req, res) => {
  const { title, type, content } = req.body;

  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' });
  }

  try {
    const result = await db.runAsync(
      'UPDATE resources SET title = ?, type = ?, content = ? WHERE id = ?',
      [title, type, content, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const updatedResource = await db.getAsync('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE resource
router.delete('/resources/:id', async (req, res) => {
  try {
    const resource = await db.getAsync('SELECT * FROM resources WHERE id = ?', [req.params.id]);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Delete file if it exists
    if (resource.type === 'file' && resource.file_path) {
      const filePath = path.join(process.env.UPLOAD_DIR || './uploads', resource.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.runAsync('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET serve uploaded file
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(process.env.UPLOAD_DIR || './uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(path.resolve(filePath));
});

module.exports = router;
