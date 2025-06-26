import React, { useRef } from 'react';
import { View, Button, SafeAreaView, TouchableOpacity } from 'react-native';
import Signature from 'react-native-signature-canvas';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAlertStore } from '../zustand/alertstore';
import styles from '../styles/signaturestyles';

const SignatureScreen = ({ navigation, route }) => {
  const showAlert = useAlertStore((state) => state.showAlert);
  const ref = useRef();

  const handleOK = signature => {
    if (route.params?.onSignature) {
      route.params.onSignature(signature);
    }
    navigation.goBack();
  };

  const handleEmpty = () => {
    showAlert('Please provide a signature.');
  };

  const webStyle = `
    .m-signature-pad {
      box-sizing: border-box;
      max-width: 100vw;
      max-height: 100vh;
      margin: 0;
      padding: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      touch-action: none;
      background-color: white;
    }

    .m-signature-pad--body {
      height: 100%;
      width: 100%;
    }

    .m-signature-pad--footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .button {
      background-color:rgb(31, 118, 204);
      color: white;
    }
  `;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Signature
          ref={ref}
          onOK={handleOK}
          onEmpty={handleEmpty}
          descriptionText="Sign above"
          clearText="Clear"
          confirmText="Save"
          webStyle={webStyle}
          autoClear={true}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default SignatureScreen;


