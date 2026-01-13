const API_URL = import.meta.env.VITE_API_URL || '/api';

// Check if demo mode is enabled
export function isDemoMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('demo') === 'true';
}

// Get API prefix based on demo mode
function getApiPrefix() {
  return isDemoMode() ? `${API_URL}/demo` : API_URL;
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

// Modules API
export const modulesAPI = {
  getAll: async () => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/modules`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/modules/${id}`);
    return handleResponse(response);
  },

  create: async (moduleData) => {
    if (isDemoMode()) {
      throw new Error('Cannot create modules in demo mode');
    }
    const response = await fetch(`${API_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moduleData),
    });
    return handleResponse(response);
  },

  update: async (id, moduleData) => {
    if (isDemoMode()) {
      throw new Error('Cannot update modules in demo mode');
    }
    const response = await fetch(`${API_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moduleData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    if (isDemoMode()) {
      throw new Error('Cannot delete modules in demo mode');
    }
    const response = await fetch(`${API_URL}/modules/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Resources API
export const resourcesAPI = {
  getByModule: async (moduleId) => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/modules/${moduleId}/resources`);
    return handleResponse(response);
  },

  create: async (moduleId, resourceData) => {
    if (isDemoMode()) {
      throw new Error('Cannot create resources in demo mode');
    }
    let response;

    if (resourceData.type === 'file' && resourceData.file) {
      const formData = new FormData();
      formData.append('title', resourceData.title);
      formData.append('type', resourceData.type);
      formData.append('file', resourceData.file);

      response = await fetch(`${API_URL}/modules/${moduleId}/resources`, {
        method: 'POST',
        body: formData,
      });
    } else {
      response = await fetch(`${API_URL}/modules/${moduleId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceData),
      });
    }

    return handleResponse(response);
  },

  update: async (id, resourceData) => {
    if (isDemoMode()) {
      throw new Error('Cannot update resources in demo mode');
    }
    const response = await fetch(`${API_URL}/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resourceData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    if (isDemoMode()) {
      throw new Error('Cannot delete resources in demo mode');
    }
    const response = await fetch(`${API_URL}/resources/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  getFileUrl: (filename) => {
    return `${API_URL}/uploads/${filename}`;
  },
};

// Todos API
export const todosAPI = {
  getByModule: async (moduleId) => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/modules/${moduleId}/todos`);
    return handleResponse(response);
  },

  create: async (moduleId, todoData) => {
    if (isDemoMode()) {
      throw new Error('Cannot create todos in demo mode');
    }
    const response = await fetch(`${API_URL}/modules/${moduleId}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  update: async (id, todoData) => {
    if (isDemoMode()) {
      throw new Error('Cannot update todos in demo mode');
    }
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  toggle: async (id) => {
    if (isDemoMode()) {
      throw new Error('Cannot toggle todos in demo mode');
    }
    const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    if (isDemoMode()) {
      throw new Error('Cannot delete todos in demo mode');
    }
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Pomodoro API
export const pomodoroAPI = {
  createSession: async (sessionData) => {
    if (isDemoMode()) {
      // In demo mode, don't actually create sessions - just return a mock response
      return { id: Math.floor(Math.random() * 10000), ...sessionData };
    }
    const response = await fetch(`${API_URL}/pomodoro/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    });
    return handleResponse(response);
  },

  completeSession: async (sessionId, completionData) => {
    if (isDemoMode()) {
      // In demo mode, don't actually complete sessions - just return a mock response
      return { id: sessionId, ...completionData };
    }
    const response = await fetch(`${API_URL}/pomodoro/sessions/${sessionId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completionData),
    });
    return handleResponse(response);
  },

  updateSession: async (sessionId, updateData) => {
    if (isDemoMode()) {
      // In demo mode, don't actually update sessions - just return a mock response
      return { id: sessionId, ...updateData };
    }
    const response = await fetch(`${API_URL}/pomodoro/sessions/${sessionId}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  getSessions: async (filters = {}) => {
    const apiPrefix = getApiPrefix();
    const params = new URLSearchParams(filters);
    const response = await fetch(`${apiPrefix}/pomodoro/sessions?${params}`);
    return handleResponse(response);
  },

  getStats: async (filters = {}) => {
    const apiPrefix = getApiPrefix();
    const params = new URLSearchParams(filters);
    const response = await fetch(`${apiPrefix}/pomodoro/sessions/stats?${params}`);
    return handleResponse(response);
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/analytics/overview`);
    return handleResponse(response);
  },

  getPomodoroByModule: async (filters = {}) => {
    const apiPrefix = getApiPrefix();
    const params = new URLSearchParams(filters);
    const response = await fetch(`${apiPrefix}/analytics/pomodoro-by-module?${params}`);
    return handleResponse(response);
  },

  getModuleEngagement: async () => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/analytics/module-engagement`);
    return handleResponse(response);
  },

  getTodoTrends: async (filters = {}) => {
    const apiPrefix = getApiPrefix();
    const params = new URLSearchParams(filters);
    const response = await fetch(`${apiPrefix}/analytics/todo-trends?${params}`);
    return handleResponse(response);
  },

  getProductivityPatterns: async () => {
    const apiPrefix = getApiPrefix();
    const response = await fetch(`${apiPrefix}/analytics/productivity-patterns`);
    return handleResponse(response);
  },
};
