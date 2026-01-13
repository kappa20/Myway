// Demo data for demonstration mode
// This data represents a realistic student scenario with multiple modules, tasks, and completed pomodoro sessions

const demoModules = [
  {
    id: 1,
    name: 'Advanced Web Development',
    description: 'Full-stack web development with React, Node.js, and databases',
    color: '#3B82F6',
    created_at: '2024-09-15T08:00:00.000Z',
    updated_at: '2026-01-10T14:30:00.000Z',
    last_accessed_at: '2026-01-14T09:15:00.000Z'
  },
  {
    id: 2,
    name: 'Machine Learning Fundamentals',
    description: 'Introduction to ML algorithms, neural networks, and data science',
    color: '#10B981',
    created_at: '2024-09-15T08:00:00.000Z',
    updated_at: '2026-01-12T16:45:00.000Z',
    last_accessed_at: '2026-01-13T10:20:00.000Z'
  },
  {
    id: 3,
    name: 'Database Systems',
    description: 'SQL, NoSQL, database design, and optimization techniques',
    color: '#F59E0B',
    created_at: '2024-09-15T08:00:00.000Z',
    updated_at: '2026-01-11T11:20:00.000Z',
    last_accessed_at: '2026-01-13T15:40:00.000Z'
  },
  {
    id: 4,
    name: 'Software Engineering Principles',
    description: 'Design patterns, architecture, testing, and best practices',
    color: '#8B5CF6',
    created_at: '2024-09-15T08:00:00.000Z',
    updated_at: '2026-01-09T13:10:00.000Z',
    last_accessed_at: '2026-01-12T08:30:00.000Z'
  },
  {
    id: 5,
    name: 'Mobile App Development',
    description: 'Building cross-platform mobile apps with React Native',
    color: '#EC4899',
    created_at: '2024-09-20T08:00:00.000Z',
    updated_at: '2026-01-08T10:00:00.000Z',
    last_accessed_at: '2026-01-11T14:15:00.000Z'
  }
];

