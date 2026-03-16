import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { todosAPI } from '../services/api';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodos = useCallback(async (moduleId) => {
    if (!moduleId) {
      setTodos([]);
      return;
    }

    try {
      setLoading(true);
      const data = await todosAPI.getByModule(moduleId);
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (moduleId, todoData) => {
    try {
      const newTodo = await todosAPI.create(moduleId, todoData);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id, todoData) => {
    try {
      const updated = await todosAPI.update(id, todoData);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id) => {
    try {
      const updated = await todosAPI.toggle(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await todosAPI.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const value = useMemo(() => ({
    todos,
    filteredTodos,
    filter,
    loading,
    error,
    setFilter,
    loadTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  }), [todos, filteredTodos, filter, loading, error, loadTodos, createTodo, updateTodo, toggleTodo, deleteTodo]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
