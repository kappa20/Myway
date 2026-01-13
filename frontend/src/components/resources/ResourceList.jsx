import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import ResourceItem from './ResourceItem';
import ResourceForm from './ResourceForm';

export default function ResourceList() {
  const { selectedModule, resources } = useModules();
  const [showForm, setShowForm] = useState(false);

  if (!selectedModule) {
    return (
      <div className="resource-list">
        <p className="empty-state">Select a module to view resources</p>
      </div>
    );
  }

  return (
    <div className="resource-list">
      <div className="resource-list-header">
        <h3>Resources</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showForm && (
        <ResourceForm
          moduleId={selectedModule.id}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="resource-items">
        {resources.length === 0 ? (
          <p className="empty-state">No resources yet. Add one to get started!</p>
        ) : (
          resources.map(resource => <ResourceItem key={resource.id} resource={resource} />)
        )}
      </div>
    </div>
  );
}