const demoResources = [
  // Advanced Web Development resources
  { id: 1, module_id: 1, title: 'Course Syllabus', type: 'url', content: 'https://example.com/web-dev-syllabus', file_path: null, created_at: '2024-09-15T09:00:00.000Z', access_count: 15 },
  { id: 2, module_id: 1, title: 'React Hooks Cheatsheet', type: 'note', content: 'useState: for state management\nuseEffect: for side effects\nuseContext: for context API\nuseReducer: for complex state\nuseMemo: for memoization\nuseCallback: for callback memoization', file_path: null, created_at: '2024-10-01T10:30:00.000Z', access_count: 42 },
  { id: 3, module_id: 1, title: 'Project Requirements PDF', type: 'file', content: 'project-requirements.pdf', file_path: 'uploads/demo-web-dev-requirements.pdf', created_at: '2024-10-15T14:20:00.000Z', access_count: 8 },
  { id: 4, module_id: 1, title: 'MDN Web Docs', type: 'url', content: 'https://developer.mozilla.org', file_path: null, created_at: '2024-09-20T11:00:00.000Z', access_count: 28 },

  // Machine Learning resources
  { id: 5, module_id: 2, title: 'Andrew Ng ML Course', type: 'url', content: 'https://www.coursera.org/learn/machine-learning', file_path: null, created_at: '2024-09-15T09:30:00.000Z', access_count: 22 },
  { id: 6, module_id: 2, title: 'Neural Networks Notes', type: 'note', content: 'Perceptron: Single layer neural network\nBackpropagation: Algorithm for training neural networks\nActivation functions: ReLU, Sigmoid, Tanh\nGradient Descent: Optimization algorithm\nOverfitting: Model too complex for data', file_path: null, created_at: '2024-10-05T15:45:00.000Z', access_count: 35 },
  { id: 7, module_id: 2, title: 'Dataset - Iris Classification', type: 'file', content: 'iris-dataset.csv', file_path: 'uploads/demo-iris-dataset.csv', created_at: '2024-10-20T13:00:00.000Z', access_count: 12 },
  { id: 8, module_id: 2, title: 'Python ML Libraries Guide', type: 'note', content: 'NumPy: Numerical computing\nPandas: Data manipulation\nScikit-learn: ML algorithms\nTensorFlow: Deep learning\nMatplotlib: Data visualization', file_path: null, created_at: '2024-09-25T16:30:00.000Z', access_count: 18 },

  // Database Systems resources
  { id: 9, module_id: 3, title: 'PostgreSQL Documentation', type: 'url', content: 'https://www.postgresql.org/docs/', file_path: null, created_at: '2024-09-15T10:00:00.000Z', access_count: 31 },
  { id: 10, module_id: 3, title: 'SQL Query Optimization Tips', type: 'note', content: 'Use indexes wisely\nAvoid SELECT *\nUse JOINs instead of subqueries when possible\nAnalyze query execution plans\nDenormalize when necessary for read-heavy workloads', file_path: null, created_at: '2024-10-10T12:15:00.000Z', access_count: 27 },
  { id: 11, module_id: 3, title: 'Database Design Assignment', type: 'file', content: 'db-assignment-3.pdf', file_path: 'uploads/demo-db-assignment.pdf', created_at: '2024-11-01T09:30:00.000Z', access_count: 9 },

  // Software Engineering resources
  { id: 12, module_id: 4, title: 'Design Patterns Book', type: 'url', content: 'https://refactoring.guru/design-patterns', file_path: null, created_at: '2024-09-15T11:00:00.000Z', access_count: 19 },
  { id: 13, module_id: 4, title: 'SOLID Principles Summary', type: 'note', content: 'S - Single Responsibility Principle\nO - Open/Closed Principle\nL - Liskov Substitution Principle\nI - Interface Segregation Principle\nD - Dependency Inversion Principle', file_path: null, created_at: '2024-09-28T14:00:00.000Z', access_count: 24 },
  { id: 14, module_id: 4, title: 'Testing Best Practices', type: 'note', content: 'Write tests first (TDD)\nKeep tests simple and focused\nUse descriptive test names\nMock external dependencies\nAim for high code coverage', file_path: null, created_at: '2024-10-12T16:20:00.000Z', access_count: 16 },

  // Mobile App Development resources
  { id: 15, module_id: 5, title: 'React Native Documentation', type: 'url', content: 'https://reactnative.dev/docs/getting-started', file_path: null, created_at: '2024-09-20T09:00:00.000Z', access_count: 14 },
  { id: 16, module_id: 5, title: 'Mobile UI/UX Guidelines', type: 'note', content: 'Follow platform-specific design guidelines\nOptimize for touch interactions\nConsider different screen sizes\nMinimize loading times\nProvide offline functionality', file_path: null, created_at: '2024-10-05T11:30:00.000Z', access_count: 11 },
  { id: 17, module_id: 5, title: 'App Wireframes', type: 'file', content: 'app-wireframes.png', file_path: 'uploads/demo-wireframes.png', created_at: '2024-10-18T15:00:00.000Z', access_count: 7 }
];

