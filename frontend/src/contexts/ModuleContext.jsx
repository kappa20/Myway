import { createContext, useContext, useState, useEffect } from 'react';
import { modulesAPI, resourcesAPI } from '../services/api';

const ModuleContext = createContext();

export function ModuleProvider({ children }) {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      loadResources(selectedModule.id);
    }
  }, [selectedModule]);

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

  const loadResources = async (moduleId) => {
    try {
      const data = await resourcesAPI.getByModule(moduleId);
      setResources(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createModule = async (moduleData) => {
    try {
      const newModule = await modulesAPI.create(moduleData);
      setModules([newModule, ...modules]);
      return newModule;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateModule = async (id, moduleData) => {
    try {
      const updated = await modulesAPI.update(id, moduleData);
      setModules(modules.map(m => m.id === id ? updated : m));
      if (selectedModule?.id === id) {
        setSelectedModule(updated);
      }
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteModule = async (id) => {
    try {
      await modulesAPI.delete(id);
      setModules(modules.filter(m => m.id !== id));
      if (selectedModule?.id === id) {
        setSelectedModule(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const selectModule = (module) => {
    setSelectedModule(module);
  };

  const createResource = async (moduleId, resourceData) => {
    try {
      const newResource = await resourcesAPI.create(moduleId, resourceData);
      setResources([newResource, ...resources]);
      return newResource;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteResource = async (id) => {
    try {
      await resourcesAPI.delete(id);
      setResources(resources.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
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
  };

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within ModuleProvider');
  }
  return context;
}
