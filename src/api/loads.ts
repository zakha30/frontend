import { apiClient } from './client';
import type { AvailableLoadDto, CreateAvailableLoadDto, LoadFilterDto, PagedResult } from '../types';

export const loadsApi = {
  getAll: (filter: LoadFilterDto = {}) =>
    apiClient.get<PagedResult<AvailableLoadDto>>('/available-loads', { params: filter })
      .then(r => r.data),
  create: (dto: CreateAvailableLoadDto) =>
    apiClient.post<AvailableLoadDto>('/available-loads', dto).then(r => r.data),
  delete: (id: string) => apiClient.delete(`/available-loads/${id}`),

  getQuoteRequests: (province?: string, page = 1, pageSize = 20) =>
    apiClient.get('/quote-requests', { params: { province, page, pageSize } })
      .then(r => r.data),
  createQuoteRequest: (dto: object) =>
    apiClient.post('/quote-requests', dto).then(r => r.data),
  submitQuote: (quoteRequestId: string, dto: object) =>
    apiClient.post(`/quote-requests/${quoteRequestId}/submit-quote`, dto).then(r => r.data),
};