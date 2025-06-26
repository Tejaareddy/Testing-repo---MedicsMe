import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useInitStore from '../zustand/apistore';
import useAuthStore from '../zustand/auth';
import { useNavigation } from '@react-navigation/native';
import { ccdaPayload } from '../API/payload';
import { fetchCcdaApi } from '../API/medicsapi';
import handleError from '../utility/errorhandler';
import ErrorModal from '../screens/errormodal';
import RNFS from 'react-native-fs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import styles from '../styles/ccdastyles';

import { useAlertStore } from '../zustand/alertstore';

const ContinuingCareScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('#F5FAFF', true, false);
  }, []);
  const ccdaList = useInitStore(state => state.initData?.list_ccda || []);
  const mrn = useAuthStore.getState().mrn;
  const token = useAuthStore.getState().authToken;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const showAlert = useAlertStore((state) => state.showAlert);

  const user = useAuthStore((state) => state.user);
    useEffect(() => {
      const backAction = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;  
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();  
    }, [navigation]);
  const fetchAndViewCcda = async (item) => {
    if (!item?.HistoryID || !mrn) {
      showAlert('Missing Data', 'Patient MRN or HistoryID not found.');
      return;
    }

    setLoading(true);
    try {
      const payload = ccdaPayload(mrn, item.HistoryID);
      const xmlResponse = await fetchCcdaApi(payload, token);

      if (!xmlResponse || typeof xmlResponse !== 'string') {
        throw new Error('Invalid CCDA response');
      }

      navigation.navigate('CcdaHtmlViewerScreen', { xml: xmlResponse });
    } catch (error) {
      handleError('ccda', error);
      showAlert('Error', 'Failed to download CCDA document.');
    } finally {
      setLoading(false);
    }
  };


  const downloadCcdaDocument = async (item) => {
    if (!item?.HistoryID || !mrn) {
      showAlert('Missing Data', 'Patient MRN or HistoryID not found.');
      return;
    }

    setLoading(true);
    try {
      const payload = ccdaPayload(mrn, item.HistoryID);
      const xmlResponse = await fetchCcdaApi(payload, token);

      if (!xmlResponse || typeof xmlResponse !== 'string') {
        throw new Error('Invalid CCDA response');
      }

      const fileName = `${item.ProviderName?.replace(/\s+/g, '_') || 'ccda'}_${item.HistoryID}.xml`;
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      await RNFS.writeFile(path, xmlResponse, 'utf8');

      showAlert('Download Complete', `Saved to: ${path}`);
    } catch (error) {
      handleError('ccda-download', error);
      showAlert('Error', 'Failed to download CCDA document.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ErrorModal />
      <View style={styles.cardHeader}>
        <Text style={styles.titleText}>{item?.ProviderName || 'Untitled Document'}</Text>
        <TouchableOpacity onPress={() => fetchAndViewCcda(item)}>
          <Icon name="eye" size={22} color="#4D6EC5" />
        </TouchableOpacity>
      </View>


      <TouchableOpacity
        onPress={() => downloadCcdaDocument(item)}
        style={styles.downloadBtn}
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAFF" />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#1F2D5A" />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Continuing Care</Text>

      {loading && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#4D6EC5" />
        </View>
      )}

      <FlatList
        data={ccdaList}
        keyExtractor={(item, index) => item?.HistoryID?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No CCDA documents found.</Text>
        </View>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ContinuingCareScreen;








