import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContainer: { flex: 1 },
  header: { padding: '6%' },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  appTarget: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 131,
    height: 131,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBack: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginField: {
    borderRadius: 10,
    width: '78%',
    marginBottom: 10,
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
    fontSize: 15,
  },
  passwordContainer: {
    width: '78%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
    paddingLeft: 10,
    marginBottom: 10,
  },
  loginButton: {
    width: '78%',
    backgroundColor: '#00B1BA',
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  optionRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '78%',
    alignSelf: 'center',
  },
  optionText: {
    fontSize: 10,
    padding: 5,
    marginBottom: 5,
  },
  signUpText: {
    fontSize: 12,
    textAlign: 'center',
  },
  signUpLink: {
    fontSize: 12,
  },
});