import { create } from 'zustand';

export const useUI = create(set => ({
  toasts: [],
  addToast: ({ type = 'success', message }) => set(state => ({
    toasts: [...state.toasts, { id: Date.now(), type, message }]
  })),
  removeToast: id => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
