const express = require('express');
const cors = require('cors');
require('dotenv').config();

const modulesRouter = require('./routes/modules');
const resourcesRouter = require('./routes/resources');
const todosRouter = require('./routes/todos');
const pomodoroRouter = require('./routes/pomodoro');
const analyticsRouter = require('./routes/analytics');
const demoRouter = require('./routes/demo');
const aiRouter = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/modules', modulesRouter);
app.use('/api', resourcesRouter);
app.use('/api', todosRouter);
app.use('/api/pomodoro', pomodoroRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/demo', demoRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Myway API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

module.exports = app;
