import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  BackHandler 
} from 'react-native';
import useInitStore from '../zustand/apistore';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import styles from '../styles/problemliststyles';

const ProblemListScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('#ffffff', true, false);

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => true 
  );

 
  return () => backHandler.remove();
  }, []);

  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Active');
  const problemList = useInitStore((state) => state.initData?.list_problems || []);

  const filteredProblems = useMemo(() => {
    return problemList.filter((item) =>
      activeTab === 'Active'
        ? item.Status?.toLowerCase() === 'active'
        : item.Status?.toLowerCase() !== 'active'
    );
  }, [problemList, activeTab]);

  const renderProblemItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.problemTitle}>{item.ProblemDetails || 'N/A'}</Text>
        <Text style={styles.problemDate}>{item.Date || 'N/A'}</Text>
        <Text style={styles.problemDescription}>
          {item.Notes || 'No additional description'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
      <View style={styles.headerTabsContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Problems list</Text>
          <TouchableOpacity style={styles.lockButton}>
            <View style={styles.notificationWrapper}>
              <Icon name="bell-o" size={24} color="black" />

            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {['Active', 'Inactive'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <FlatList
          data={filteredProblems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderProblemItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} problems found.
            </Text>
          }
          contentContainerStyle={[
            styles.flatListContent,
            filteredProblems.length === 0 && styles.emptyContentContainer,
          ]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};



export default ProblemListScreen;


