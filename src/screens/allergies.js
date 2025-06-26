import React ,{useEffect}from 'react';
import {
  View,
  Text,
  FlatList,
 
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import useInitStore from '../zustand/apistore';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/allergystyles';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
const AllergiesScreen = () => {
   useEffect(() => {
    changeNavigationBarColor('#ffffff', true, false);
  }, []);
  const navigation = useNavigation();
  const allergies = useInitStore((state) => state.initData?.list_allergies || []);

  const renderAllergyItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.AllergyName || 'N/A'}</Text>
      <Text style={styles.cardText}>Type: {item.AllergyType || 'N/A'}</Text>
      <Text style={styles.cardText}>Reaction: {item.AdverseReaction || 'N/A'}</Text>
      <Text style={styles.cardText}>From Date: {item.FromDate || 'N/A'}</Text>

    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
       <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
      <View style={styles.headerTabsContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Allergies</Text>
        <TouchableOpacity>
          <View style={styles.notificationWrapper}>
            <Icon name="bell-o" size={22} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <FlatList
          data={allergies}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderAllergyItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No allergy data found.</Text>}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllergiesScreen;
