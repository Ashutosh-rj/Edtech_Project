/**
 * Centralized Authentication Storage Layer
 * 
 * Replaces localStorage with sessionStorage to enforce strict tab-level isolation
 * and prevent multi-role session contamination across browser tabs.
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'loggedInUser';
const ROLE_KEY = 'role';

export const authStorage = {
  // --- Access Token ---
  setAccessToken: (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  getAccessToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  // --- Current User ---
  setCurrentUser: (email: string) => {
    sessionStorage.setItem(USER_KEY, email);
  },
  getCurrentUser: (): string | null => {
    return sessionStorage.getItem(USER_KEY);
  },

  // --- Roles / Permissions ---
  setRole: (role: string) => {
    sessionStorage.setItem(ROLE_KEY, role);
  },
  getRole: (): string | null => {
    return sessionStorage.getItem(ROLE_KEY);
  },

  // --- Session Management ---
  clearSession: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ROLE_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem(TOKEN_KEY);
  }
};
