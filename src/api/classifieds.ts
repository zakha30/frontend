import { apiClient } from './client';
export const classifiedsApi = {
  getAll: (params = {}) => apiClient.get('/classifieds', { params }).then(r => r.data),
  create: (dto: object)  => apiClient.post('/classifieds', dto).then(r => r.data),
  delete: (id: string)   => apiClient.delete(`/classifieds/${id}`),
};