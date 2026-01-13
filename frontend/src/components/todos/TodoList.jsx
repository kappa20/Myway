import { useState } from 'react';
import { useModules } from '../../contexts/ModuleContext';
import { useTodos } from '../../contexts/TodoContext';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

export default function TodoList() {
  const { selectedModule } = useModules();
  const { filteredTodos, filter, setFilter } = useTodos();
  const [showForm, setShowForm] = useState(false);

  if (!selectedModule) {
    return (
      <div className="todo-list">
        <p className="empty-state">Select a module to view todos</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <h3>Todos</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Todo'}
        </button>
      </div>

      <div className="todo-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {showForm && (
        <TodoForm
          moduleId={selectedModule.id}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="todo-items">
        {filteredTodos.length === 0 ? (
          <p className="empty-state">No todos in this category</p>
        ) : (
          filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>
    </div>
  );
}
