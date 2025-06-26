import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleError } from '../utility/errorhandler';

const useBluetoothStore = create(persist((set) => ({
  deviceConnected: false,
  deviceName: '',
  deviceType: '',
  systolic: null,
  diastolic: null,
  pulse: null,
  bpm: null,
  spo2: null,
  glucoseValue: null,
  isScanning: false,
  permissionGranted: false,
  connectionStatus: 'disconnected',



  // updateSpO2: (spo2) => set({ spo2 }),


  updateBpReadings: ({ systolic, diastolic, pulse }) => set({ systolic, diastolic, pulse }),
  updateSpO2Readings: ({ bpm, spo2 }) => set({ bpm, spo2 }),
  updateGlucoseReading: ({ glucoseValue }) => set({ glucoseValue }),


  startScanning: () => set({ isScanning: true }),
  stopScanning: () => set({ isScanning: false }),


  connectDevice: (device) =>
    set({
      deviceConnected: true,
      connectionStatus: 'connected',
      deviceName: device.deviceName,
      deviceType: device.deviceType || '',
    }),

  disconnectDevice: () =>
    set((state) => ({
      deviceConnected: false,
      connectionStatus: 'disconnected',
      deviceName: '',
      deviceType: '',
      // keep all readings as-is
    })),

  updateReadings: (readings) =>
    set((state) => {
      switch (state.deviceType) {
        case 'A&D_UA-651BLE_87DF1B':
          return {
            systolic: readings.systolic,
            diastolic: readings.diastolic,
            pulse: readings.pulse,
          };
        case 'VTM 20F':
          return { bpm: readings.bpm, spo2: readings.spo2 };
        case 'Contour7830H8131997':
          return { glucoseValue: readings.glucoseValue };
        default:
          console.warn('Unknown device type:', state.deviceType);
          return {};
      }
    }),

  resetReadings: () =>
    set({
      systolic: null,
      diastolic: null,
      pulse: null,
      bpm: null,
      spo2: null,
      glucoseValue: null,
    }),

  saveToKeychain: async (key, value) => {
    if (!key || !value) {
      handleError('Keychain Error', 'Key or value is missing');
      // console.error('Key or value is missing');
      return;
    }
    try {
      await Keychain.setGenericPassword(key, value);
      console.log(`Data saved to Keychain under key: ${key}`);
    } catch (error) {
      handleError('Keychain Error', 'Failed to save data to Keychain');
      // console.error('Keychain Save Error:', error);
    }
  },

  getFromKeychain: async (key) => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username === key) {
        console.log(`Data retrieved from Keychain for key: ${key}`);
        return JSON.parse(credentials.password);
      }
      console.warn(`No data found in Keychain for key: ${key}`);
      return null;
    } catch (error) {
      handleError('Keychain Error', 'Failed to read data from Keychain');
      // console.error('Keychain Read Error:', error);
      return null;
    }
  },
}), {
  name: "bluetooth-store",
  storage: {
    getItem: async (key) => {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (key, value) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: async (key) => {
      await AsyncStorage.removeItem(key);
    },
  },
}));

export default useBluetoothStore;
