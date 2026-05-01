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

  // ✨ NEW: Upload image for a specific vehicle (requires fleetId)
  uploadImage: (vehicleId: string, formData: FormData) =>
    apiClient.post<{ url: string }>(
      `/vehicles/${vehicleId}/images`,  // ← matches backend route
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data),

  getImages: (vehicleId: string) =>
    apiClient.get(`/vehicles/${vehicleId}/images`).then(r => r.data),

  deleteImage: (imageId: number) =>  // ← int
    apiClient.delete(`/vehicles/images/${imageId}`).then(r => r.data),
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