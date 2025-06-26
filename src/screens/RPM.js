// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';
// import styles from '../styles/rpmstyles';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import useBluetoothStore from '../zustand/store';
// import { requestBluetoothPermissions } from '../utility/permissions';
// import { handleError } from '../utility/errorhandler';
// import ErrorModal from '../screens/errormodal';
// import { useNavigation } from '@react-navigation/native';
// import useInitStore from '../zustand/apistore';
// import changeNavigationBarColor from 'react-native-navigation-bar-color';
// import { useAlertStore } from '../zustand/alertstore';


// const { width } = Dimensions.get('window');
// const manager = new BleManager();

// const DEVICE_LABELS = {
//   NIBP: 'NIBP',
//   SPO2: 'SpO2',
//   GLUCOSE: 'Glucose',
// };

// const Rpm = () => {
//   useEffect(() => {
//     changeNavigationBarColor('#ffffff', true, false);
//   }, []);
//   const RPMDetailsInit = useInitStore((state) => state.RPMDetailsInit);

//   const tabs = [
//     ...new Set(
//       RPMDetailsInit
//         .map(device => device.device_code.trim().toUpperCase())
//         .filter(code => DEVICE_LABELS[code])
//     )
//   ];

//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState(tabs[0] || null);
//   const [glucoseValue, setGlucoseValue] = useState(null);
//   const showAlert = useAlertStore((state) => state.showAlert);
//   const {
//     systolic,
//     diastolic,
//     pulse,
//     bpm,
//     spo2,
//     isScanning,
//     startScanning,
//     stopScanning,
//     connectDevice,
//     disconnectDevice,
//     updateReadings,
//     resetReadings,
//     saveToKeychain,
//     updateSpO2Readings,
//     updateGlucoseReading,
//   } = useBluetoothStore();
//   useEffect(() => {
//     if (tabs.length > 0 && !activeTab) {
//       setActiveTab(tabs[0]);
//     }
//   }, [tabs]);
//   useEffect(() => {
//     const init = async () => {
//       await requestBluetoothPermissions();


//       const subscription = manager.onStateChange((state) => {
//         if (state === 'PoweredOff') {
//           handleError(
//             'Bluetooth is Off',
//             'Please enable Bluetooth to scan for devices.',
//             [{ text: 'OK' }]
//           );
//         } else if (state === 'PoweredOn') {
//           startScan(activeTab);
//         }
//       }, true);
//     };

//     init();

//     return () => {
//       manager.stopDeviceScan();
//       disconnectDevice();
//     };
//   }, [activeTab]);


//   const startScan = (tab) => {
//     if (!tab) return;
//     manager.stopDeviceScan();
//     startScanning();

//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         stopScanning();
//         return;
//       }

//       const name = device?.name;
//       if (tab === 'NIBP' && name === 'A&D_UA-651BLE_87DF1B') {
//         connectNIBP(device);
//       } else if (tab === 'SPO2' && name === 'VTM 20F') {
//         connectSpo2(device);
//       } else if (tab === 'GLUCOSE' && name === 'Contour7830H8131997') {
//         connectGlucose(device);
//       }
//     });
//   };

//   const connectNIBP = async (device) => {
//     try {
//       const connectedDevice = await device.connect();
//       await connectedDevice.discoverAllServicesAndCharacteristics();
//       connectDevice({ deviceName: connectedDevice.name, deviceType: device.name });

//       connectedDevice.onDisconnected(disconnectDevice);
//       monitorNIBP(connectedDevice);
//     } catch {
//       handleError('Connection Error', 'Unable to connect to the NIBP device.');
//     } finally {
//       manager.stopDeviceScan();
//       stopScanning();
//     }
//   };

//   const monitorNIBP = async (device) => {
//     const serviceUUID = '00001810-0000-1000-8000-00805f9b34fb';
//     const characteristicUUID = '00002a35-0000-1000-8000-00805f9b34fb';

//     try {
//       const services = await device.services();
//       for (const service of services) {
//         const characteristics = await service.characteristics();
//         for (const characteristic of characteristics) {
//           if (service.uuid === serviceUUID && characteristic.uuid === characteristicUUID) {
//             const subscription = characteristic.monitor((error, characteristic) => {
//               if (error || !characteristic?.value) return;

//               const hexData = Buffer.from(characteristic.value, 'base64').toString('hex');
//               const systolic = parseInt(hexData.slice(2, 4), 16);
//               const diastolic = parseInt(hexData.slice(4, 8), 16);
//               const pulse = parseInt(hexData.slice(12, 16), 16);

