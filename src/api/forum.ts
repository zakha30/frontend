import { apiClient } from './client';

export const forumApi = {
  getAll: (params = {}) =>
    apiClient.get('/forum', { params }).then(r => r.data),

  create: (dto: object) =>
    apiClient.post('/forum', dto).then(r => r.data),

  getById: (id: string) =>
    apiClient.get(`/forum/${id}`).then(r => r.data),
};