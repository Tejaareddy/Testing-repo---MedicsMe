import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FAFF', paddingHorizontal: 16, paddingTop: 16 },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2D5A',
    alignSelf: 'center',
    fontFamily: 'Poppins-Bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyCard: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f1f1f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  descText: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  downloadBtn: {
    marginTop: 12,
    backgroundColor: '#4D6EC5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default styles;
