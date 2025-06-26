import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAlertStore } from '../zustand/alertstore';
import styles from '../styles/messagesreplystyles';
const MessageReplyScreen = () => {
  const navigation = useNavigation();
  const [isReplying, setIsReplying] = useState(false);
  const [message, setMessage] = useState('--Original Message--Tested From: DENISES, DENISES');
  const [subject, setSubject] = useState('Re:Fwd: Tested');
  const [signatureImage, setSignatureImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const showAlert = useAlertStore((state) => state.showAlert);
  const handleReply = () => setIsReplying(true);

  const handleAddSign = () => {
    navigation.navigate('SignatureScreen', {
      onSignature: (signature) => {
        setSignatureImage(signature);
      },
    });
  };

  const sendMessage = () => {
    if (!subject.trim() || !message.trim()) {
      showAlert('Validation', 'Subject and message cannot be empty.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    showAlert('Success', 'Message sent');
      setIsReplying(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
        {/* {isReplying ? ( */}
        <TouchableOpacity onPress={sendMessage}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
        {/* // ) : ( */}
        {/* <TouchableOpacity onPress={handleReply}>
            <MaterialIcons name="reply" size={24} color="#F8F9FC" />
          </TouchableOpacity> */}
        {/* // )} */}
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.value}>HENRY SEVEN</Text>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          editable={isReplying}
          onChangeText={setSubject}
        />

        <View style={styles.messageHeader}>
          <Text style={styles.label}>Message</Text>
          <Text style={styles.timestamp}>05/02/2025 06:35 am</Text>
          {/* {isReplying && ( */}
          <TouchableOpacity style={styles.addSignButton} onPress={handleAddSign}>
            <Text style={styles.addSignText}>Add Sign</Text>
          </TouchableOpacity>
          {/* )} */}
        </View>

        <TextInput
          style={[styles.textArea, isReplying && styles.editableText]}
          value={message}
          onChangeText={setMessage}
          editable={isReplying}
          multiline
        />

        {signatureImage && (
          <Image
            source={{ uri: signatureImage }}
            style={{ width: 80, height: 100, marginTop: 10 }}
            resizeMode="contain"
          />
        )}
        <Text>signature</Text>
      </View>
    </View>
  );
};

export default MessageReplyScreen;

