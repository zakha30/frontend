import { apiClient } from './client';
import type { ListingResponseDto, CreateListingDto, PagedResult } from '../types';

export const listingsApi = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<PagedResult<ListingResponseDto>>('/listings', { params }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<ListingResponseDto>(`/listings/${id}`).then(r => r.data),

  create: (data: CreateListingDto) =>
    apiClient.post<ListingResponseDto>('/listings', data).then(r => r.data),

  update: (id: string, data: Partial<CreateListingDto> & { status?: string }) =>
    apiClient.put<ListingResponseDto>(`/listings/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/listings/${id}`).then(r => r.data),

  search: (params: Record<string, unknown>) =>
    apiClient.get<PagedResult<ListingResponseDto>>('/listings/search', { params }).then(r => r.data),
};
