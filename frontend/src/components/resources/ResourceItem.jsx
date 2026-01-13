import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { resourcesAPI } from '../../services/api';

export default function ResourceItem({ resource }) {
  const { deleteResource } = useModules();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteResource(resource.id);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const getIcon = () => {
    switch (resource.type) {
      case 'url':
        return '🔗';
      case 'note':
        return '📝';
      case 'file':
        return '📎';
      default:
        return '📄';
    }
  };

  const renderContent = () => {
    switch (resource.type) {
      case 'url':
        return (
          <a href={resource.content} target="_blank" rel="noopener noreferrer" className="resource-link">
            {resource.content}
          </a>
        );
      case 'note':
        return <p className="resource-note">{resource.content}</p>;
      case 'file':
        return (
          <a
            href={resourcesAPI.getFileUrl(resource.file_path)}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-link"
          >
            {resource.content}
          </a>
        );
      default:
        return <p>{resource.content}</p>;
    }
  };

  return (
    <div className="resource-item">
      <div className="resource-header">
        <span className="resource-icon">{getIcon()}</span>
        <h4>{resource.title}</h4>
        <div className="resource-actions">
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-icon" title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className="resource-content">{renderContent()}</div>

      <div className="resource-meta">
        <span className="resource-type">{resource.type}</span>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Delete this resource?</p>
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
