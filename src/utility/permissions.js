// import { PermissionsAndroid, Platform } from "react-native";
// // import { handleError } from "../Utility/errorhandler";

// export const requestBluetoothPermissions = async () => {
//     if (Platform.OS === "android") {
//         try {
//             if (Platform.Version >= 31) {
//                 const granted = await PermissionsAndroid.requestMultiple([
//                     PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//                     PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 ]);

//                 if (
//                     granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED ||
//                     granted["android.permission.BLUETOOTH_CONNECT"] !== PermissionsAndroid.RESULTS.GRANTED ||
//                     granted["android.permission.ACCESS_FINE_LOCATION"] !== PermissionsAndroid.RESULTS.GRANTED
//                 ) {
//                     console.warn("Bluetooth permissions denied!");
//                 }
//             } else {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//                 );
//                 if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//                     console.warn("Location permission denied!");
//                 }
//             }
//         } catch (err) {
//             handleError("Permission Error", "Failed to request Bluetooth permissions.");
//             // console.error("Permission request error:", err);
//         }
//     }
// };

import { Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestBluetoothPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        const bluetoothScan = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Bluetooth Scan Permission',
            message: 'App needs access to scan for Bluetooth devices.',
            buttonPositive: 'OK',
          }
        );

        const bluetoothConnect = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Bluetooth Connect Permission',
            message: 'App needs access to connect with Bluetooth devices.',
            buttonPositive: 'OK',
          }
        );

        const fineLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Location access is required for Bluetooth scanning.',
            buttonPositive: 'OK',
          }
        );

        return (
          bluetoothScan === PermissionsAndroid.RESULTS.GRANTED &&
          bluetoothConnect === PermissionsAndroid.RESULTS.GRANTED &&
          fineLocation === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android < 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Location access is required for Bluetooth scanning.',
            buttonPositive: 'OK',
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } else if (Platform.OS === 'ios') {
      // iOS handles Bluetooth permissions through Info.plist declarations.
      const status = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
      if (status === RESULTS.DENIED || status === RESULTS.BLOCKED) {
        const result = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
        return result === RESULTS.GRANTED;
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
};
