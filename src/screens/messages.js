import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import useInitStore from '../zustand/apistore';
import { Picker } from '@react-native-picker/picker';
import useAuthStore from '../zustand/auth';
import { handleError } from '../utility/errorhandler';
import ErrorModal from '../screens/errormodal';
import { uploadMessagePayload } from '../API/payload';
import { messageApi } from '../API/medicsapi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAlertStore } from '../zustand/alertstore';
import styles from '../styles/messagesstyles';

const ComposeMessageScreen = ({ navigation }) => {

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [resources, setResources] = useState([]);
  const token = useAuthStore.getState().authToken;
  const rawMrn = useAuthStore.getState().mrn;
  const mrn = rawMrn?.replace(/^MRN:/, '');
  const showAlert = useAlertStore((state) => state.showAlert);
  const initData = useInitStore(state => state.initData);
  const setInitData = useInitStore(state => state.setInitData);

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const response = await axios.get('https://portal.medicscloud.com/DG0/api/PatientGateway');
        setInitData(response.data);
      } catch (error) {
        console.error('Error fetching init data:', error);
        showAlert('Failed to fetch data');
      }
    };

    if (!initData) {
      fetchInitData();
    } else {
      const resourceNames = initData.list_resources.map((resource) => resource.name);
      setResources(resourceNames);
    }
  }, [initData, setInitData]);

  const selectFile = async () => {
    const options = {
      mediaType: 'mixed',
      includeBase64: false,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel || !response.assets) return;

      const asset = response.assets[0];
      const uri = asset.uri.replace('file://', '');
      const fileType = asset.fileName?.endsWith('.pdf') ? '.pdf' : '.jpg';

      try {
        const base64Data = await RNFS.readFile(uri, 'base64');

        setAttachment({
          base64: base64Data,
          fileType,
          name: asset.fileName,
        });
      } catch (err) {

        handleError('file', err);
        showAlert('Error reading file');
      }
    });
  };
  const sendMessage = async () => {
    if (!subject || !message || !attachment || !selectedRecipient) {
      showAlert('Subject, message, and attachment are required');
      return;
    }

    const payload = uploadMessagePayload({
      base64: attachment.base64,
      fileType: attachment.fileType,
      mrn,
      subject,
      body: message,
      message_to: selectedRecipient,
    });

    try {
      setLoading(true);
      await messageApi(payload, token);
      showAlert('Message sent successfully');
      setSubject('');
      setSelectedRecipient('');
      setMessage('');
      setAttachment(null);
    } catch (err) {
      console.error('Upload error:', err);
      showAlert('Upload failed. Check credentials or file type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ErrorModal />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compose message</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={selectFile}>
            <Icon name="attach-file" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 12 }}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>To</Text>


      <Picker
        selectedValue={selectedRecipient}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRecipient(itemValue)}
      >
        <Picker.Item label="Select a recipient" value="" />
        {resources?.map((name, index) => (
          <Picker.Item
            key={index}
            label={name}
            value={name}
          />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, { height: 200 }]}
        placeholder="Message"
        value={message}
        multiline
        onChangeText={setMessage}
      />

      {attachment && (
        <Text style={{ marginVertical: 10 }}>
          Attached: {attachment.name}
        </Text>
      )}
    </View>
  );
};

export default ComposeMessageScreen;
