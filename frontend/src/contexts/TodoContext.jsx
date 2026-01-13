import { createContext, useContext, useState, useEffect } from 'react';
import { todosAPI } from '../services/api';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodos = async (moduleId) => {
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
  };

  const createTodo = async (moduleId, todoData) => {
    try {
      const newTodo = await todosAPI.create(moduleId, todoData);
      setTodos([newTodo, ...todos]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      const updated = await todosAPI.update(id, todoData);
      setTodos(todos.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updated = await todosAPI.toggle(id);
      setTodos(todos.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todosAPI.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const value = {
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
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
