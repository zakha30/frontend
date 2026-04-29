import { apiClient } from './client';
export const directoryApi = {
  getAll: (params = {}) => apiClient.get('/directory', { params }).then(r => r.data),
  create: (dto: object)  => apiClient.post('/directory', dto).then(r => r.data),
};