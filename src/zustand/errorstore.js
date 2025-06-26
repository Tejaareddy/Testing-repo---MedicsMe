// zustand/errorStore.js
import { create } from 'zustand';

const useErrorStore = create((set) => ({
  showError: false,
  errorTitle: '',
  errorMessage: '',
  
  setError: (title, message) => set({ showError: true, errorTitle: title, errorMessage: message }),
  clearError: () => set({ showError: false, errorTitle: '', errorMessage: '' }),
}));

export default useErrorStore;
