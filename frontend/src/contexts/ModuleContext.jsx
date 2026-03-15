import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { modulesAPI, resourcesAPI } from '../services/api';

const ModuleContext = createContext();

export function ModuleProvider({ children }) {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadResourcesAbortRef = useRef(null);

  useEffect(() => {
    loadModules();
  }, []);

  // Use selectedModule?.id to avoid re-fetching when the object ref changes but id is the same
  const selectedModuleId = selectedModule?.id;
  useEffect(() => {
    // Cancel any in-flight resource request
    if (loadResourcesAbortRef.current) {
      loadResourcesAbortRef.current.abort();
    }

    if (selectedModuleId) {
      const controller = new AbortController();
      loadResourcesAbortRef.current = controller;
      loadResources(selectedModuleId, controller.signal);
    } else {
      setResources([]);
    }

    return () => {
      if (loadResourcesAbortRef.current) {
        loadResourcesAbortRef.current.abort();
      }
    };
  }, [selectedModuleId]);

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await modulesAPI.getAll();
      setModules(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadResources = async (moduleId, signal) => {
    try {
      const data = await resourcesAPI.getByModule(moduleId);
      // Check if request was aborted before setting state
      if (signal && signal.aborted) return;
      setResources(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    }
  };

  const createModule = useCallback(async (moduleData) => {
    try {
      const newModule = await modulesAPI.create(moduleData);
      setModules(prev => [newModule, ...prev]);
      return newModule;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateModule = useCallback(async (id, moduleData) => {
    try {
      const updated = await modulesAPI.update(id, moduleData);
      setModules(prev => prev.map(m => m.id === id ? updated : m));
      setSelectedModule(prev => prev?.id === id ? updated : prev);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteModule = useCallback(async (id) => {
    try {
      await modulesAPI.delete(id);
      setModules(prev => prev.filter(m => m.id !== id));
      setSelectedModule(prev => prev?.id === id ? null : prev);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const selectModule = useCallback((module) => {
    setSelectedModule(module);
  }, []);

  const createResource = useCallback(async (moduleId, resourceData) => {
    try {
      const newResource = await resourcesAPI.create(moduleId, resourceData);
      setResources(prev => [newResource, ...prev]);
      return newResource;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteResource = useCallback(async (id) => {
    try {
      await resourcesAPI.delete(id);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const value = useMemo(() => ({
    modules,
    selectedModule,
    resources,
    loading,
    error,
    loadModules,
    createModule,
    updateModule,
    deleteModule,
    selectModule,
    createResource,
    deleteResource,
  }), [modules, selectedModule, resources, loading, error, createModule, updateModule, deleteModule, selectModule, createResource, deleteResource]);

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within ModuleProvider');
  }
  return context;
}
