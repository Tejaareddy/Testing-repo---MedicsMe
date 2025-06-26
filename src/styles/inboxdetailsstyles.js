import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2A5C8D',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#F8F9FC',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  form: {
    padding: 20,
  },
  label: {
    color: '#555',
    fontSize: 14,
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
    fontFamily: 'Poppins-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    paddingVertical: 4,
    fontFamily: 'Poppins-Regular',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2A5C8D',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});
export default styles;
