const API_URL = import.meta.env.VITE_API_URL || '/api';

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
    const response = await fetch(`${API_URL}/modules`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/modules/${id}`);
    return handleResponse(response);
  },

  create: async (moduleData) => {
    const response = await fetch(`${API_URL}/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moduleData),
    });
    return handleResponse(response);
  },

  update: async (id, moduleData) => {
    const response = await fetch(`${API_URL}/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moduleData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/modules/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Resources API
export const resourcesAPI = {
  getByModule: async (moduleId) => {
    const response = await fetch(`${API_URL}/modules/${moduleId}/resources`);
    return handleResponse(response);
  },

  create: async (moduleId, resourceData) => {
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
    const response = await fetch(`${API_URL}/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resourceData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
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
    const response = await fetch(`${API_URL}/modules/${moduleId}/todos`);
    return handleResponse(response);
  },

  create: async (moduleId, todoData) => {
    const response = await fetch(`${API_URL}/modules/${moduleId}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  update: async (id, todoData) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    });
    return handleResponse(response);
  },

  toggle: async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Pomodoro API
export const pomodoroAPI = {
  createSession: async (sessionData) => {
    const response = await fetch(`${API_URL}/pomodoro/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    });
    return handleResponse(response);
  },

  completeSession: async (sessionId, completionData) => {
    const response = await fetch(`${API_URL}/pomodoro/sessions/${sessionId}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completionData),
    });
    return handleResponse(response);
  },

  updateSession: async (sessionId, updateData) => {
    const response = await fetch(`${API_URL}/pomodoro/sessions/${sessionId}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  getSessions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/pomodoro/sessions?${params}`);
    return handleResponse(response);
  },

  getStats: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/pomodoro/sessions/stats?${params}`);
    return handleResponse(response);
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    const response = await fetch(`${API_URL}/analytics/overview`);
    return handleResponse(response);
  },

  getPomodoroByModule: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/analytics/pomodoro-by-module?${params}`);
    return handleResponse(response);
  },

  getModuleEngagement: async () => {
    const response = await fetch(`${API_URL}/analytics/module-engagement`);
    return handleResponse(response);
  },

  getTodoTrends: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/analytics/todo-trends?${params}`);
    return handleResponse(response);
  },

  getProductivityPatterns: async () => {
    const response = await fetch(`${API_URL}/analytics/productivity-patterns`);
    return handleResponse(response);
  },
};