//               updateReadings({ systolic, diastolic, pulse });
//               saveToKeychain('BPData', JSON.stringify({ systolic, diastolic, pulse }));

//               setTimeout(async () => {
//                 subscription.remove();
//                 await device.cancelConnection();
//               }, 2400000);
//             });
//           }
//         }
//       }
//     } catch (error) {
//       handleError('Monitoring Error', 'Unable to monitor NIBP data.');
//     }
//   };

//   const connectSpo2 = async (device) => {
//     try {
//       const connectedDevice = await device.connect();
//       await connectedDevice.discoverAllServicesAndCharacteristics();
//       connectDevice({ deviceName: connectedDevice.name, deviceType: device.name });

//       connectedDevice.onDisconnected(disconnectDevice);
//       monitorSpO2(connectedDevice);
//     } catch (error) {
//       handleError('Connection Error', 'Unable to connect to the SpO2 device.');
//     } finally {
//       manager.stopDeviceScan();
//       stopScanning();
//     }
//   };

//   const monitorSpO2 = async (device) => {
//     const serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
//     const characteristicUUID = '0000ffe4-0000-1000-8000-00805f9b34fb';

//     try {
//       const services = await device.services();
//       for (const service of services) {
//         const characteristics = await service.characteristics();
//         for (const char of characteristics) {
//           if (service.uuid === serviceUUID && char.uuid === characteristicUUID) {
//             char.monitor((error, characteristic) => {
//               if (error || !characteristic?.value) return;

//               try {
//                 const data = Buffer.from(characteristic.value, 'base64');
//                 const byteArray = Array.from(data);

//                 if (byteArray.length >= 6 && byteArray[0] === 254 && byteArray[1] === 10) {
//                   const prValue = (byteArray[3] << 8) | byteArray[4];
//                   const spo2Value = byteArray[5];
//                   const bpm = prValue > 0 ? prValue : null;
//                   const spo2 = spo2Value > 0 ? spo2Value : null;

//                   updateSpO2Readings({ bpm, spo2 });
//                   saveToKeychain('PulseOximeterData', JSON.stringify({ bpm, spo2 }));
//                 }
//               } catch {
//                 handleError('Data Parsing Error', 'Unrecognized SpO2 data format.');
//               }
//             });
//           }
//         }
//       }
//     } catch (error) {
//       handleError('Monitoring Error', 'Unable to monitor SpO2 data.');
//     }
//   };

//   const connectGlucose = async (device) => {
//     try {
//       const connectedDevice = await device.connect();
//       await connectedDevice.discoverAllServicesAndCharacteristics();
//       connectDevice({ deviceName: connectedDevice.name, deviceType: device.name });

//       connectedDevice.onDisconnected(disconnectDevice);
//       monitorGlucose(connectedDevice);
//     } catch (error) {
//       handleError('Connection Error', 'Unable to connect to the Glucose device.');
//     } finally {
//       manager.stopDeviceScan();
//       stopScanning();
//     }
//   };

//   const monitorGlucose = async (device) => {
//     const serviceUUID = '00001808-0000-1000-8000-00805f9b34fb';
//     const characteristicUUID = '00002a18-0000-1000-8000-00805f9b34fb';

//     try {
//       const services = await device.services();
//       for (const service of services) {
//         const characteristics = await service.characteristics();
//         for (const characteristic of characteristics) {
//           if (characteristic.uuid.toLowerCase() === characteristicUUID.toLowerCase()) {
//             characteristic.monitor((error, char) => {
//               if (error || !char?.value) return;

//               const hexData = Buffer.from(char.value, 'base64').toString('hex');
//               const glucose = parseInt(hexData.slice(24, 26), 16);
//               setGlucoseValue(glucose);
//             });
//           }
//         }
//       }
//     } catch {
//       handleError('Monitoring Error', 'Unable to monitor Glucose data.');
//     }
//   };

//   const getFooterText = () => {
//     switch (activeTab) {
//       case 'SPO2':
//         return 'A normal SpO₂ level typically ranges from 95% to 100%';
//       case 'GLUCOSE':
//         return 'For adults, a fasting blood glucose level is typically 70–100 mg/dL';
//       case 'NIBP':
//       default:
//         return 'A healthy systolic blood pressure is less than 120 mm Hg';
//     }
//   };
//   const handlesave = () => {
//     let savedData = {};

