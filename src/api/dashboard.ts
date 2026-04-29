import { apiClient } from './client';
import type {
  DashboardSummaryDto,
  MyListingsResponseDto,
  MyQuotesResponseDto,
  ReceivedQuotesResponseDto,
} from '../types';

export const dashboardApi = {
  getSummary: () =>
    apiClient.get<DashboardSummaryDto>('/dashboard/summary').then(r => r.data),

  getMyListings: (params?: { status?: string; page?: number; pageSize?: number }) =>
    apiClient.get<MyListingsResponseDto>('/dashboard/my-listings', { params }).then(r => r.data),

  getMyQuotes: (params?: { status?: string; page?: number; pageSize?: number }) =>
    apiClient.get<MyQuotesResponseDto>('/dashboard/my-quotes', { params }).then(r => r.data),

  getReceivedQuotes: (params?: { listingId?: string; status?: string; page?: number; pageSize?: number }) =>
    apiClient.get<ReceivedQuotesResponseDto>('/dashboard/received-quotes', { params }).then(r => r.data),
};
