import { create } from 'zustand';
import type { UserDto } from '../types';

// ── What we store ─────────────────────────────────────────────────────────────
// With HttpOnly cookie auth, we NEVER store tokens in localStorage.
// A stolen token from localStorage can be used by any script on any page.
// HttpOnly cookies are invisible to JavaScript — XSS cannot steal them.
//
// We store only the non-sensitive user profile (name, email, role) in
// localStorage so the UI can render immediately on page load without
// making a network request. If the cookie is invalid, the first API call
// will return 401 → silent refresh → re-login if refresh also fails.

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isHydrating: boolean;           // true while /auth/me is in-flight on startup
  setUser: (user: UserDto) => void;
  clearAuth: () => void;
  setHydrating: (v: boolean) => void;
}

const storedUser = (() => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as UserDto) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  user:            storedUser,
  isAuthenticated: !!storedUser,
  isHydrating:     false,

  setUser: (user) => {
    // Persist only the safe user profile — no tokens, no secrets.
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  setHydrating: (v) => set({ isHydrating: v }),
}));
