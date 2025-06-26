import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/loginstyles';
import { loginToMedicsApi, initMedicsApi, deviceRegistrationApi } from '../API/medicsapi';
import { getLoginPayload, getInitPayload, deviceRegistrationPayload } from '../API/payload';
import useInitStore from '../zustand/apistore';
import useAuthStore from '../zustand/auth';
import { handleError } from '../utility/errorhandler';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useAlertStore } from '../zustand/alertstore';
import { Platform as RNPlatform } from 'react-native';

const MedicsMe = () => {
  useEffect(() => {
    changeNavigationBarColor('#ffffff', true, false);
    fetchDeviceInfo();
  }, []);

  const showAlert = useAlertStore((state) => state.showAlert);
  const [searchPractice, setSearchPractice] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    device_id: '',
    device_token: '',
    device_type: '',
    ref_no: '',
  });

  const navigation = useNavigation();
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const setInitData = useInitStore((state) => state.setInitData);


  const fetchDeviceInfo = () => {

    const dynamicDeviceId = '03c89ccd-6e91-42ce-a615-e05cba73dbf5';
    const dynamicDeviceToken =
      'fKg-AUYoR_awwkzmyRVcMM:APA91bHtfG45Wl8CNpddUmymkBFzT00832HrdOovYM98bwHdewp6eAqgL3yAZYpBw7AGGbA7LXAWg3_gjZ_cszo-1LHO0-mZN9p85Oe3DzFNeni7uz4MkQQ';
    const dynamicDeviceType = RNPlatform.OS === 'ios' ? 'iOS' : 'Android';
    const dynamicRefNo = 'some-ref-no';

    setDeviceInfo({
      device_id: dynamicDeviceId,
      device_token: dynamicDeviceToken,
      device_type: dynamicDeviceType,
      ref_no: dynamicRefNo,
    });
  };

  const loginToMedics = async () => {
    if (!searchPractice || !username || !password) {
      showAlert('Fields missing', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {

      const authPayload = getLoginPayload(username, password, searchPractice);

      const authResponse = await loginToMedicsApi(authPayload);

      const authToken = authResponse.headers['auth_tocken'] || authResponse.headers['auth_token'];
      const responseData = authResponse.data;
      const mrnMatch =
        typeof responseData === 'string' ? responseData.match(/MRN:(.*?)("|$)/) : null;
      const mrn = mrnMatch ? `MRN:${mrnMatch[1].trim()}` : null;

      if (!authToken || !mrn) {
        showAlert('Login Unsuccessfull', 'Authentication failed or MRN not found.');
        setLoading(true);
        return;
      }

      setAuthData(authToken, mrn);


      await secondAPI_Hit(authToken, mrn);


      await registerDevice(authToken, mrn);

    } catch (error) {
      handleError('login', error);
      showAlert('Network Error', 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const secondAPI_Hit = async (authToken, mrn) => {
    try {
      const payload = getInitPayload(mrn, username, password, searchPractice);
      const initResponse = await initMedicsApi(payload, authToken);

      if (initResponse.status === 202) {
        setInitData(initResponse.data);
        useAuthStore.getState().setUser(initResponse.data);
        navigation.navigate('Medics');
      } else {
        handleError('login', `Login succeeded but unexpected status: ${initResponse.status}`);
      }
    } catch (error) {
      if (error.response) {
        showAlert('Init Failed', `Server Error: ${error.response.status}`);
      } else if (error.request) {
        handleError('login', 'No response from server');
        showAlert('Network Error', 'No response from server.');
      } else {
        handleError('login', error.message);
        showAlert('Error', error.message);
      }
    }
  };


  const registerDevice = async (authToken, mrn) => {
    try {
      const devicePayloadData = {
        ...deviceInfo,
        MRN: mrn,
      };

      const payload = deviceRegistrationPayload(devicePayloadData);
      const response = await deviceRegistrationApi(payload, authToken);

      if (response.status === 200 || response.status === 201) {
        console.log('Device registration success');
      } else {
        console.warn('Device registration failed', response.status);
      }
    } catch (error) {
      console.error('Device registration error:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
    

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <LinearGradient colors={['#2A5C8D', '#BFD7ED']} style={styles.topContainer}>
                <Text style={styles.headingText}>Hello,{'\n'}Welcome Back!</Text>
                <Text style={styles.subText}>
                  Please enter your email and password to access your account.
                </Text>
              </LinearGradient>

              <View style={styles.bottomContainer}>
                <Text style={styles.label}>Practice</Text>
                <TextInput
                  style={styles.inputText1}
                  placeholder="Practice title here"
                  placeholderTextColor="#999"
                  value={searchPractice}
                  onChangeText={setSearchPractice}
                />

                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.inputText1}
                  placeholder="Enter username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.inputText, { flex: 1 }]}
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Icon
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={24}
                      color="#D9D9D9"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginBtn,
                    { backgroundColor: username && password ? '#2A5C8D' : 'gray' },
                  ]}
                  onPress={loginToMedics}
                >
                  <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
       
                {loading && (
                  <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 15 }} />
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default MedicsMe;