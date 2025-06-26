// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import useInitStore from '../zustand/apistore';
// import useAuthStore from '../zustand/auth';
// import { handoutPayload } from '../API/payload';
// import { fromByteArray } from 'base64-js'; 
// import Pdf from 'react-native-pdf';
// import { fetchHandoutApi } from '../API/medicsapi';
// import { handleError } from '../utility/errorhandler';

// const HandoutScreen = () => {
//   const handouts = useInitStore(state => state.initData?.list_handouts || []);
//   const token = useAuthStore.getState().authToken;
//   const mrn = useAuthStore.getState().mrn?.replace(/^MRN:/, '');
//   const [loading, setLoading] = useState(false);

//   const downloadAndSaveHandout = async (item, shouldOpen = false) => {
//     if (!item?.is_file_exist || !item?.Id) {
//       Alert.alert('Invalid Handout', 'Missing file or ID.');
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = handoutPayload(mrn, item.Id);
//       const response = await fetchHandoutApi(payload, token);
//       const rawData = response?.data;

//       if (!rawData) {
//         Alert.alert('Empty File', 'No file content returned.');
//         return;
//       }

//       const ext = item?.file_extension || '.pdf';
//       const path = `${RNFS.DocumentDirectoryPath}/handout_${item.Id}${ext}`;
//       await RNFS.writeFile(path, rawData, 'utf8');

//       if (shouldOpen) {
//         await FileViewer.open(path, { showOpenWithDialog: false });
//       } else {
//         Alert.alert('Downloaded', `File saved to: ${path}`);
//       }
//     } catch (err) {
//       // console.error('Error handling handout:', err.response?.data || err.message);
//       handleError('handout', err);
//       Alert.alert('Error', err.response?.data?.message || 'Failed to process handout.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.titleText}>{item?.material_name || 'Untitled Handout'}</Text>
//         {item.is_file_exist && (
//           <TouchableOpacity onPress={() => downloadAndSaveHandout(item, true)}>
//             <Icon name="eye" size={22} color="#4D6EC5" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {!item.is_file_exist ? (
//         <Text style={{ color: 'gray', marginTop: 8 }}>No file available</Text>
//       ) : (
//         <TouchableOpacity
//           onPress={() => downloadAndSaveHandout(item, false)}
//           style={styles.downloadBtn}
//         >
//           <Text style={styles.downloadText}>Download</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.screenTitle}>Handouts</Text>

//       {loading && (
//         <View style={{ marginVertical: 10 }}>
//           <ActivityIndicator size="large" color="#4D6EC5" />
//         </View>
//       )}

//       <FlatList
//         data={handouts}
//         keyExtractor={(item, index) => item?.Id?.toString() || index.toString()}
//         renderItem={renderItem}
//         ListEmptyComponent={<Text>No handouts found.</Text>}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F5FAFF', paddingHorizontal: 16, paddingTop: 16 },
//   screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#1F2D5A' },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   downloadBtn: {
//     marginTop: 12,
//     backgroundColor: '#4D6EC5',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   downloadText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 15,
//   },
// });

