import apiClient from './apiClient';

export const authApi = {
  login: (email, password) =>
    apiClient.post('/api/auth/login', { email, password }),

  refresh: (refreshToken) =>
    apiClient.post('/api/auth/refresh', { refreshToken }),

  logout: (refreshToken) =>
    apiClient.post('/api/auth/logout', { refreshToken }),

  changePassword: (currentPassword, newPassword) =>
    apiClient.post('/api/auth/change-password', { currentPassword, newPassword }),

  getMe: () =>
    apiClient.get('/api/auth/me'),
};
