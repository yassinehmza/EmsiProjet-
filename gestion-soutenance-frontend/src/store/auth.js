import { create } from 'zustand';

export const useAuth = create(set => ({
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  profile: null,
  setAuth: ({ token, role, profile }) => {
    if (token) localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role);
    set({ token, role, profile });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: null, role: null, profile: null });
  },
}));
