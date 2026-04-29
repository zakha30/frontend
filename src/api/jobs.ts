import { apiClient } from './client';
export const jobsApi = {
  getAll: (params = {}) => apiClient.get('/job-seekers', { params }).then(r => r.data),
  create: (dto: object)  => apiClient.post('/job-seekers', dto).then(r => r.data),
};