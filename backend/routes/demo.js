const express = require('express');
const { demoModules, demoResources, demoTodos, demoPomodoroSessions } = require('../database/demoData');

const router = express.Router();

// GET /api/demo/modules - Get all demo modules
router.get('/modules', (req, res) => {
  res.json(demoModules);
});

// GET /api/demo/modules/:id - Get single demo module with resources and todos
router.get('/modules/:id', (req, res) => {
  const moduleId = parseInt(req.params.id);
  const module = demoModules.find(m => m.id === moduleId);

  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  const resources = demoResources.filter(r => r.module_id === moduleId);
  const todos = demoTodos.filter(t => t.module_id === moduleId);

  res.json({ ...module, resources, todos });
});

// GET /api/demo/modules/:id/resources - Get resources for a demo module
router.get('/modules/:id/resources', (req, res) => {
  const moduleId = parseInt(req.params.id);
  const resources = demoResources.filter(r => r.module_id === moduleId);
  res.json(resources);
});

// GET /api/demo/modules/:id/todos - Get todos for a demo module
router.get('/modules/:id/todos', (req, res) => {
  const moduleId = parseInt(req.params.id);
  const todos = demoTodos.filter(t => t.module_id === moduleId);
  res.json(todos);
});

// GET /api/demo/analytics/overview - Get demo overview stats
router.get('/analytics/overview', (req, res) => {
  const totalModules = { count: demoModules.length };
  const totalTodos = { count: demoTodos.length };
  const completedTodos = { count: demoTodos.filter(t => t.completed === 1).length };

  const workSessions = demoPomodoroSessions.filter(s => s.status === 'completed' && s.session_type === 'work');
  const totalFocusTime = { total: workSessions.reduce((sum, s) => sum + s.actual_duration, 0) };

  const todaySessions = workSessions.filter(s => {
    const sessionDate = new Date(s.started_at);
    const today = new Date('2026-01-14');
    return sessionDate.toDateString() === today.toDateString();
  });
  const todayFocusTime = { total: todaySessions.reduce((sum, s) => sum + s.actual_duration, 0) };

  res.json({
    totalModules,
    totalTodos,
    completedTodos,
    totalFocusTime,
    todayFocusTime
  });
});

// GET /api/demo/analytics/pomodoro-by-module - Get demo pomodoro stats by module
router.get('/analytics/pomodoro-by-module', (req, res) => {
  const statsByModule = demoModules.map(module => {
    const sessions = demoPomodoroSessions.filter(
      s => s.module_id === module.id && s.status === 'completed' && s.session_type === 'work'
    );

    const totalDuration = sessions.reduce((sum, s) => sum + s.actual_duration, 0);
    const avgDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;

    return {
      id: module.id,
      name: module.name,
      color: module.color,
      session_count: sessions.length,
      total_duration: totalDuration,
      avg_duration: avgDuration
    };
  });

  statsByModule.sort((a, b) => b.total_duration - a.total_duration);
  res.json(statsByModule);
});

// GET /api/demo/analytics/module-engagement - Get demo module engagement stats
router.get('/analytics/module-engagement', (req, res) => {
  const engagement = demoModules.map(module => {
    const todos = demoTodos.filter(t => t.module_id === module.id);
    const resources = demoResources.filter(r => r.module_id === module.id);
    const sessions = demoPomodoroSessions.filter(s => s.module_id === module.id && s.status === 'completed');

    const todoCount = todos.length;
    const resourceCount = resources.length;
    const sessionCount = sessions.length;
    const completedTodos = todos.filter(t => t.completed === 1).length;
    const totalTime = sessions.reduce((sum, s) => sum + s.actual_duration, 0);

    const engagementScore = todoCount * 2 + resourceCount * 1.5 + sessionCount * 3 + completedTodos * 2.5;

    return {
      id: module.id,
      name: module.name,
      color: module.color,
      todo_count: todoCount,
      resource_count: resourceCount,
      session_count: sessionCount,
      completed_todos: completedTodos,
      total_time: totalTime,
      last_accessed_at: module.last_accessed_at,
      engagement_score: engagementScore
    };
  });

  engagement.sort((a, b) => b.engagement_score - a.engagement_score);
  res.json(engagement);
});

