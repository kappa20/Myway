import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

export default function ModuleForm({ module, onSuccess, onCancel }) {
  const { createModule, updateModule } = useModules();
  const [formData, setFormData] = useState({
    name: module?.name || '',
    description: module?.description || '',
    color: module?.color || '#3B82F6',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Module name is required');
      return;
    }

    try {
      if (module) {
        await updateModule(module.id, formData);
      } else {
        await createModule(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="module-form">
      <h3>{module ? 'Edit Module' : 'New Module'}</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="name">Module Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mathematics"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the module"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Color</label>
        <div className="color-picker">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              className={`color-option ${formData.color === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {module ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
