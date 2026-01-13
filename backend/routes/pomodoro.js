const express = require('express');
const db = require('../database/db');

const router = express.Router();

// POST /api/pomodoro/sessions - Create new pomodoro session
router.post('/sessions', async (req, res) => {
  try {
    const { module_id, todo_id, session_type, planned_duration } = req.body;

    const result = await db.runAsync(
      `INSERT INTO pomodoro_sessions (module_id, todo_id, session_type, planned_duration)
       VALUES (?, ?, ?, ?)`,
      [module_id || null, todo_id || null, session_type, planned_duration]
    );

    const session = await db.getAsync(
      'SELECT * FROM pomodoro_sessions WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/pomodoro/sessions/:id/complete - Complete or cancel session
router.patch('/sessions/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_duration, completed_at, status } = req.body;

    await db.runAsync(
      `UPDATE pomodoro_sessions
       SET actual_duration = ?, completed_at = ?, status = ?
       WHERE id = ?`,
      [actual_duration, completed_at, status, id]
    );

    const session = await db.getAsync(
      'SELECT * FROM pomodoro_sessions WHERE id = ?',
      [id]
    );

    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/pomodoro/sessions/:id/update - Update session during pause/resume
router.patch('/sessions/:id/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_duration } = req.body;

    await db.runAsync(
      `UPDATE pomodoro_sessions SET actual_duration = ? WHERE id = ?`,
      [actual_duration, id]
    );

    const session = await db.getAsync(
      'SELECT * FROM pomodoro_sessions WHERE id = ?',
      [id]
    );

    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pomodoro/sessions - Get sessions with optional filters
router.get('/sessions', async (req, res) => {
  try {
    const { module_id, start_date, end_date, status } = req.query;

    let query = `
      SELECT ps.*, m.name as module_name, t.title as todo_title
      FROM pomodoro_sessions ps
      LEFT JOIN modules m ON ps.module_id = m.id
      LEFT JOIN todos t ON ps.todo_id = t.id
      WHERE 1=1
    `;

    const params = [];

    if (module_id) {
      query += ` AND ps.module_id = ?`;
      params.push(module_id);
    }

    if (status) {
      query += ` AND ps.status = ?`;
      params.push(status);
    }

    if (start_date && end_date) {
      query += ` AND DATE(ps.started_at) BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    query += ` ORDER BY ps.started_at DESC`;

    const sessions = await db.allAsync(query, params);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pomodoro/sessions/stats - Get aggregated statistics
router.get('/sessions/stats', async (req, res) => {
  try {
    const { module_id, start_date, end_date } = req.query;

    let query = `
      SELECT
        COUNT(*) as total_sessions,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
        SUM(CASE WHEN status = 'completed' THEN actual_duration ELSE 0 END) as total_duration,
        AVG(CASE WHEN status = 'completed' THEN actual_duration ELSE NULL END) as avg_duration
      FROM pomodoro_sessions
      WHERE 1=1
    `;

    const params = [];

    if (module_id) {
      query += ` AND module_id = ?`;
      params.push(module_id);
    }

    if (start_date && end_date) {
      query += ` AND DATE(started_at) BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    const stats = await db.getAsync(query, params);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