const demoTodos = [
  // Advanced Web Development todos
  { id: 1, module_id: 1, title: 'Complete React Router assignment', description: 'Implement nested routes and protected routes', completed: 1, priority: 'high', created_at: '2024-11-15T09:00:00.000Z', updated_at: '2024-11-20T14:30:00.000Z', completed_at: '2024-11-20T14:30:00.000Z' },
  { id: 2, module_id: 1, title: 'Build REST API with Express', description: 'Create CRUD endpoints for blog posts', completed: 1, priority: 'high', created_at: '2024-11-22T10:00:00.000Z', updated_at: '2024-11-28T16:45:00.000Z', completed_at: '2024-11-28T16:45:00.000Z' },
  { id: 3, module_id: 1, title: 'Add authentication to final project', description: 'Implement JWT-based authentication', completed: 0, priority: 'high', created_at: '2026-01-08T11:00:00.000Z', updated_at: '2026-01-08T11:00:00.000Z', completed_at: null },
  { id: 4, module_id: 1, title: 'Write unit tests for components', description: 'Use Jest and React Testing Library', completed: 0, priority: 'medium', created_at: '2026-01-10T13:30:00.000Z', updated_at: '2026-01-10T13:30:00.000Z', completed_at: null },
  { id: 5, module_id: 1, title: 'Optimize bundle size', description: 'Code splitting and lazy loading', completed: 0, priority: 'low', created_at: '2026-01-12T15:00:00.000Z', updated_at: '2026-01-12T15:00:00.000Z', completed_at: null },

  // Machine Learning todos
  { id: 6, module_id: 2, title: 'Complete linear regression lab', description: 'Implement gradient descent from scratch', completed: 1, priority: 'high', created_at: '2024-11-10T09:30:00.000Z', updated_at: '2024-11-15T11:20:00.000Z', completed_at: '2024-11-15T11:20:00.000Z' },
  { id: 7, module_id: 2, title: 'Train neural network on MNIST', description: 'Achieve >95% accuracy', completed: 1, priority: 'high', created_at: '2024-12-01T14:00:00.000Z', updated_at: '2024-12-08T16:30:00.000Z', completed_at: '2024-12-08T16:30:00.000Z' },
  { id: 8, module_id: 2, title: 'Study cross-validation techniques', description: 'K-fold, stratified, time-series CV', completed: 1, priority: 'medium', created_at: '2024-12-15T10:00:00.000Z', updated_at: '2024-12-18T13:45:00.000Z', completed_at: '2024-12-18T13:45:00.000Z' },
  { id: 9, module_id: 2, title: 'Implement decision tree classifier', description: 'For final project dataset', completed: 0, priority: 'high', created_at: '2026-01-09T12:00:00.000Z', updated_at: '2026-01-09T12:00:00.000Z', completed_at: null },
  { id: 10, module_id: 2, title: 'Read research paper on transformers', description: 'Attention is All You Need paper', completed: 0, priority: 'medium', created_at: '2026-01-11T14:30:00.000Z', updated_at: '2026-01-11T14:30:00.000Z', completed_at: null },

  // Database Systems todos
  { id: 11, module_id: 3, title: 'Design e-commerce database schema', description: 'Include users, products, orders, reviews', completed: 1, priority: 'high', created_at: '2024-11-05T08:30:00.000Z', updated_at: '2024-11-12T15:20:00.000Z', completed_at: '2024-11-12T15:20:00.000Z' },
  { id: 12, module_id: 3, title: 'Write complex JOIN queries', description: 'Practice 3+ table joins with aggregations', completed: 1, priority: 'medium', created_at: '2024-11-18T11:00:00.000Z', updated_at: '2024-11-22T14:15:00.000Z', completed_at: '2024-11-22T14:15:00.000Z' },
  { id: 13, module_id: 3, title: 'Optimize slow query from assignment', description: 'Add indexes and rewrite query', completed: 0, priority: 'high', created_at: '2026-01-07T09:45:00.000Z', updated_at: '2026-01-07T09:45:00.000Z', completed_at: null },
  { id: 14, module_id: 3, title: 'Study MongoDB aggregation pipeline', description: 'For NoSQL comparison assignment', completed: 0, priority: 'medium', created_at: '2026-01-10T16:00:00.000Z', updated_at: '2026-01-10T16:00:00.000Z', completed_at: null },
  { id: 15, module_id: 3, title: 'Review transaction isolation levels', description: 'Prepare for midterm exam', completed: 0, priority: 'low', created_at: '2026-01-13T10:30:00.000Z', updated_at: '2026-01-13T10:30:00.000Z', completed_at: null },

  // Software Engineering todos
  { id: 16, module_id: 4, title: 'Implement Factory pattern in project', description: 'Refactor object creation logic', completed: 1, priority: 'medium', created_at: '2024-11-08T13:00:00.000Z', updated_at: '2024-11-14T17:30:00.000Z', completed_at: '2024-11-14T17:30:00.000Z' },
  { id: 17, module_id: 4, title: 'Write integration tests', description: 'Test API endpoints with supertest', completed: 1, priority: 'high', created_at: '2024-12-03T10:30:00.000Z', updated_at: '2024-12-10T15:00:00.000Z', completed_at: '2024-12-10T15:00:00.000Z' },
  { id: 18, module_id: 4, title: 'Refactor code using Strategy pattern', description: 'Replace conditional logic', completed: 0, priority: 'medium', created_at: '2026-01-08T14:15:00.000Z', updated_at: '2026-01-08T14:15:00.000Z', completed_at: null },
  { id: 19, module_id: 4, title: 'Set up CI/CD pipeline', description: 'GitHub Actions for automated testing', completed: 0, priority: 'high', created_at: '2026-01-11T11:45:00.000Z', updated_at: '2026-01-11T11:45:00.000Z', completed_at: null },
  { id: 20, module_id: 4, title: 'Document API with Swagger', description: 'Add OpenAPI specifications', completed: 0, priority: 'low', created_at: '2026-01-12T13:20:00.000Z', updated_at: '2026-01-12T13:20:00.000Z', completed_at: null },

  // Mobile App Development todos
  { id: 21, module_id: 5, title: 'Set up React Native project', description: 'Initialize with Expo CLI', completed: 1, priority: 'high', created_at: '2024-11-25T09:00:00.000Z', updated_at: '2024-11-25T10:30:00.000Z', completed_at: '2024-11-25T10:30:00.000Z' },
  { id: 22, module_id: 5, title: 'Implement navigation stack', description: 'Using React Navigation', completed: 1, priority: 'high', created_at: '2024-12-02T11:15:00.000Z', updated_at: '2024-12-05T14:45:00.000Z', completed_at: '2024-12-05T14:45:00.000Z' },
  { id: 23, module_id: 5, title: 'Build authentication screens', description: 'Login, signup, password reset', completed: 0, priority: 'high', created_at: '2026-01-06T10:00:00.000Z', updated_at: '2026-01-06T10:00:00.000Z', completed_at: null },
  { id: 24, module_id: 5, title: 'Integrate with Firebase', description: 'Setup Firestore for backend', completed: 0, priority: 'medium', created_at: '2026-01-09T15:30:00.000Z', updated_at: '2026-01-09T15:30:00.000Z', completed_at: null },
  { id: 25, module_id: 5, title: 'Add push notifications', description: 'Using Expo Notifications', completed: 0, priority: 'low', created_at: '2026-01-12T12:00:00.000Z', updated_at: '2026-01-12T12:00:00.000Z', completed_at: null }
];

