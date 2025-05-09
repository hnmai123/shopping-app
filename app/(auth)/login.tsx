import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../firebase/firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      router.replace('/(tabs)');
    } catch (err) {
      setErrorMessage("Sorry, your password or email was incorrect.");
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    header: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
      padding: "6%",
    },
    text: {
      color: isDarkMode ? '#FFFFFF' : 'black',
    },
    input: {
      backgroundColor: isDarkMode ? '#383838' : '#86eff5',
      color: isDarkMode ? '#FFFFFF' : 'black',
    },
    loginContainer: {
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    placeholderText: {
      color: '#989898',
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainContainer}>
              <View style={[styles.header, dynamicStyles.header]}>
                <Image source={require('../../assets/images/favicon.png')} style={styles.logo} />
                <Text style={[styles.appName, dynamicStyles.text]}>PACKME</Text>
                <Text style={[styles.appTarget, dynamicStyles.text]}>Login to your account</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 20, top: 20 }} onPress={toggleTheme}>
                  <MaterialIcons
                    name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
                    size={25}
                    color={isDarkMode ? '#FFD700' : '#000'}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.loginContainer, dynamicStyles.loginContainer]}>
                <Text style={[styles.welcomeBack, dynamicStyles.text]}>Welcome back</Text>
                <TextInput
                  placeholder="Email"
                  style={[styles.loginField, dynamicStyles.input]}
                  placeholderTextColor={dynamicStyles.placeholderText.color}
                  value={email}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setEmail}
                />
                <View style={[styles.passwordContainer, dynamicStyles.input]}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={dynamicStyles.placeholderText.color}
                    secureTextEntry={!showPassword}
                    value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setPassword}
                    style={{ flex: 0.95, fontSize: 15, color: dynamicStyles.text.color }}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name={!showPassword ? 'visibility-off' : 'visibility'}
                      size={25}
                      color={isDarkMode ? '#FFFFFF' : '#666666'}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                  <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.optionRows}>
                  <Text style={[styles.optionText, dynamicStyles.text]}>Log in via SMS</Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/reset_password')}>
                    <Text style={[styles.optionText, { color: isDarkMode ? '#61EDFF' : '#00B1BA' }]}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[styles.signUpText, dynamicStyles.text]}>New to Packme?</Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                    <Text style={[styles.signUpLink, { color: isDarkMode ? '#61EDFF' : '#00B1BA' }]}> Sign up</Text>
                  </TouchableOpacity>
                </View>
                {errorMessage ? (
                  <Text style={{ color: 'red', fontSize: 14, margin: 10, width: '78%', alignSelf: 'center' }}>
                    {errorMessage}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    padding: '6%',
  },
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
