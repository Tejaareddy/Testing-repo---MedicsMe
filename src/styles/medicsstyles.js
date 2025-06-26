import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 5,
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greeting: {
    marginLeft: 15,
    flex: 1,
  },
  helloText: {
    fontSize: 20,
    fontFamily: 'Satoshi-Medium',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Satoshi-regular',
  },
  notificationWrapper: {
    padding: 10,
    borderRadius: 20,
    marginRight: 12,
    marginTop: -10,
  },
  notificationIcon: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#ccc",
  },
  notificationBadgeContainer: {
    marginTop: -30,
    marginLeft: 10,
  },
  notificationBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    marginLeft: 5,
    marginBottom: -1,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 4,
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#195B99',
    fontFamily: 'Poppins-Bold',
  },
  notificationItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  notificationTitle: {
    fontWeight: 'bold',
    color: '#195B99',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#195B99',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'Satoshi-Bold',
    marginTop: 30,
    
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItem: {
    width: '31%',
    height: '28%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    marginVertical: 8,  
  },


  gridText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
    alignItems: 'center',
  },
  
newsCardHorizontal: {
  width: 280,
  marginRight: 10,
  backgroundColor: '#fff',
  borderRadius: 10,
  overflow: 'hidden',
  elevation: 1,
  height: 175,
},

newsImageHorizontal: {
  width: '100%',
  height: 100,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
},

newsTitleHorizontal: {
  padding: 10,
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
},

newsImagePlaceholder: {
  width: '100%',
  height: 120,
  backgroundColor: '#ccc',
},
  newsCardRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    elevation: 3,
    alignItems: 'flex-start',
  },
  newsImageRow: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  newsImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  newsContent: {
    flex: 1,
    flexDirection: 'column',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Poppins-SemiBold',
  },
  newsText: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Poppins-Regular',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
    alignItems: 'center',
  },
  footerButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    marginBottom: 8,
  }
});

export default styles;
