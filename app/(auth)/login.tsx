import { SafeAreaView, StyleSheet, View, Text, Image} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  return (
    <SafeAreaView style = {styles.containter}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/favicon.png')} style={styles.logo} />
        <Text style = {styles.appName}>PACKME</Text>
        <Text style = {styles.appTarget}>All in one click</Text>
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.welcomeBack}>Welcome back</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: '#61EDFF',
  },
  header: {
    backgroundColor: '#61EDFF',
  },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 50
  },
  appTarget: {
    fontSize: 35,
    textAlign: 'center',
    color: 'black',
    marginBottom: 125
  },
  logo: {
    width: 131,
    height: 131,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#e9f5f9',
  },
  welcomeBack: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20
  }
});