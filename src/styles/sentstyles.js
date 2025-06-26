import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9FC",
  },
  headerContainer: {
    backgroundColor: '#2A5C8D',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    borderRadius: 10,
    height: 40,
    width: 40,
    backgroundColor: "#ccc",
  },
  bottomContainer: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#0D3C75',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  activeTabText: {
    color: '#0D3C75',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  inactiveTabText: {
    color: '#fff',
    fontWeight: "bold",
    fontFamily: 'Poppins-Bold',
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 10,
  },
  iconCircle: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 25,
  },
  middle: {
    flex: 1,
  },
  sender: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
    fontFamily: 'Poppins-Bold',
  },
  preview: {
    fontSize: 13,
    color: "#777",
    fontFamily: 'Poppins-Regular',
  },

  composeButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: 'transparent',
  },
  composeButton: {
    backgroundColor: "#195B99",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
  },
  composeText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontFamily: 'Poppins-SemiBold',
  },
});
export default styles;
