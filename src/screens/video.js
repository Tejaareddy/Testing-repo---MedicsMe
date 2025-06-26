import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';   

const MicrotalkScreen = () => {
   const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();  
        return true; 
      }

      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;  
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();  
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'https://telemedicine.careaxes.net/join/room-RPM?role=d' }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default MicrotalkScreen;
