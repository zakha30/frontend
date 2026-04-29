import { apiClient } from './client';
import type { PlanDto, PaginatedResponse } from '../types';

export const plansApi = {
  /**
   * Get all available subscription plans
   */
  getAll: async (params?: { page?: number; pageSize?: number }) => {
    const { data } = await apiClient.get<PaginatedResponse<PlanDto>>(
      '/api/plans',
      { params }
    );
    return data;
  },

  /**
   * Get plan by ID
   */
  getById: async (id: string) => {
    const { data } = await apiClient.get<PlanDto>(`/api/plans/${id}`);
    return data;
  },
};