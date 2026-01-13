import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { useTodos } from '../../contexts/TodoContext';
import ModuleForm from './ModuleForm';

export default function ModuleCard({ module }) {
  const { selectedModule, selectModule, deleteModule } = useModules();
  const { loadTodos } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isSelected = selectedModule?.id === module.id;

  const handleClick = () => {
    selectModule(module);
    loadTodos(module.id);
  };

  const handleDelete = async () => {
    try {
      await deleteModule(module.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete module:', error);
    }
  };

  if (isEditing) {
    return (
      <ModuleForm
        module={module}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div
      className={`module-card ${isSelected ? 'selected' : ''}`}
      style={{ borderLeftColor: module.color }}
      onClick={handleClick}
    >
      <div className="module-card-header">
        <h3>{module.name}</h3>
        <div className="module-card-actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setIsEditing(true)} className="btn-icon" title="Edit">
            ✏️
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-icon"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {module.description && <p className="module-description">{module.description}</p>}

      {showDeleteConfirm && (
        <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
          <p>Delete this module?</p>
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
