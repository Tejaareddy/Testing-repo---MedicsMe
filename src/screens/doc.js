// import React, { useState } from 'react';
// import {
//   View, Text, FlatList, StyleSheet,
//   TouchableOpacity, Alert
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import RNFS from 'react-native-fs';
// import { useNavigation } from '@react-navigation/native';
// import useInitStore from '../zustand/apistore';
// import { documentPayload } from '../API/payload';
// import { fetchDocumentApi } from '../API/medicsapi';
// import useAuthStore from '../zustand/auth';
// import FileViewer from 'react-native-file-viewer';


// const DocScreen = () => {
//   const navigation = useNavigation();
//   const documents = useInitStore(state => state.initData?.list_documents || []);
//   const token = useAuthStore.getState().authToken;
//   const mrn = useAuthStore.getState().mrn?.replace(/^MRN:/, '');
//   const [loading, setLoading] = useState(false);

//   const fetchDocContent = async (item) => {
//     if (!item.is_file_exist) return;
//     try {
//       setLoading(true);
//       const payload = documentPayload(mrn, item.Id);
//       const response = await fetchDocumentApi(payload, token);
//       const rawData = response?.data;

//       if (item.file_type === '.pdf') {
//         const path = `${RNFS.DocumentDirectoryPath}/doc_${item.Id}.pdf`;
//         await RNFS.writeFile(path, rawData, 'base64');
//         await FileViewer.open(path, { showOpenWithDialog:false });
//       } else if (item.file_type === '.txt') {
//        const path = `${RNFS.DocumentDirectoryPath}/doc_${item.Id}.pdf`;
//         await RNFS.writeFile(path, rawData, 'utf8');
//         await FileViewer.open(path, { showOpenWithDialog: false });
//       } else {
//         Alert.alert('Unsupported File', 'Only PDF and TXT files are supported.');
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//       Alert.alert('Error', 'Failed to load document.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNavigateToUpload = () => {
//     navigation.navigate('ComposeMessageScreen');
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <Text style={styles.label}>Name: <Text style={styles.value}>{item.document_name}</Text></Text>
//       <Text style={styles.label}>Type: <Text style={styles.value}>{item.file_type}</Text></Text>
//       <Text style={styles.label}>Category: <Text style={styles.value}>{item.catergory}</Text></Text>
//       <TouchableOpacity onPress={() => fetchDocContent(item)} style={styles.iconContainer}>
//         <Icon name="file-eye" size={40} color="#2196F3" />
//         <Text style={styles.value}>Tap to view</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Documents</Text>

//       <FlatList
//         data={documents}
//         keyExtractor={(item, index) => item?.Id?.toString() || index.toString()}
//         renderItem={renderItem}
//         ListEmptyComponent={<Text>No documents found</Text>}
//       />

//       <TouchableOpacity onPress={handleNavigateToUpload} style={styles.uploadBtn}>
//         <Text style={styles.uploadText}>Upload Image</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
//   itemContainer: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10 },
//   label: { fontWeight: '600', color: '#444' },
//   value: { color: '#222' },
//   iconContainer: { alignItems: 'center', marginVertical: 10 },
//   uploadBtn: {
//     marginTop: 16,
//     backgroundColor: '#4CAF50',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   uploadText: { color: '#fff', fontWeight: 'bold' },
// });

// export default DocScreen;

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, ActivityIndicator, StatusBar, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import useInitStore from '../zustand/apistore';
import { documentPayload } from '../API/payload';
import { fetchDocumentApi } from '../API/medicsapi';
import useAuthStore from '../zustand/auth';
import FileViewer from 'react-native-file-viewer';
import handleError from '../utility/errorhandler';
import ErrorModal from '../screens/errormodal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAlertStore } from '../zustand/alertstore';
import styles from '../styles/docstyles';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { WebView } from 'react-native-webview';
const DocScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('#F5FAFF', true, false);
  }, []);

  const navigation = useNavigation();
  const documents = useInitStore(state => state.initData?.list_documents || []);
  const token = useAuthStore.getState().authToken;
  const mrn = useAuthStore.getState().mrn?.replace(/^MRN:/, '');
  const [loading, setLoading] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalFileUri, setModalFileUri] = useState('');

  const isBase64 = (str) => {
    try {

      const cleaned = str.replace(/\s+/g, '');

      return /^[A-Za-z0-9+/=]+$/.test(cleaned);
    } catch {
      return false;
    }
  };


  const isPdfBase64 = (base64Str) => {
    try {
      const firstBytes = Buffer.from(base64Str, 'base64').slice(0, 5).toString();
      return firstBytes === '%PDF-';
    } catch {
      return false;
    }
  };

  const fetchDocContent = async (item) => {
    if (!item.is_file_exist) {
      showAlert('File Missing', 'This document is not available.');
      return;
    }
    try {
      setLoading(true);
      const payload = documentPayload(mrn, item.Id);
      const response = await fetchDocumentApi(payload, token);
      const rawData = response?.data;

      if (!rawData) {
        showAlert('Error', 'No data received for document.');
        setLoading(false);
        return;
      }

      if (item.file_type === '.pdf') {
        const path = `${RNFS.DocumentDirectoryPath}/doc_${item.Id}.pdf`;
        await RNFS.writeFile(path, rawData, 'base64');
        await FileViewer.open(pdfPath, { showOpenWithDialog: false });
      } else if (item.file_type === '.txt') {
        if (rawData.startsWith('%PDF-')) {
          const pdfPath = `${RNFS.DocumentDirectoryPath}/doc_${item.Id}.pdf`;
          await RNFS.writeFile(pdfPath, rawData, 'utf8');
          await FileViewer.open(pdfPath, { showOpenWithDialog: false });
        } else if (isBase64(rawData) && isPdfBase64(rawData)) {
          const pdfPath = `${RNFS.DocumentDirectoryPath}/doc_${item.Id}.pdf`;
          await RNFS.writeFile(pdfPath, rawData, 'base64');
          await FileViewer.open(txtPath, { showOpenWithDialog: false });
        } else {
          const txtPath = `${RNFS.DocumentDirectoryPath}/doc_${item.Id}.txt`;
          await RNFS.writeFile(txtPath, rawData, 'utf8');
          await FileViewer.open(txtPath, { showOpenWithDialog: false });
        }
      } else {
        showAlert('Unsupported File', 'Only PDF and TXT files are supported.');
      }
      setModalFileUri(`file://${filePath}`);
      setModalVisible(true);
    } catch (err) {
      handleError('document', err);
      showAlert('Error', 'Failed to load document.');
    } finally {
      setLoading(false);
    }
  };
  const handleNavigateToUpload = () => {
    navigation.navigate('ComposeMessageScreen');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.document_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{item.catergory}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton} onPress={() => fetchDocContent(item)}>
        <Icon name="eye" size={20} color="#fff" />
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ErrorModal />
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAFF" />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#1F2D5A" />
      </TouchableOpacity>
      <Text style={styles.header}>Documents</Text>

      {loading && (
        <ActivityIndicator size="large" color="#4D6EC5" style={{ marginVertical: 10 }} />
      )}

      <FlatList
        data={documents}
        keyExtractor={(item, index) => item?.Id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No documents found</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity onPress={handleNavigateToUpload} style={styles.uploadBtn}>
        <Text style={styles.uploadText}>Upload Image</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ padding: 10, backgroundColor: '#eee' }}
          >
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
          <WebView
            source={{ uri: modalFileUri }}
            style={{ flex: 1 }}
            originWhitelist={['*']}
          />
        </View>
      </Modal>
    </View>
  );
};

export default DocScreen;



