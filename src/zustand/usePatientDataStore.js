import { create } from 'zustand';

const usePatientDataStore = create((set) => ({
  data: null,
  setData: (newData) => set({ data: newData }),
}));

export default usePatientDataStore;
