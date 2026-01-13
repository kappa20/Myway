import { useState } from 'react';
import { useTodos } from '../../contexts/TodoContext';
import { usePomodoro } from '../../contexts/PomodoroContext';
import TodoForm from './TodoForm';

const PRIORITY_COLORS = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
};

export default function TodoItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodos();
  const { startWithTodo } = usePomodoro();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = async () => {
    try {
      await toggleTodo(todo.id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleStartPomodoro = () => {
    startWithTodo(todo);
  };

  if (isEditing) {
    return <TodoForm todo={todo} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <div className="todo-content">
          <h4>{todo.title}</h4>
          {todo.description && <p className="todo-description">{todo.description}</p>}
        </div>
        <div className="todo-actions">
          <span
            className="priority-badge"
            style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
            title={`Priority: ${todo.priority}`}
          >
            {todo.priority}
          </span>
          {!todo.completed && (
            <button onClick={handleStartPomodoro} className="btn-icon" title="Start Pomodoro">
              ⏰
            </button>
          )}
          <button onClick={() => setIsEditing(true)} className="btn-icon" title="Edit">
            ✏️
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-icon" title="Delete">
            🗑️
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Delete this todo?</p>
          <div className="delete-confirm-actions">
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
