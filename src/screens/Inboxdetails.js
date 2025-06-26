import React, { useState } from 'react';
import { View, Text, TextInput,  TouchableOpacity, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import MessageReplyScreen from './MessageReplyScreen';
import styles from '../styles/inboxdetailsstyles';

const InboxDetails = ({ onClose, to = "HENRY SEVEN", subject = "Fwd: Tested", message = "Tested" }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
        <MaterialIcons name="send" size={24} color="#F8F9FC" />
      </View>


      <View style={styles.form}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.value}>{to}</Text>
        <View style={styles.divider} />

        <Text style={styles.label}>Subject</Text>
        <TextInput style={styles.input} value={subject} editable={false} />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={message}
          editable={false}
        />
      </View>


      <TouchableOpacity style={styles.fab} onPress={() => setShowReplyModal(true)}>
        <Text style={styles.fabText}>Reply</Text>
      </TouchableOpacity>


      <Modal
        transparent={false}
        visible={showReplyModal}
        animationType="slide"
        onRequestClose={() => setShowReplyModal(false)}
      >
        <MessageReplyScreen onBack={() => setShowReplyModal(false)} />
      </Modal>
    </View>
  );
};




export default InboxDetails;