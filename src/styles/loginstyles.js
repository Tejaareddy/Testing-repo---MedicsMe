import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFD7ED',
  },
  topContainer: {
    padding: 30,
    paddingTop: 80,
    alignItems: 'center',
  },
  headingText: {
    fontSize: 26,
    
    fontFamily: 'Satoshi-Black',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '10%',
  },
  subText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 'auto',
    fontFamily: "Satoshi-Regular",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: '8%',
    borderTopRightRadius: '8%',
    padding: 20,
    marginTop: '10%',
  },
  label: {
    fontSize: 20,
    marginTop: 22,
    marginBottom: 10,
    color: '#1F1F1F',
    fontFamily: "Satoshi-Medium",
  },
  inputText: {
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontFamily: "Satoshi",
    fontSize: 16,
    color: '#000',
  },
  inputText1: {
    borderWidth: 1.6,
    borderColor: '#D9D9D9',
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: '#383838',
  },
  passwordRow: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  loginBtn: {
    height: 60,
    backgroundColor: '#aaa',
    paddingVertical: 15,
    borderRadius: 4,
    marginTop: 36,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontFamily: "Poppins-Regular",
    fontSize: 18,
  },
});
export default styles;