//     if (activeTab === 'NIBP' && systolic && diastolic && pulse) {
//       savedData = { systolic, diastolic, pulse };
//       saveToKeychain('Refill_BPData', JSON.stringify(savedData));
//     } else if (activeTab === 'SPO2' && bpm && spo2) {
//       savedData = { bpm, spo2 };
//       saveToKeychain('Refill_PulseOximeterData', JSON.stringify(savedData));
//     } else if (activeTab === 'GLUCOSE' && glucoseValue) {
//       savedData = { glucose: glucoseValue };
//       saveToKeychain('Refill_GlucoseData', JSON.stringify(savedData));
//     } else {
//       showAlert('Missing Data', 'No readings available to save.');
//       return;
//     }

//     showAlert('Values saved successfully');
//   };
//   return (
//     <LinearGradient colors={['#2A5C8D', '#ffffff']} style={styles.gradient}>
//       <ErrorModal />
//       <SafeAreaView style={{ flex: 1 }}>
//         <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerText}>RPM Devices</Text>
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabContainer}>
//           {tabs.map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={[styles.tab, activeTab === tab && styles.activeTab]}
//               onPress={() => setActiveTab(tab)}
//             >
//               <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Device Display */}
//         <View style={styles.deviceContainer}>
//           <View style={styles.deviceBox}>
//             <View style={styles.screen}>
//               {activeTab === 'NIBP' && (
//                 <View style={styles.readingScreen}>
//                   <Text style={styles.readingTitle}>Blood Pressure</Text>
//                   <Text style={styles.readingValue}>
//                     {(systolic !== null && diastolic !== null) ? `${systolic} / ${diastolic}` : '-- / --'}
//                   </Text>
//                   <Text style={styles.readingLabel}>Heart Rate</Text>
//                   <Text style={styles.readingValue}>{pulse || '--'}</Text>
//                 </View>
//               )}
//               {activeTab === 'SPO2' && (
//                 <View style={styles.readingScreen}>
//                   <Text style={styles.readingTitle}>Heart Rate</Text>
//                   <Text style={styles.readingValue}>{bpm ?? '--'}</Text>
//                   <Text style={[styles.readingTitle, { marginTop: 20 }]}>SpO₂</Text>
//                   <Text style={styles.readingValue}>{spo2 ?? '--'}</Text>
//                 </View>
//               )}
//               {activeTab === 'GLUCOSE' && (
//                 <View style={styles.glucoseContainer}>
//                   <Text style={styles.glucoseTitle}>Glucose Value</Text>
//                   <Text style={styles.glucoseValue}>{glucoseValue ? `${glucoseValue} mg/dL` : '--'}</Text>
//                   <Icon name="opacity" size={40} color="#6200ea" />
//                 </View>
//               )}
//             </View>
//             <View style={styles.bottomContainerLight}>
//               {isScanning ? (
//                 <View style={{ alignItems: 'center', marginTop: 2 }}>
//                   <ActivityIndicator size="small" color="#1e3a8a" />
//                   {/* <Text style={{ color: '#1e3a8a', marginTop: 6 }}>Scanning for Devices...</Text> */}
//                 </View>
//               ) : (
//                 <TouchableOpacity onPress={resetReadings} style={styles.refreshButton}>
//                   <Icon name="refresh" size={24} color="#1e3a8a" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </View>

//         {/* Status Legend */}
//         {/* <View style={styles.legendContainer}>
//           {['#00C851', '#ffbb33', '#ff4444'].map((color, i) => (
//             <View key={i} style={styles.legendItem}>
//               <View style={[styles.legendDot, { backgroundColor: color }]} />
//               <Text style={styles.legendText}>
//                 {['Normal', 'Wakeup', 'Danger'][i]}
//               </Text>
//             </View>
//           ))}
//         </View> */}

//         <View style={{ alignItems: 'center', marginTop: -20 }}>
//           <TouchableOpacity
//             onPress={handlesave}
//             style={{
//               backgroundColor: '#1e3a8a',
//               paddingVertical: 12,
//               paddingHorizontal: 40,
//               borderRadius: 25,

//             }}
//           >
//             <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>save</Text>
//           </TouchableOpacity>
//         </View>
//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerTitle}>Health is wealth</Text>
//           <Text style={styles.footerSub}>{getFooterText()}</Text>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// export default Rpm;
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import styles from '../styles/rpmstyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useBluetoothStore from '../zustand/store';
import { requestBluetoothPermissions } from '../utility/permissions';
import { handleError } from '../utility/errorhandler';
import ErrorModal from '../screens/errormodal';
import { useNavigation } from '@react-navigation/native';
import useInitStore from '../zustand/apistore';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useAlertStore } from '../zustand/alertstore';

