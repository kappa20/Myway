import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import ModuleCard from './ModuleCard';
import ModuleForm from './ModuleForm';

export default function ModuleList() {
  const { modules, loading } = useModules();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return <div className="loading">Loading modules...</div>;
  }

  return (
    <div className="module-list">
      <div className="module-list-header">
        <h2>My Modules</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Module'}
        </button>
      </div>

      {showForm && (
        <ModuleForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
      )}

      <div className="module-grid">
        {modules.length === 0 ? (
          <p className="empty-state">No modules yet. Create one to get started!</p>
        ) : (
          modules.map(module => <ModuleCard key={module.id} module={module} />)
        )}
      </div>
    </div>
  );
}
