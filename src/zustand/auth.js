// src/zustand/authStore.js

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  authToken: '',
  mrn: '',
  user :'',
  id:'',
  setUser: (user,id) => set({ user ,id}),
  logout: () => set({ user: null, id: null }),
  setAuthData: (token, mrn) => set({ authToken: token, mrn: mrn }),

  clearAuthData: () => set({ authToken: '', mrn: '' }),
}));

export default useAuthStore;
