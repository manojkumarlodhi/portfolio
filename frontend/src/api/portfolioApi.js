import apiClient from './apiClient';

// ── Public Portfolio Bundle ───────────────────────────────────────────────────
export const portfolioApi = {
  getPortfolio: () => apiClient.get('/api/portfolio'),
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  getProfile: () => apiClient.get('/api/portfolio/profile'),
  update: (data) => apiClient.put('/api/admin/profile', data),
  deletePhoto: () => apiClient.delete('/api/admin/profile/photo'),
  deleteResume: () => apiClient.delete('/api/admin/profile/resume'),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statApi = {
  getAll: () => apiClient.get('/api/portfolio/stats'),
  getById: (id) => apiClient.get(`/api/admin/stats/${id}`),
  create: (data) => apiClient.post('/api/admin/stats', data),
  update: (id, data) => apiClient.put(`/api/admin/stats/${id}`, data),
  reorder: (ids) => apiClient.post('/api/admin/stats/reorder', { ids }),
  delete: (id) => apiClient.delete(`/api/admin/stats/${id}`),
};

// ── Orbit Items ───────────────────────────────────────────────────────────────
export const orbitApi = {
  getAll: () => apiClient.get('/api/portfolio/orbit'),
  getById: (id) => apiClient.get(`/api/admin/orbit/${id}`),
  create: (data) => apiClient.post('/api/admin/orbit', data),
  update: (id, data) => apiClient.put(`/api/admin/orbit/${id}`, data),
  reorder: (ids) => apiClient.post('/api/admin/orbit/reorder', { ids }),
  delete: (id) => apiClient.delete(`/api/admin/orbit/${id}`),
};

// ── Skills ────────────────────────────────────────────────────────────────────
export const skillApi = {
  getAll: (search = '') => apiClient.get('/api/portfolio/skills', { params: { search: search || undefined } }),
  getById: (id) => apiClient.get(`/api/admin/skills/${id}`),
  create: (data) => apiClient.post('/api/admin/skills', data),
  update: (id, data) => apiClient.put(`/api/admin/skills/${id}`, data),
  reorder: (ids) => apiClient.post('/api/admin/skills/reorder', { ids }),
  delete: (id) => apiClient.delete(`/api/admin/skills/${id}`),
};

// ── Experience ────────────────────────────────────────────────────────────────
export const experienceApi = {
  getAll: (type = '', search = '') =>
    apiClient.get('/api/portfolio/experience', {
      params: {
        type: type || undefined,
        search: search || undefined,
      },
    }),
  getById: (id) => apiClient.get(`/api/admin/experience/${id}`),
  create: (data) => apiClient.post('/api/admin/experience', data),
  update: (id, data) => apiClient.put(`/api/admin/experience/${id}`, data),
  reorder: (ids) => apiClient.post('/api/admin/experience/reorder', { ids }),
  delete: (id) => apiClient.delete(`/api/admin/experience/${id}`),
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const projectApi = {
  getAll: () => apiClient.get('/api/portfolio/projects'),
  search: (params = {}) =>
    apiClient.get('/api/portfolio/projects/search', { params }),
  getById: (id) => apiClient.get(`/api/admin/projects/${id}`),
  create: (data) => apiClient.post('/api/admin/projects', data),
  update: (id, data) => apiClient.put(`/api/admin/projects/${id}`, data),
  reorder: (ids) => apiClient.post('/api/admin/projects/reorder', { ids }),
  delete: (id) => apiClient.delete(`/api/admin/projects/${id}`),
};

// ── Education ─────────────────────────────────────────────────────────────────
export const educationApi = {
  getAll: () => apiClient.get('/api/portfolio/education'),
  getById: (id) => apiClient.get(`/api/admin/education/${id}`),
  create: (data) => apiClient.post('/api/admin/education', data),
  update: (id, data) => apiClient.put(`/api/admin/education/${id}`, data),
  reorder: (ids) => apiClient.post('/api/admin/education/reorder', { ids }),
  delete: (id) => apiClient.delete(`/api/admin/education/${id}`),
};

// ── Messages ──────────────────────────────────────────────────────────────────
export const messageApi = {
  submit: (name, email, message) =>
    apiClient.post('/api/messages', { name, email, message }),
  getAll: (params = {}) => apiClient.get('/api/admin/messages', { params }),
  getById: (id) => apiClient.get(`/api/admin/messages/${id}`),
  getUnreadCount: () => apiClient.get('/api/admin/messages/unread-count'),
  markAsRead: (id, isRead = true) =>
    apiClient.patch(`/api/admin/messages/${id}/read`, null, { params: { isRead } }),
  markAllAsRead: () => apiClient.post('/api/admin/messages/mark-all-read'),
  delete: (id) => apiClient.delete(`/api/admin/messages/${id}`),
  bulkDelete: (ids) => apiClient.delete('/api/admin/messages/bulk-delete', { data: ids }),
};

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadApi = {
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/admin/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/admin/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getOverview: () => apiClient.get('/api/admin/dashboard/overview'),
};