// GET /api/demo/analytics/todo-trends - Get demo todo trends
router.get('/analytics/todo-trends', (req, res) => {
  const period = parseInt(req.query.period) || 30;
  const moduleId = req.query.module_id ? parseInt(req.query.module_id) : null;

  const now = new Date('2026-01-14');
  const startDate = new Date(now.getTime() - period * 24 * 60 * 60 * 1000);

  let filteredTodos = demoTodos.filter(t => new Date(t.created_at) >= startDate);
  if (moduleId) {
    filteredTodos = filteredTodos.filter(t => t.module_id === moduleId);
  }

  // Group by date
  const dateMap = {};
  filteredTodos.forEach(todo => {
    const date = new Date(todo.created_at).toISOString().split('T')[0];
    if (!dateMap[date]) {
      dateMap[date] = { date, created: 0, completed: 0 };
    }
    dateMap[date].created++;
    if (todo.completed === 1) {
      dateMap[date].completed++;
    }
  });

  const trends = Object.values(dateMap).map(item => ({
    ...item,
    completion_rate: item.created > 0 ? Math.round((item.completed / item.created) * 1000) / 10 : 0
  }));

  trends.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(trends);
});

// GET /api/demo/analytics/productivity-patterns - Get demo productivity patterns
router.get('/analytics/productivity-patterns', (req, res) => {
  const last30Days = new Date('2026-01-14');
  last30Days.setDate(last30Days.getDate() - 30);

  const workSessions = demoPomodoroSessions.filter(
    s => s.status === 'completed' && s.session_type === 'work' && new Date(s.started_at) >= last30Days
  );

  // Hourly data
  const hourlyMap = {};
  workSessions.forEach(session => {
    const hour = new Date(session.started_at).getHours();
    if (!hourlyMap[hour]) {
      hourlyMap[hour] = { hour, session_count: 0, total_duration: 0 };
    }
    hourlyMap[hour].session_count++;
    hourlyMap[hour].total_duration += session.actual_duration;
  });

  const hourlyData = Object.values(hourlyMap).map(item => ({
    ...item,
    avg_duration: item.session_count > 0 ? item.total_duration / item.session_count : 0
  }));
  hourlyData.sort((a, b) => a.hour - b.hour);

  // Daily data (day of week)
  const dailyMap = {};
  workSessions.forEach(session => {
    const dayOfWeek = new Date(session.started_at).getDay();
    if (!dailyMap[dayOfWeek]) {
      dailyMap[dayOfWeek] = { day_of_week: dayOfWeek, session_count: 0, total_duration: 0 };
    }
    dailyMap[dayOfWeek].session_count++;
    dailyMap[dayOfWeek].total_duration += session.actual_duration;
  });

  const dailyData = Object.values(dailyMap);
  dailyData.sort((a, b) => a.day_of_week - b.day_of_week);

  res.json({ hourly: hourlyData, daily: dailyData });
});

// GET /api/demo/pomodoro/sessions - Get demo pomodoro sessions with filters
router.get('/pomodoro/sessions', (req, res) => {
  const { module_id, status, start_date, end_date } = req.query;

  let filtered = [...demoPomodoroSessions];

  if (module_id) {
    filtered = filtered.filter(s => s.module_id === parseInt(module_id));
  }

  if (status) {
    filtered = filtered.filter(s => s.status === status);
  }

  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    filtered = filtered.filter(s => {
      const sessionDate = new Date(s.started_at);
      return sessionDate >= start && sessionDate <= end;
    });
  }

  // Add module and todo names
  const enriched = filtered.map(session => {
    const module = demoModules.find(m => m.id === session.module_id);
    const todo = session.todo_id ? demoTodos.find(t => t.id === session.todo_id) : null;

    return {
      ...session,
      module_name: module ? module.name : null,
      todo_title: todo ? todo.title : null
    };
  });

  enriched.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
  res.json(enriched);
});

// GET /api/demo/pomodoro/sessions/stats - Get demo pomodoro stats
router.get('/pomodoro/sessions/stats', (req, res) => {
  const { module_id, start_date, end_date } = req.query;

  let filtered = [...demoPomodoroSessions];

  if (module_id) {
    filtered = filtered.filter(s => s.module_id === parseInt(module_id));
  }

  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    filtered = filtered.filter(s => {
      const sessionDate = new Date(s.started_at);
      return sessionDate >= start && sessionDate <= end;
    });
  }

  const totalSessions = filtered.length;
  const completedSessions = filtered.filter(s => s.status === 'completed').length;
  const totalDuration = filtered
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.actual_duration, 0);
  const avgDuration = completedSessions > 0 ? totalDuration / completedSessions : 0;

  res.json({
    total_sessions: totalSessions,
    completed_sessions: completedSessions,
    total_duration: totalDuration,
    avg_duration: avgDuration
  });
});

module.exports = router;