// export default HandoutScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';
import useInitStore from '../zustand/apistore';
import useAuthStore from '../zustand/auth';
import { handoutPayload } from '../API/payload';
import { fetchHandoutApi } from '../API/medicsapi';
import handleError from '../utility/errorhandler';
import ErrorModal from '../screens/errormodal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import ImageView from 'react-native-image-viewing';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useAlertStore } from '../zustand/alertstore';
import styles from '../styles/handoutstyles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HandoutScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('#F5FAFF', true, false);
 
   const backHandler = BackHandler.addEventListener(
     'hardwareBackPress',
     () => true 
   );
 
  
   return () => backHandler.remove();
   }, []);
 
  const navigation = useNavigation();
  const showAlert = useAlertStore((state) => state.showAlert);
  const handouts = useInitStore(state => state.initData?.list_handouts || []);
  const token = useAuthStore.getState().authToken;
  const mrn = useAuthStore.getState().mrn?.replace(/^MRN:/, '');
  const [loading, setLoading] = useState(false);

  // Modal state
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerType, setViewerType] = useState(null); // 'pdf', 'image', 'text', 'unsupported'
  const [viewerSource, setViewerSource] = useState(null);
  const [viewerTitle, setViewerTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  // Image viewing state
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerUris, setImageViewerUris] = useState([]);

  // Helper to get extension
  const getExtension = (filename) => {
    return filename?.split('.').pop().toLowerCase();
  };

  // Helper to determine file type
  const getFileType = (ext) => {
    if (!ext) return 'unsupported';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
    if (['txt', 'csv', 'json', 'xml'].includes(ext)) return 'text';
    return 'unsupported';
  };

  // Download and show file in modal
  const downloadAndShowHandout = async (item) => {
    if (!item?.is_file_exist || !item?.Id) {
      showAlert('Invalid Handout', 'Missing file or ID.');
      return;
    }

    try {
      setLoading(true);
      const payload = handoutPayload(mrn, item.Id);
      const response = await fetchHandoutApi(payload, token);
      const rawData = response?.data;

      if (!rawData) {
        showAlert('Empty File', 'No file content returned.');
        return;
      }

      const ext = (item?.file_extension || '.pdf').replace('.', '').toLowerCase();
      const fileType = getFileType(ext);
      const path = `${RNFS.DocumentDirectoryPath}/handout_${item.Id}.${ext}`;

      if (fileType === 'image') {
        // Save as base64 and show with image viewer
        await RNFS.writeFile(path, rawData, 'base64');
        setImageViewerUris([{ uri: `file://${path}` }]);
        setImageViewerVisible(true);
      } else if (fileType === 'pdf') {
        await RNFS.writeFile(path, rawData, 'utf8');
        setViewerTitle(item?.material_name || 'Handout');
        setViewerType('pdf');
        setViewerSource(`file://${path}`);
        setViewerVisible(true);
      } else if (fileType === 'text') {
        await RNFS.writeFile(path, rawData, 'utf8');
        const content = await RNFS.readFile(path, 'utf8');
        setTextContent(content);
        setViewerTitle(item?.material_name || 'Handout');
        setViewerType('text');
        setViewerSource(null);
        setViewerVisible(true);
      } else {
        setViewerTitle(item?.material_name || 'Handout');
        setViewerType('unsupported');
        setViewerSource(null);
        setViewerVisible(true);
      }
    } catch (err) {
      handleError('handout', err);
      showAlert('Error', err.response?.data?.message || 'Failed to process handout.');
    } finally {
      setLoading(false);
    }
  };

  // Download only (no preview)
  const downloadHandout = async (item) => {
    if (!item?.is_file_exist || !item?.Id) {
      showAlert('Invalid Handout', 'Missing file or ID.');
      return;
    }

    try {
      setLoading(true);
      const payload = handoutPayload(mrn, item.Id);
      const response = await fetchHandoutApi(payload, token);
      const rawData = response?.data;

      if (!rawData) {
        showAlert('Empty File', 'No file content returned.');
        return;
      }

      const ext = (item?.file_extension || '.pdf').replace('.', '').toLowerCase();
      const path = `${RNFS.DocumentDirectoryPath}/handout_${item.Id}.${ext}`;
      const fileType = getFileType(ext);
      await RNFS.writeFile(path, rawData, fileType === 'image' ? 'base64' : 'utf8');
      showAlert('Downloaded', `File saved to: ${path}`);
    } catch (err) {
      handleError('handout', err);
      showAlert('Error', err.response?.data?.message || 'Failed to process handout.');
    } finally {
      setLoading(false);
    }
  };

  // Viewer Modal Content
  const renderViewerContent = () => {
    if (viewerType === 'pdf' && viewerSource) {
      return (
        <Pdf
          source={{ uri: viewerSource }}
          style={{ flex: 1, width: windowWidth - 32, height: windowHeight - 160 }}
          onError={error => Alert.alert('PDF Error', error.message)}
        />
      );
    }
    if (viewerType === 'text') {
      return (
        <ScrollView style={{ maxHeight: windowHeight - 160, padding: 12 }}>
          <Text style={{ fontSize: 15, color: '#203040' }}>{textContent}</Text>
        </ScrollView>
      );
    }
    if (viewerType === 'unsupported') {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Preview not available for this file type.</Text>
        </View>
      );
    }
    return null;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ErrorModal />
      <View style={styles.cardHeader}>
        <Text style={styles.titleText}>{item?.material_name || 'Untitled Handout'}</Text>
        {item.is_file_exist && (
          <TouchableOpacity onPress={() => downloadAndShowHandout(item)}>
            <Icon name="eye" size={22} color="#4D6EC5" />
          </TouchableOpacity>
        )}
      </View>

      {!item.is_file_exist ? (
        <Text style={{ color: 'gray', marginTop: 8 }}>No file available</Text>
      ) : (
        <TouchableOpacity
          onPress={() => downloadHandout(item)}
          style={styles.downloadBtn}
        >
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#1F2D5A" />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Handouts</Text>

      {loading && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="large" color="#4D6EC5" />
        </View>
      )}

      <FlatList
        data={handouts}
        keyExtractor={(item, index) => item?.Id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No handouts found.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for PDF/Text/Unsupported */}
      <Modal
        visible={viewerVisible}
        animationType="slide"
        onRequestClose={() => setViewerVisible(false)}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{viewerTitle}</Text>
              <TouchableOpacity onPress={() => setViewerVisible(false)}>
                <Icon name="close" size={24} color="#4D6EC5" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {renderViewerContent()}
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
      <ImageView
        images={imageViewerUris}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        backgroundColor="#000"
      />
    </View>
  );
};


export default HandoutScreen;
