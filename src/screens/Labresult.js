import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import useInitStore from '../zustand/apistore';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import styles from '../styles/labstyles';
const LabResultScreen = () => {
  useEffect(() => {
    changeNavigationBarColor('#F1F6FA', true, false);
  }, []);
  const navigation = useNavigation();

  const labResults = useInitStore((state) => state.initData?.list_labrestults || []);

  const renderLabResultItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name="flask" size={24} color="#2A5C8D" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.testTitle}>{item.TestDesc || 'N/A'}</Text>
        <Text style={styles.testSubtext}>
          Result: {item.Result || 'N/A'} {item.Units ? `(${item.Units})` : ''}
        </Text>
        <Text style={styles.testSubtext}>Comments: {item.NTEComments || 'N/A'}</Text>
        <Text style={styles.testSubtext}>Ref. Range: {item.RefRange || 'N/A'}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Code: {item.TestCode || 'N/A'}</Text>
          <Text style={styles.metaText}>{item.ReportDate || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />

      <View style={styles.headerTabsContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lab Results</Text>
        <TouchableOpacity>
          <View style={styles.notificationWrapper}>
            <Icon name="bell-o" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <FlatList
          data={labResults}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderLabResultItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No lab results found.</Text>}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </SafeAreaView>
  );
};



export default LabResultScreen;
