-- Myway Database Schema

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('url', 'note', 'file')),
  content TEXT NOT NULL,
  file_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT 0,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Pomodoro Sessions table
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER,
  todo_id INTEGER,
  session_type TEXT NOT NULL CHECK(session_type IN ('work', 'short_break', 'long_break')),
  planned_duration INTEGER NOT NULL,
  actual_duration INTEGER,
  status TEXT NOT NULL CHECK(status IN ('completed', 'interrupted', 'cancelled')) DEFAULT 'interrupted',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  notes TEXT,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
  FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE SET NULL
);

-- Analytics fields - Add timestamps to existing tables (without CURRENT_TIMESTAMP defaults on ALTER)
-- Note: SQLite doesn't support CURRENT_TIMESTAMP default on ALTER TABLE statements
-- These columns will be managed by application code when needed
ALTER TABLE modules ADD COLUMN updated_at DATETIME;
ALTER TABLE modules ADD COLUMN last_accessed_at DATETIME;

ALTER TABLE resources ADD COLUMN updated_at DATETIME;
ALTER TABLE resources ADD COLUMN access_count INTEGER DEFAULT 0;
ALTER TABLE resources ADD COLUMN last_accessed_at DATETIME;

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_sessions_module ON pomodoro_sessions(module_id);
CREATE INDEX IF NOT EXISTS idx_sessions_todo ON pomodoro_sessions(todo_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON pomodoro_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_todos_module ON todos(module_id);
CREATE INDEX IF NOT EXISTS idx_resources_module ON resources(module_id);
