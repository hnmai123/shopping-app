import { SafeAreaView, StyleSheet, View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      router.replace('/(tabs)');
    }
    catch (err: any) {
      console.error("Login error: ", err.message);
    }
  };

  return (
    <SafeAreaView style = {styles.containter}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/favicon.png')} style={styles.logo} />
          <Text style = {styles.appName}>PACKME</Text>
          <Text style = {styles.appTarget}>All in one click</Text>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.welcomeBack}>Welcome back</Text>
          <TextInput 
            placeholder="Enter your email or username" 
            style={styles.loginField} 
            placeholderTextColor={"#999999"}
            value={email}
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput 
              placeholder="Enter your password"  
              placeholderTextColor={"#999999"}
              secureTextEntry={!showPassword}
              value={password}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={setPassword}
              style={{flex: 0.95, fontSize: 15}}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons name={!showPassword ? 'visibility-off' : 'visibility'} size={25} color="#666666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.optionRows}>
            <Text style={styles.optionText}>Log in via SMS</Text>
            <Text style={styles.optionText}>Forgot password?</Text>
          </View>
          <Text style={styles.signUpText}>
            New to Packme?  
            <Text style={styles.signUpLink}> Sign up</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: '#e9f5f9',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#61EDFF',
    padding: "6%",
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
    marginBottom: 100
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
  },
  loginField: {
    backgroundColor: '#86eff5',
    borderRadius: 10,
    width: '78%',
    marginBottom: 10,
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
    fontSize: 15
  },
  passwordContainer: {
    width: '78%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#86eff5',
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
    color: '#808080',
    padding: 5,
    marginBottom: 5
  },
  signUpText: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'center',
  },
  signUpLink: {
    fontSize: 12,
    color: '#00B1BA',
  }
});