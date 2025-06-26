import React, { useState ,useEffect } from "react";
import {
  View,
  Text,
  FlatList,
 
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useInitStore from "../zustand/apistore";
import InboxDetails from './Inboxdetails';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/inboxstyles';


const InboxScreen = () => {
  useEffect(() => {
  changeNavigationBarColor('#ffffff', true); 
}, []);
  const inboxList = useInitStore((state) => state.initData?.list_message_inbox || []);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [tab, setTab] = useState("Inbox");

  const handleItemPress = (item) => {
    setSelectedMessage(item);
    setShowModal(true);
  };

  const renderItem = ({ item }) => {
    const preview = item.body?.trim().replace(/\r?\n/g, " ") || "";
    return (
      <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.card}>
        <View style={styles.leftIcon}>
          <View style={styles.iconCircle}>
            <Icon name="email" size={24} color="#1976D2" />
          </View>
        </View>
        <View style={styles.middle}>
          <Text style={styles.sender}>{item.message_from_name}</Text>
          <Text style={styles.preview} numberOfLines={1}>{preview}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const plainBody = selectedMessage?.body?.replace(/<br\s*\/?>|\r?\n/g, '\n') || '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
      <View style={styles.headerTabsContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
          <View style={styles.notificationWrapper}>
            <IconFontAwesome name="bell-o" size={24} color="black" />
          </View>
        </View>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === "Inbox" ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => setTab("Inbox")}
          >
            <Text style={[
              styles.tabText,
              tab === "Inbox" ? styles.activeTabText : styles.inactiveTabText
            ]}>Inbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === "Sent" ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => {
              setTab("Sent");
              navigation.navigate('MessagesScreen');
            }}
          >
            <Text style={[
              styles.tabText,
              tab === "Sent" ? styles.activeTabText : styles.inactiveTabText
            ]}>Sent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <FlatList
          data={inboxList}
          keyExtractor={(item) => item.message_id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No messages found.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View style={styles.fabWrapper}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('ComposeMessageScreen')}
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.fabText}>Compose Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={false}
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <InboxDetails
          onClose={() => setShowModal(false)}
          to={selectedMessage?.receiver_name}
          subject={selectedMessage?.subject}
          message={plainBody}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default InboxScreen;
