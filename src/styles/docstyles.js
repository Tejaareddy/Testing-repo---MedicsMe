import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FAFF', padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2D5A',
    alignSelf: 'center',
    fontFamily: 'Poppins-Bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    width: 90,
    fontFamily: 'Poppins-SemiBold',
  },
  value: {
    color: '#444',
    flexShrink: 1,
    fontFamily: 'Poppins-Regular',
  },
  viewButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4D6EC5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'Poppins-SemiBold',
  },
  uploadBtn: {
    marginTop: 20,
    backgroundColor: '#4D6EC5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});
export default styles;
