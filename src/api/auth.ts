import { apiClient } from './client';
import type { UserDto } from '../types';

// ── Response shape from the new cookie-based auth endpoints ──────────────────
// Tokens are now in HttpOnly cookies — the body only returns the safe user info.
export interface AuthResponseDto {
  user: UserDto;
  accessTokenExpiresAt: string;
}

export const authApi = {
  login: (data: { email: string; password: string; tenantSlug: string }) =>
    apiClient.post<AuthResponseDto>('/auth/login', data).then(r => r.data),

  register: (data: {
    firstName: string; lastName: string; email: string; password: string;
    tenantName: string; tenantSlug: string; planId: string;
  }) => apiClient.post<AuthResponseDto>('/auth/register', data).then(r => r.data),

  // Called automatically by the 401 interceptor — no arguments needed.
  // Backend reads the refresh token from its HttpOnly cookie.
  refresh: () =>
    apiClient.post<AuthResponseDto>('/auth/refresh').then(r => r.data),

  // Revokes refresh token server-side and clears both cookies.
  // No body needed — backend reads refresh cookie directly.
  logout: () =>
    apiClient.post('/auth/logout').catch(() => {}),

  // Rehydrate auth state after a page refresh without hitting localStorage.
  // Returns the user from their valid access token cookie.
  me: (): Promise<UserDto> =>
    apiClient.get<{ userId: string; tenantId: string; email: string; role: string; fullName: string }>(
      '/auth/me'
    ).then(r => ({
      id:       r.data.userId,
      tenantId: r.data.tenantId,
      email:    r.data.email,
      role:     r.data.role,
      fullName: r.data.fullName,
    })),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.patch('/auth/change-password', data).then(r => r.data),
};
