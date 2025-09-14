import { styles } from '@/styles/LoginScreenStyles';
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
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../firebase/firebaseConfig';

function PasswordInput({ value, onChangeText, showPassword, setShowPassword, isDarkMode, dynamicStyles }: any) {
  return (
    <View style={[styles.passwordContainer, dynamicStyles.input]}>
      <TextInput
        placeholder="Password"
        placeholderTextColor={dynamicStyles.placeholderText.color}
        secureTextEntry={!showPassword}
        value={value}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        style={{ flex: 0.95, fontSize: 15, color: dynamicStyles.text.color }}
      />
      <TouchableOpacity onPress={() => setShowPassword((prev: boolean) => !prev)}>
        <MaterialIcons
          name={!showPassword ? 'visibility-off' : 'visibility'}
          size={25}
          color={isDarkMode ? '#FFFFFF' : '#666666'}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { toggleTheme, isDarkMode } = useTheme();

  const dynamicStyles = {
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    header: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
      padding: 24,
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
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrorMessage("Sorry, your password or email was incorrect.");
    }
  };

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
                <PasswordInput
                  value={password}
                  onChangeText={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isDarkMode={isDarkMode}
                  dynamicStyles={dynamicStyles}
                />
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
                  <Text style={{ color: 'red', fontSize: 14, margin: 10, width: '78%', textAlign: 'center' }}>
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