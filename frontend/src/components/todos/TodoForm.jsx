import { useState } from 'react';
import { useTodos } from '../../contexts/TodoContext';

export default function TodoForm({ moduleId, todo, onSuccess, onCancel }) {
  const { createTodo, updateTodo } = useTodos();
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    priority: todo?.priority || 'medium',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      if (todo) {
        await updateTodo(todo.id, { ...formData, completed: todo.completed });
      } else {
        await createTodo(moduleId, formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h4>{todo ? 'Edit Todo' : 'New Todo'}</h4>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="todo-title">Title *</label>
        <input
          id="todo-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Todo title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="todo-description">Description</label>
        <textarea
          id="todo-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="todo-priority">Priority</label>
        <select
          id="todo-priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : (todo ? 'Update' : 'Create')}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
