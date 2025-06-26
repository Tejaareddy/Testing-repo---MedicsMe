import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#2A5C8D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  label: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 4,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  value: {
    marginHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    color: '#222',
    fontFamily: 'Poppins-Regular',
  },
  picker: {
    height: 50,
    marginHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontFamily: 'Poppins-Regular',
  },
});
export default styles;
