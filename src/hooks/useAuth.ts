import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated,
    // true if logged in — all logged-in users can create/edit data
    canWrite: isAuthenticated,
    // true if user has admin role
    isAdmin: isAuthenticated && user?.role?.toLowerCase() === 'admin',
    // true if user owns a specific tenantId
    isTenant: (tenantId: string) => isAuthenticated && user?.tenantId === tenantId,
  };
};