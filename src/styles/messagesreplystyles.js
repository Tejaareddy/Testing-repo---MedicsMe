import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9FC",
  },
  header: {
    backgroundColor: "#195B99",
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    fontSize: 16,
    paddingVertical: 4,
    fontFamily: 'Poppins-Regular',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#2A5C8D',
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
  },
  addSignButton: {
    backgroundColor: '#2A5C8D',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addSignText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#2A5C8D',
    marginTop: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    fontFamily: 'Poppins-Regular',
  },
  editableText: {
    backgroundColor: '#fff',
    borderColor: '#9C27B0',
  },
});
export default styles;