// Generate realistic pomodoro sessions spread over the last 30 days
const demoPomodoroSessions = [];
let sessionId = 1;

// Helper function to generate random date within last N days
function getRandomDateInLastDays(days) {
  const now = new Date('2026-01-14T12:00:00.000Z');
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return new Date(start.getTime() + Math.random() * (now.getTime() - start.getTime()));
}

// Helper function to add minutes to date
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

// Generate sessions for each module with varying patterns
// Web Development: Most active (60 sessions)
for (let i = 0; i < 60; i++) {
  const startDate = getRandomDateInLastDays(30);
  const hour = startDate.getHours();

  // Set realistic working hours (9am - 10pm with peak at afternoon/evening)
  if (hour < 9 || hour > 22) {
    startDate.setHours(14 + Math.floor(Math.random() * 6));
  }

  const sessionType = i % 5 === 4 ? 'long_break' : (i % 2 === 1 ? 'short_break' : 'work');
  const plannedDuration = sessionType === 'work' ? 25 : (sessionType === 'short_break' ? 5 : 15);
  const actualDuration = plannedDuration + Math.floor(Math.random() * 3) - 1; // +/- 1 minute variance
  const status = Math.random() > 0.15 ? 'completed' : 'interrupted'; // 85% completion rate

  const relevantTodoId = [1, 2, 3, 4][Math.floor(Math.random() * 4)];

  demoPomodoroSessions.push({
    id: sessionId++,
    module_id: 1,
    todo_id: sessionType === 'work' ? relevantTodoId : null,
    session_type: sessionType,
    planned_duration: plannedDuration,
    actual_duration: status === 'completed' ? actualDuration : Math.floor(plannedDuration * (0.3 + Math.random() * 0.5)),
    status: status,
    started_at: startDate.toISOString(),
    completed_at: status === 'completed' ? addMinutes(startDate, actualDuration).toISOString() : null,
    notes: null
  });
}

// Machine Learning: Second most active (45 sessions)
for (let i = 0; i < 45; i++) {
  const startDate = getRandomDateInLastDays(30);
  const hour = startDate.getHours();

  if (hour < 9 || hour > 22) {
    startDate.setHours(10 + Math.floor(Math.random() * 8));
  }

  const sessionType = i % 5 === 4 ? 'long_break' : (i % 2 === 1 ? 'short_break' : 'work');
  const plannedDuration = sessionType === 'work' ? 25 : (sessionType === 'short_break' ? 5 : 15);
  const actualDuration = plannedDuration + Math.floor(Math.random() * 3) - 1;
  const status = Math.random() > 0.2 ? 'completed' : 'interrupted'; // 80% completion rate

  const relevantTodoId = [6, 7, 8, 9][Math.floor(Math.random() * 4)];

  demoPomodoroSessions.push({
    id: sessionId++,
    module_id: 2,
    todo_id: sessionType === 'work' ? relevantTodoId : null,
    session_type: sessionType,
    planned_duration: plannedDuration,
    actual_duration: status === 'completed' ? actualDuration : Math.floor(plannedDuration * (0.3 + Math.random() * 0.5)),
    status: status,
    started_at: startDate.toISOString(),
    completed_at: status === 'completed' ? addMinutes(startDate, actualDuration).toISOString() : null,
    notes: null
  });
}