const { width } = Dimensions.get('window');
const manager = new BleManager();

const DEVICE_LABELS = {
  NIBP: 'NIBP',
  SPO2: 'SpO2',
  GLUCOSE: 'Glucose',
};

const SCAN_TIMEOUT = 100000; // 10 seconds

const Rpm = () => {
  useEffect(() => {
    changeNavigationBarColor('#ffffff', true, false);
  }, []);
  const RPMDetailsInit = useInitStore((state) => state.RPMDetailsInit);

  const tabs = [
    ...new Set(
      RPMDetailsInit
        .map(device => device.device_code.trim().toUpperCase())
        .filter(code => DEVICE_LABELS[code])
    )
  ];

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(tabs[0] || null);
  const [glucoseValue, setGlucoseValue] = useState(null);
  const showAlert = useAlertStore((state) => state.showAlert);

  const {
    systolic,
    diastolic,
    pulse,
    bpm,
    spo2,
    isScanning,
    startScanning,
    stopScanning,
    connectDevice,
    disconnectDevice,
    updateReadings,
    resetReadings,
    saveToKeychain,
    updateSpO2Readings,
    updateGlucoseReading,
  } = useBluetoothStore();

  // For cleanup and connection reference
  const scanTimeoutRef = useRef(null);
  const connectedDeviceRef = useRef(null);
  const timeoutRef = useRef < NodeJS.Timeout | null > (null);


  // --- Helper: Clear all readings based on tab ---
  const clearTabReadings = (tab) => {
    resetReadings();
    setGlucoseValue(null);
    // Always clear SpO2 readings on tab switch
    updateSpO2Readings({ bpm: null, spo2: null });
  };

  // --- Disconnect, cleanup, and clear values ---
  const disconnectAndCleanup = async (tabToClear) => {
    manager.stopDeviceScan();
    stopScanning();
    if (connectedDeviceRef.current) {
      try {
        await connectedDeviceRef.current.cancelConnection();
      } catch (e) { }
      connectedDeviceRef.current = null;
    }
    disconnectDevice();
    clearTabReadings(tabToClear);
    clearTimeout(scanTimeoutRef.current);
  };

  // --- Scan and connect logic ---
  const startScan = async (tab) => {
    await disconnectAndCleanup(tab); // Always clear previous values and disconnect

    const permissionGranted = await requestBluetoothPermissions();
    if (!permissionGranted) {
      handleError(
        'Bluetooth Permission',
        'Bluetooth permissions are required. Please enable them in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    startScanning();

    let scanStopped = false;

    manager.startDeviceScan(null, null, (error, device) => {
      if (scanStopped) return;
      if (error) {
        stopScanning();
        scanStopped = true;
        return;
      }
      const name = device?.name;
      if (tab === 'NIBP' && name === 'A&D_UA-651BLE_87DF1B') {
        manager.stopDeviceScan();
        stopScanning();
        scanStopped = true;
        connectNIBP(device);
      } else if (tab === 'SPO2' && name === 'VTM 20F') {
        manager.stopDeviceScan();
        stopScanning();
        scanStopped = true;
        connectSpo2(device);
      } else if (tab === 'GLUCOSE' && name === 'Contour7830H8131997') {
        manager.stopDeviceScan();
        stopScanning();
        scanStopped = true;
        connectGlucose(device);
      }
    });

    // Scan timeout for robustness
    clearTimeout(scanTimeoutRef.current);
    scanTimeoutRef.current = setTimeout(() => {
      manager.stopDeviceScan();
      stopScanning();
      scanStopped = true;
      handleError('Device Not Found', 'No compatible device found. Please try again.');
    }, SCAN_TIMEOUT);
  };

  // --- Connection functions (show alert on connect) ---
  const connectNIBP = async (device) => {
    try {
      const connectedDevice = await device.connect();
      connectedDeviceRef.current = connectedDevice;
      await connectedDevice.discoverAllServicesAndCharacteristics();
      connectDevice({ deviceName: connectedDevice.name, deviceType: device.name });
      // showAlert('Device connected');
      connectedDevice.onDisconnected(() => {
        disconnectDevice();
        connectedDeviceRef.current = null;
      });
      monitorNIBP(connectedDevice);
    } catch {
      handleError('Connection Error', 'Unable to connect to the NIBP device.');
    } finally {
      manager.stopDeviceScan();
      stopScanning();
    }
  };

  const monitorNIBP = async (device) => {
    const serviceUUID = '00001810-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a35-0000-1000-8000-00805f9b34fb';

    try {
      const services = await device.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const characteristic of characteristics) {
          if (service.uuid === serviceUUID && characteristic.uuid === characteristicUUID) {
            const subscription = characteristic.monitor((error, characteristic) => {
              if (error || !characteristic?.value) return;

              const hexData = Buffer.from(characteristic.value, 'base64').toString('hex');
              const systolic = parseInt(hexData.slice(2, 4), 16);
              const diastolic = parseInt(hexData.slice(4, 8), 16);
              const pulse = parseInt(hexData.slice(12, 16), 16);

              updateReadings({ systolic, diastolic, pulse });
              saveToKeychain('BPData', JSON.stringify({ systolic, diastolic, pulse }));

              setTimeout(async () => {
                subscription.remove();
                await device.cancelConnection();
              }, 2400000);
            });
          }
        }
      }
    } catch (error) {
      handleError('Monitoring Error', 'Unable to monitor NIBP data.');
    }
  };

  const connectSpo2 = async (device) => {
    try {
      const connectedDevice = await device.connect();
      connectedDeviceRef.current = connectedDevice;
      await connectedDevice.discoverAllServicesAndCharacteristics();
      connectDevice({ deviceName: connectedDevice.name, deviceType: device.name });
      connectedDevice.onDisconnected(() => {
        disconnectDevice();
        connectedDeviceRef.current = null;
        // Clear SpO2 readings on disconnect
        updateSpO2Readings({ bpm: null, spo2: null });
      });
      monitorSpO2(connectedDevice);
    } catch (error) {
      handleError('Connection Error', 'Unable to connect to the SpO2 device.');
    } finally {
      manager.stopDeviceScan();
      stopScanning();
    }
  };

  const monitorSpO2 = async (device) => {
    const serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '0000ffe4-0000-1000-8000-00805f9b34fb';

    try {
      const services = await device.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const char of characteristics) {
          if (service.uuid === serviceUUID && char.uuid === characteristicUUID) {
            char.monitor((error, characteristic) => {
              if (error || !characteristic?.value) return;

              try {
                const data = Buffer.from(characteristic.value, 'base64');
                const byteArray = Array.from(data);

                if (byteArray.length >= 6 && byteArray[0] === 254 && byteArray[1] === 10) {
                  const prValue = (byteArray[3] << 8) | byteArray[4];
                  const spo2Value = byteArray[5];
                  // Filter out invalid values
                  const bpm = (prValue > 0 && prValue < 350 && prValue !== 511) ? prValue : null;
                  const spo2 = (spo2Value > 0 && spo2Value <= 120 && spo2Value !== 127) ? spo2Value : null;

                  updateSpO2Readings({ bpm, spo2 });
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }

                  timeoutRef.current = setTimeout(() => {
                    updateSpO2Readings(null);
                  }, 60000);
                  saveToKeychain('PulseOximeterData', JSON.stringify({ bpm, spo2 }));
                }
              } catch {
                handleError('Data Parsing Error', 'Unrecognized SpO2 data format.');
              }
            });
          }
        }
      }
    } catch (error) {
      handleError('Monitoring Error', 'Unable to monitor SpO2 data.');
    }
  };


  const connectGlucose = async (device) => {
    try {
      const connectedDevice = await device.connect();
      connectedDeviceRef.current = connectedDevice;
      await connectedDevice.discoverAllServicesAndCharacteristics();
      connectDevice({ deviceName: connectedDevice.name, deviceType: device.name });
      // showAlert('Device connected');
      connectedDevice.onDisconnected(() => {
        disconnectDevice();
        connectedDeviceRef.current = null;
      });
      monitorGlucose(connectedDevice);
    } catch (error) {
      handleError('Connection Error', 'Unable to connect to the Glucose device.');
    } finally {
      manager.stopDeviceScan();
      stopScanning();
    }
  };

  const monitorGlucose = async (device) => {
    const serviceUUID = '00001808-0000-1000-8000-00805f9b34fb';
    const characteristicUUID = '00002a18-0000-1000-8000-00805f9b34fb';

    try {
      const services = await device.services();
      for (const service of services) {
        const characteristics = await service.characteristics();
        for (const characteristic of characteristics) {
          if (characteristic.uuid.toLowerCase() === characteristicUUID.toLowerCase()) {
            characteristic.monitor((error, char) => {
              if (error || !char?.value) return;

              const hexData = Buffer.from(char.value, 'base64').toString('hex');
              const glucose = parseInt(hexData.slice(24, 26), 16);
              setGlucoseValue(glucose);
              updateGlucoseReading(glucose);
              saveToKeychain('GlucoseData', JSON.stringify({ glucose }));
            });
          }
        }
      }
    } catch {
      handleError('Monitoring Error', 'Unable to monitor Glucose data.');
    }
  };

  // --- Tab switch effect: disconnect, clear, and scan for new tab ---
  useEffect(() => {
    if (activeTab) {
      startScan(activeTab);
    }
    return () => {
      disconnectAndCleanup(activeTab);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // --- Refresh button handler ---
  const handleRefresh = () => {
    startScan(activeTab);
  };

  // --- Footer text helper ---
  const getFooterText = () => {
    switch (activeTab) {
      case 'SPO2':
        return 'A normal SpO₂ level typically ranges from 95% to 100%';
      case 'GLUCOSE':
        return 'For adults, a fasting blood glucose level is typically 70–100 mg/dL';
      case 'NIBP':
      default:
        return 'A healthy systolic blood pressure is less than 120 mm Hg';
    }
  };

  const handlesave = () => {
    let savedData = {};

    if (activeTab === 'NIBP' && systolic && diastolic && pulse) {
      savedData = { systolic, diastolic, pulse };
      saveToKeychain('Refill_BPData', JSON.stringify(savedData));
    } else if (activeTab === 'SPO2' && bpm && spo2) {
      savedData = { bpm, spo2 };
      saveToKeychain('Refill_PulseOximeterData', JSON.stringify(savedData));
    } else if (activeTab === 'GLUCOSE' && glucoseValue) {
      savedData = { glucose: glucoseValue };
      saveToKeychain('Refill_GlucoseData', JSON.stringify(savedData));
    } else {
      showAlert('Missing Data', 'No readings available to save.');
      return;
    }

    showAlert('Values saved successfully');
  };

  return (
    <LinearGradient colors={['#2A5C8D', '#ffffff']} style={styles.gradient}>
      <ErrorModal />
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>RPM Devices</Text>
        </View>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Device Display */}
        <View style={styles.deviceContainer}>
          <View style={styles.deviceBox}>
            <View style={styles.screen}>
              {activeTab === 'NIBP' && (
                <View style={styles.readingScreen}>
                  <Text style={styles.readingTitle}>Blood Pressure</Text>
                  <Text style={styles.readingValue}>
                    {(systolic !== null && diastolic !== null) ? `${systolic} / ${diastolic}` : '-- / --'}
                  </Text>
                  <Text style={styles.readingLabel}>Heart Rate</Text>
                  <Text style={styles.readingValue}>{pulse || '--'}</Text>
                </View>
              )}
              {activeTab === 'SPO2' && (
                <View style={styles.readingScreen}>
                  <Text style={styles.readingTitle}>Heart Rate</Text>
                  <Text style={styles.readingValue}>{bpm ?? '--'}</Text>
                  <Text style={[styles.readingTitle, { marginTop: 20 }]}>SpO₂</Text>
                  <Text style={styles.readingValue}>{spo2 ?? '--'}</Text>
                </View>
              )}
              {activeTab === 'GLUCOSE' && (
                <View style={styles.glucoseContainer}>
                  <Text style={styles.glucoseTitle}>Glucose Value</Text>
                  <Text style={styles.glucoseValue}>{glucoseValue ? `${glucoseValue} mg/dL` : '--'}</Text>
                  <Icon name="opacity" size={40} color="#6200ea" />
                </View>
              )}
            </View>
            <View style={styles.bottomContainerLight}>
              {isScanning ? (
                <View style={{ alignItems: 'center', marginTop: 2 }}>
                  <ActivityIndicator size="small" color="#1e3a8a" />
                </View>
              ) : (
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                  <Icon name="refresh" size={24} color="#1e3a8a" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: -20 }}>
          <TouchableOpacity
            onPress={handlesave}
            style={{
              backgroundColor: '#1e3a8a',
              paddingVertical: 12,
              paddingHorizontal: 40,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>save</Text>
          </TouchableOpacity>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Health is wealth</Text>
          <Text style={styles.footerSub}>{getFooterText()}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Rpm;




