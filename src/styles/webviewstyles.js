import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      fontFamily: 'Poppins-Bold',
    },
    sectionContainer: {
      marginBottom: 24
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 8,
      fontFamily: 'Poppins-SemiBold',
    },
    webview: {
      flex:1,
      height:400,
      marginBottom: 16
    },
    elementContainer: {
      marginBottom: 16
    },
    fieldContainer: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      fontFamily: 'Poppins-SemiBold',
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 8,
      borderRadius: 4,
      fontFamily: 'Poppins-Regular',
    },
    choiceContainer: {
      flexDirection: "row",
      marginVertical: 8
    },
    segmentedButtons: {
      marginVertical: 3,
      padding: 5,
      borderRadius: 3,
      margin: 2,
      justifyContent: "center",
      alignSelf: "left",
      width: "50%",       
      maxWidth: 200,  
    },
    segmentedButtonText: {
      fontSize: 12,  
      fontFamily: 'Poppins-Regular',
    },
    datePicker: {
      marginVertical: 10,
    },
    selectedDate: {
      fontSize: 16,
      color: "#333",
      marginTop: 5,
      fontFamily: 'Poppins-Regular',
    },
    dropdown: {
      height: 50,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      backgroundColor: "#fff",
      marginVertical: 10,
    },
    selectedOption: {
      fontSize: 16,
      color: "#00FF00",
      marginTop: 5,
      fontFamily: 'Poppins-Regular',
    },
    submitButton: {
      backgroundColor: "#007BFF",
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: 'Poppins-Bold',
    },
  });
  
  export default styles;
