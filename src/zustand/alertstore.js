// store/alertStore.js
import { create } from 'zustand';

export const useAlertStore = create((set) => ({
  isVisible: false,
  message: '',
  showAlert: (message) => set({ message, isVisible: true }),
  hideAlert: () => set({ isVisible: false, message: '' }),
}));
