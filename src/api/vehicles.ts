import { apiClient } from './client';
import type { VehicleResponseDto, CreateVehicleDto, VehiclePagedResult, NotificationDto, PlanDto } from '../types';

export const vehiclesApi = {
  getAll: (params?: { page?: number; pageSize?: number }) =>
    apiClient.get<VehiclePagedResult>('/vehicles', { params }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<VehicleResponseDto>(`/vehicles/${id}`).then(r => r.data),

  create: (data: CreateVehicleDto) =>
    apiClient.post<VehicleResponseDto>('/vehicles', data).then(r => r.data),

  update: (id: string, data: Partial<CreateVehicleDto>) =>
    apiClient.put<VehicleResponseDto>(`/vehicles/${id}`, data).then(r => r.data),

  uploadImage: (formData: FormData) =>
  apiClient.post<{ url: string }>('/vehicles/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
  // Add to vehiclesApi object:
search: (params = {}) =>
  apiClient.get<VehiclePagedResult>('/vehicles/search', { params }).then(r => r.data),
};

export const notificationsApi = {
  getAll: () =>
    apiClient.get<NotificationDto[]>('/notifications').then(r => r.data),

  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then(r => r.data),

  markAllRead: () =>
    apiClient.patch('/notifications/read-all').then(r => r.data),
};

export const plansApi = {
  getAll: () =>
    apiClient.get<PlanDto[]>('/plans').then(r => r.data),
};




