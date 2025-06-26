import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  StatusBar,
  RefreshControl,
  Modal,
  Linking,
  BackHandler
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useAuthStore from '../zustand/auth';
import useInitStore from '../zustand/apistore';
import styles from '../styles/medicsstyles';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { getApp } from '@react-native-firebase/app';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import allergiesImage from '../Assests/allergies.png';
import { useAlertStore } from '../zustand/alertstore';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';

const Medics = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);

  const user = useAuthStore((state) => state.user);
  const firstName = user?.patient_profile?.FirstName || 'Patient';
  const authToken = useAuthStore((state) => state.authToken);
  const mrn = useAuthStore((state) => state.mrn);

  useEffect(() => {
    changeNavigationBarColor('#F8F8F8', true, false);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true // returning true disables back action
    );

    // Cleanup on unmount
    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        await useInitStore.getState().fetchInitData();
        setLoading(false);
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    const fetchNews = async (isRefresh = false) => {
      if (!isRefresh) setNewsLoading(true);
      try {
        const response = await fetch(
          'https://newsdata.io/api/1/latest?apikey=pub_ecaf9065bca543aaa6d5ab72bda4d650&q=healthcare'
        );
        const json = await response.json();
        if (json && Array.isArray(json.results)) {
          setNewsData(json.results);
        } else {
          setNewsData([]);
        }
      } catch (error) {
        showAlert('Error', 'Failed to load news feed');
        setNewsData([]);
      } finally {
        if (!isRefresh) setNewsLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const setupNotifications = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) console.log('Notification permission granted');

        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('POST_NOTIFICATIONS permission denied');
          }
        }

        const token = await messaging().getToken();

        const deviceInfo = {
          brand: DeviceInfo.getBrand(),
          model: DeviceInfo.getModel(),
          systemVersion: DeviceInfo.getSystemVersion(),
          systemName: DeviceInfo.getSystemName(),
          uniqueId: DeviceInfo.getUniqueId(),
          deviceId: DeviceInfo.getDeviceId(),
        };

        console.log('FCM Token:', token);
        console.log('Device Info:', deviceInfo);

        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });



        unsubscribe = messaging().onMessage(async remoteMessage => {
          const notif = {
            id: Date.now(),
            title: remoteMessage.notification?.title || 'New Message',
            body: remoteMessage.notification?.body || '',
          };
          setNotifications(prev => [notif, ...prev]);

          // Optionally show system notification
          await notifee.displayNotification({
            title: notif.title,
            body: notif.body,
            android: {
              channelId: 'default',
              pressAction: { id: 'default' },
            },
          });
        });
      } catch (error) {
        console.error('Error in Firebase setup:', error);
      }
    };

    setupNotifications();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigation.replace('MedicsMe');
  };

  const onDisplayNotification = async () => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: 'Test',
      body: 'Medics me',
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      <View style={styles.header}>

        <Image source={require('../Assests/Profile.png')} style={styles.avatar} />
        <View style={styles.greeting}>
          <Text style={styles.helloText}>Hello, {firstName}</Text>
          <Text style={styles.subText}>Have a good day</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationWrapper}
          onPress={() => setNotificationModalVisible(true)}
        >
          <Icon name="bell-o" size={28} color="black" />
          <View style={styles.notificationBadgeContainer}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          visible={notificationModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setNotificationModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                {notifications.length === 0 ? (
                  <Text>No notifications yet.</Text>
                ) : (
                  notifications.map(notif => (
                    <View key={notif.id} style={styles.notificationItem}>
                      <Text style={styles.notificationTitle}>{notif.title}</Text>
                      <Text>{notif.body}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setNotificationModalVisible(false)}
              >
                <Text style={{ color: 'white' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => setLogoutModalVisible(true)}>
          <MaterialIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Dashboard */}
      <Text style={styles.sectionTitle}>Patient Dashboard</Text>
      <View style={styles.grid}>
        {dashboardItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen);
              } else if (item.action) {
                item.action();
              } else if (item.title === 'Questionnarie') {
                navigation.navigate('QuestionnaireForm', { mrn, authToken });
              }
            }}
          >
            {item.image ? (
              <Image source={item.image} style={styles.iconImage} />
            ) : (
              <Icon name={item.icon} size={30} color={item.color} style={styles.icon} />
            )}
            <Text style={styles.gridText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 20, width: '100%' }}>
          <TouchableOpacity style={[styles.gridItem, { width: '30%', height: '120' }]} onPress={() => navigation.navigate('Rpm')}>
            <Icon name="heartbeat" size={30} color="#3F51B5" style={styles.icon} />
            <Text style={styles.gridText}>RPM Devices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridItem, { width: '30%', height: '120', }]} onPress={() => navigation.navigate('MicrotalkScreen')}>
            <Icon name="video-camera" size={30} color="#87CEEB" style={styles.icon} />
            <Text style={styles.gridText}>Video</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* News Feed
      <Text style={styles.sectionTitle}>News Feed</Text>
      {newsLoading ? (
        <ActivityIndicator size="large" color="#195B99" />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {newsData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.newsCardRow} onPress={() => setSelectedNewsItem(item)}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.newsImageRow} resizeMode="cover" />
              ) : (
                <View style={styles.newsImagePlaceholder} />
              )}
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsText} numberOfLines={4}>
                  {item.description || 'No description available.'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )} */}


   {/* News Feed */}
      <Text style={styles.sectionTitle}>News Feed</Text>
      {newsLoading ? (
        <ActivityIndicator size="large" color="#195B99" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {newsData.map((item, index) => (
            <TouchableOpacity
              key={index}
               style={styles.newsCardHorizontal}
               onPress={() => setSelectedNewsItem(item)}
             >
               {item.image_url ? (
                 <Image
                   source={{ uri: item.image_url }}
                   style={styles.newsImageHorizontal}
                   resizeMode="cover"
                 />
               ) : (
                 <View style={styles.newsImagePlaceholder} />
              )}

           </TouchableOpacity>
          ))}
        </ScrollView>
      )} 

      {/* News Modal */}
      {<Modal visible={!!selectedNewsItem} transparent animationType="slide" onRequestClose={() => setSelectedNewsItem(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(94, 94, 94, 0.85)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: '90%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 15,
            maxHeight: '80%',
          }}>
            <ScrollView>
              {selectedNewsItem?.image_url && (
                <Image
                  source={{ uri: selectedNewsItem.image_url }}
                  style={{ width: '100%', height: 180, borderRadius: 8 }}
            />
              )}
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{selectedNewsItem?.title}</Text>
              <Text style={{ fontSize: 14, marginVertical: 10 }}>
                {selectedNewsItem?.description || 'No description available.'}
              </Text>
              {selectedNewsItem?.link && (
                <TouchableOpacity onPress={() => Linking.openURL(selectedNewsItem.link)}>
                  <Text style={{ color: '#195B99', textDecorationLine: 'underline' }}>Read full article</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: '#195B99', padding: 10, borderRadius: 5, alignItems: 'center' }}
                onPress={() => setSelectedNewsItem(null)}
              >
                <Text style={{ color: 'white' }}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>}

      {/* Logout Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            width: '70%',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Confirm Logout</Text>
            <Text style={{ fontSize: 14, marginBottom: 20 }}>Are you sure you want to logout?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                style={{ backgroundColor: '#E7EDF6', padding: 10, borderRadius: 5, flex: 1, marginRight: 10, alignItems: 'center' }}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#F44336', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center' }}
                onPress={handleLogout}
              >
                <Text style={{ color: 'white' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const dashboardItems = [
  { title: 'Problem List', icon: 'file-text-o', color: '#4CAF50', screen: 'ProblemListScreen' },
  { title: 'Medication', icon: 'medkit', color: '#FF9800', screen: 'MedicationList' },
  { title: 'Allergies', image: allergiesImage, screen: 'AllergiesScreen' },
  { title: 'Continuing Care', icon: 'stethoscope', color: '#F44336', screen: 'ContinuingCareScreen' },
  { title: 'Handouts', icon: 'file-pdf-o', color: '#3F51B5', screen: 'HandoutScreen' },
  { title: 'Document', icon: 'folder-open', color: '#009688', screen: 'DocScreen' },
  { title: 'Lab Result', icon: 'flask', color: '#795548', screen: 'LabResultScreen' },
  { title: 'Questionnarie', icon: 'question-circle', color: '#607D8B' },
  { title: 'Inbox', icon: 'envelope', color: '#E91E63', screen: 'InboxScreen' },
];

export default Medics;