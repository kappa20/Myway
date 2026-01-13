const express = require('express');
const db = require('../database/db');

const router = express.Router();

// GET /api/analytics/overview - High-level dashboard stats
router.get('/overview', async (req, res) => {
  try {
    const totalModules = await db.getAsync('SELECT COUNT(*) as count FROM modules');
    const totalTodos = await db.getAsync('SELECT COUNT(*) as count FROM todos');
    const completedTodos = await db.getAsync('SELECT COUNT(*) as count FROM todos WHERE completed = 1');

    const totalFocusTime = await db.getAsync(`
      SELECT SUM(actual_duration) as total
      FROM pomodoro_sessions
      WHERE status = 'completed' AND session_type = 'work'
    `);

    const todayFocusTime = await db.getAsync(`
      SELECT SUM(actual_duration) as total
      FROM pomodoro_sessions
      WHERE status = 'completed'
        AND session_type = 'work'
        AND DATE(started_at) = DATE('now')
    `);

    const stats = {
      totalModules,
      totalTodos,
      completedTodos,
      totalFocusTime,
      todayFocusTime,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/pomodoro-by-module - Focus time per module
router.get('/pomodoro-by-module', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = `
      SELECT
        m.id,
        m.name,
        m.color,
        COUNT(ps.id) as session_count,
        COALESCE(SUM(ps.actual_duration), 0) as total_duration,
        COALESCE(AVG(ps.actual_duration), 0) as avg_duration
      FROM modules m
      LEFT JOIN pomodoro_sessions ps ON m.id = ps.module_id
        AND ps.status = 'completed'
        AND ps.session_type = 'work'
    `;

    const params = [];

    if (start_date && end_date) {
      query += ` WHERE DATE(ps.started_at) BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    query += ` GROUP BY m.id ORDER BY total_duration DESC`;

    const data = await db.allAsync(query, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching pomodoro by module:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/module-engagement - Engagement ranking
router.get('/module-engagement', async (req, res) => {
  try {
    const data = await db.allAsync(`
      SELECT
        m.id,
        m.name,
        m.color,
        COUNT(DISTINCT t.id) as todo_count,
        COUNT(DISTINCT r.id) as resource_count,
        COUNT(DISTINCT ps.id) as session_count,
        SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) as completed_todos,
        COALESCE(SUM(ps.actual_duration), 0) as total_time,
        m.last_accessed_at,
        (COUNT(DISTINCT t.id) * 2 +
         COUNT(DISTINCT r.id) * 1.5 +
         COUNT(DISTINCT ps.id) * 3 +
         COALESCE(SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END), 0) * 2.5) as engagement_score
      FROM modules m
      LEFT JOIN todos t ON m.id = t.module_id
      LEFT JOIN resources r ON m.id = r.module_id
      LEFT JOIN pomodoro_sessions ps ON m.id = ps.module_id AND ps.status = 'completed'
      GROUP BY m.id
      ORDER BY engagement_score DESC
    `);

    res.json(data);
  } catch (error) {
    console.error('Error fetching module engagement:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/todo-trends - Todo completion trends over time
router.get('/todo-trends', async (req, res) => {
  try {
    const { period = '30', module_id } = req.query;

    let query = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as created,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        ROUND(SUM(CASE WHEN completed = 1 THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(*), 1) as completion_rate
      FROM todos
      WHERE DATE(created_at) >= DATE('now', '-${parseInt(period)} days')
    `;

    const params = [];

    if (module_id) {
      query += ` AND module_id = ?`;
      params.push(module_id);
    }

    query += ` GROUP BY DATE(created_at) ORDER BY date ASC`;

    const data = await db.allAsync(query, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching todo trends:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/productivity-patterns - Hourly/daily patterns
router.get('/productivity-patterns', async (req, res) => {
  try {
    const hourlyData = await db.allAsync(`
      SELECT
        CAST(strftime('%H', started_at) AS INTEGER) as hour,
        COUNT(*) as session_count,
        COALESCE(SUM(actual_duration), 0) as total_duration,
        COALESCE(AVG(actual_duration), 0) as avg_duration
      FROM pomodoro_sessions
      WHERE status = 'completed'
        AND session_type = 'work'
        AND DATE(started_at) >= DATE('now', '-30 days')
      GROUP BY hour
      ORDER BY hour
    `);

    const dailyData = await db.allAsync(`
      SELECT
        CAST(strftime('%w', started_at) AS INTEGER) as day_of_week,
        COUNT(*) as session_count,
        COALESCE(SUM(actual_duration), 0) as total_duration
      FROM pomodoro_sessions
      WHERE status = 'completed'
        AND session_type = 'work'
        AND DATE(started_at) >= DATE('now', '-30 days')
      GROUP BY day_of_week
      ORDER BY day_of_week
    `);

    res.json({ hourly: hourlyData, daily: dailyData });
  } catch (error) {
    console.error('Error fetching productivity patterns:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