// Database Systems: Moderate activity (35 sessions)
for (let i = 0; i < 35; i++) {
  const startDate = getRandomDateInLastDays(30);
  const hour = startDate.getHours();

  if (hour < 9 || hour > 22) {
    startDate.setHours(13 + Math.floor(Math.random() * 6));
  }

  const sessionType = i % 5 === 4 ? 'long_break' : (i % 2 === 1 ? 'short_break' : 'work');
  const plannedDuration = sessionType === 'work' ? 25 : (sessionType === 'short_break' ? 5 : 15);
  const actualDuration = plannedDuration + Math.floor(Math.random() * 3) - 1;
  const status = Math.random() > 0.25 ? 'completed' : 'interrupted'; // 75% completion rate

  const relevantTodoId = [11, 12, 13, 14][Math.floor(Math.random() * 4)];

  demoPomodoroSessions.push({
    id: sessionId++,
    module_id: 3,
    todo_id: sessionType === 'work' ? relevantTodoId : null,
    session_type: sessionType,
    planned_duration: plannedDuration,
    actual_duration: status === 'completed' ? actualDuration : Math.floor(plannedDuration * (0.3 + Math.random() * 0.5)),
    status: status,
    started_at: startDate.toISOString(),
    completed_at: status === 'completed' ? addMinutes(startDate, actualDuration).toISOString() : null,
    notes: null
  });
}

// Software Engineering: Moderate activity (30 sessions)
for (let i = 0; i < 30; i++) {
  const startDate = getRandomDateInLastDays(30);
  const hour = startDate.getHours();

  if (hour < 9 || hour > 22) {
    startDate.setHours(15 + Math.floor(Math.random() * 5));
  }

  const sessionType = i % 5 === 4 ? 'long_break' : (i % 2 === 1 ? 'short_break' : 'work');
  const plannedDuration = sessionType === 'work' ? 25 : (sessionType === 'short_break' ? 5 : 15);
  const actualDuration = plannedDuration + Math.floor(Math.random() * 3) - 1;
  const status = Math.random() > 0.18 ? 'completed' : 'interrupted'; // 82% completion rate

  const relevantTodoId = [16, 17, 18, 19][Math.floor(Math.random() * 4)];

  demoPomodoroSessions.push({
    id: sessionId++,
    module_id: 4,
    todo_id: sessionType === 'work' ? relevantTodoId : null,
    session_type: sessionType,
    planned_duration: plannedDuration,
    actual_duration: status === 'completed' ? actualDuration : Math.floor(plannedDuration * (0.3 + Math.random() * 0.5)),
    status: status,
    started_at: startDate.toISOString(),
    completed_at: status === 'completed' ? addMinutes(startDate, actualDuration).toISOString() : null,
    notes: null
  });
}

// Mobile Development: Lower activity (20 sessions - newer module)
for (let i = 0; i < 20; i++) {
  const startDate = getRandomDateInLastDays(20); // Only last 20 days
  const hour = startDate.getHours();

  if (hour < 9 || hour > 22) {
    startDate.setHours(16 + Math.floor(Math.random() * 4));
  }

  const sessionType = i % 5 === 4 ? 'long_break' : (i % 2 === 1 ? 'short_break' : 'work');
  const plannedDuration = sessionType === 'work' ? 25 : (sessionType === 'short_break' ? 5 : 15);
  const actualDuration = plannedDuration + Math.floor(Math.random() * 3) - 1;
  const status = Math.random() > 0.3 ? 'completed' : 'interrupted'; // 70% completion rate (still learning)

  const relevantTodoId = [21, 22, 23][Math.floor(Math.random() * 3)];

  demoPomodoroSessions.push({
    id: sessionId++,
    module_id: 5,
    todo_id: sessionType === 'work' ? relevantTodoId : null,
    session_type: sessionType,
    planned_duration: plannedDuration,
    actual_duration: status === 'completed' ? actualDuration : Math.floor(plannedDuration * (0.3 + Math.random() * 0.5)),
    status: status,
    started_at: startDate.toISOString(),
    completed_at: status === 'completed' ? addMinutes(startDate, actualDuration).toISOString() : null,
    notes: null
  });
}

// Sort all sessions by date
demoPomodoroSessions.sort((a, b) => new Date(a.started_at) - new Date(b.started_at));

module.exports = {
  demoModules,
  demoResources,
  demoTodos,
  demoPomodoroSessions
};
