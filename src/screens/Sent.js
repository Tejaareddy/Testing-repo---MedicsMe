import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import useInitStore from "../zustand/apistore";
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import styles from'../styles/sentstyles';
const MessagesScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('#ffffff', true);
  }, []);
  const navigation = useNavigation();
  const messages = useInitStore((state) => state.initData?.list_message_sent || []);
  const [tab, setTab] = useState("Sent");

  const extractPreview = (body) => {
    if (!body) return "No content";
    const plain = body.replace(/<br\s*\/?>|\r?\n/g, "\n").trim();
    return plain.split("\n")[0];
  };

  const renderMessageItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("MessageDetail", { message: item })}>
        <View style={styles.card}>
          <View style={styles.leftIcon}>
          </View>
          <View style={styles.middle}>
            <Text style={styles.sender}>{item.message_from_name || "Unknown"}</Text>
            <Text style={styles.preview} numberOfLines={1}>
              {extractPreview(item.body)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Sent</Text>
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
            onPress={() => {
              setTab("Inbox");
              navigation.goBack();
            }}
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
            onPress={() => setTab("Sent")}
            disabled
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
          contentContainerStyle={{ paddingBottom: 30 }}
          data={messages}
          keyExtractor={(item, index) => item.message_id || index.toString()}
          renderItem={renderMessageItem}
          ListEmptyComponent={<Text>No message data found.</Text>}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
    l  </View>
      <TouchableOpacity style={styles.composeButton} onPress={() => navigation.navigate('ComposeMessageScreen')}>
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.composeText}>Compose Message</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MessagesScreen;
