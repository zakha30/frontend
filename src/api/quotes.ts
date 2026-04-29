import { apiClient } from './client';
import type { QuoteResponseDto, SubmitQuoteDto, PagedResult } from '../types';

export const quotesApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PagedResult<QuoteResponseDto>>('/quotes', { params }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<QuoteResponseDto>(`/quotes/${id}`).then(r => r.data),

  submit: (data: SubmitQuoteDto) =>
    apiClient.post<QuoteResponseDto>('/quotes', data).then(r => r.data),

  accept: (id: string, message?: string) =>
    apiClient.post<QuoteResponseDto>(`/quotes/${id}/accept`, { message }).then(r => r.data),

  reject: (id: string, reason: string) =>
    apiClient.post<QuoteResponseDto>(`/quotes/${id}/reject`, { reason }).then(r => r.data),

  withdraw: (id: string, reason?: string) =>
    apiClient.post<QuoteResponseDto>(`/quotes/${id}/withdraw`, { reason }).then(r => r.data),
};
