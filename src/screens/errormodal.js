
import React from 'react';
import { Modal, View, Text, TouchableOpacity,  } from 'react-native';
import useErrorStore from '../zustand/errorstore';
import styles from '../styles/errormodalstyles';
const ErrorModal = () => {
  const { showError, errorTitle, errorMessage, clearError } = useErrorStore();

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={showError}
      onRequestClose={clearError}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.errorTitle}>{errorTitle}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity
            onPress={clearError}
            style={styles.okButton}
          >
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default ErrorModal;
