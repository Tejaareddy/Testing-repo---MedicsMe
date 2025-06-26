import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    padding: '5%',
    backgroundColor: 'rgba(94, 94, 94, 0.85)',
    borderRadius: 10,
  },
  modalContent: {
    width: 300,
    height: 160,
    justifyContent: "center",
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 250,
    marginLeft: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  okButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});
export default styles;
