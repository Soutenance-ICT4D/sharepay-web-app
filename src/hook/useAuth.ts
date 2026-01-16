
"use client";

export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
};

export function useAuth(): AuthState {
  return {
    user: null,
    isAuthenticated: false,
    logout: () => {},
  };
}
