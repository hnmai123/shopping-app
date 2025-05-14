import Header from "@/components/Header";
import { useNavigation } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth } from "../../firebase/firebaseConfig";
import { styles } from "../../styles/ResetPasswordStyles";

export default function ResetPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { toggleTheme, isDarkMode } = useTheme();

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
        },
        header: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
        },
        text: {
            color: isDarkMode ? '#FFFFFF' : 'black',
        },
        secondaryText: {
            color: isDarkMode ? '#BBBBBB' : '#989898',
        },
        input: {
            backgroundColor: isDarkMode ? '#383838' : '#86eff5',
            color: isDarkMode ? '#FFFFFF' : 'black',
        },
        button: {
            backgroundColor: "#00B1BA",
        },
        icon: {
            color: isDarkMode ? "#FFFFFF" : "#666666",
        }
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailRegex.test(email) || !email
            ? setEmailError('')
            : setEmailError('Invalid email format!');
    };

    const resetPassword = async () => {
        if (emailError || !email) {
            setEmailError('Please enter a valid email!');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Password reset email sent. Please check your inbox!');
            setError('');
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } catch (error) {
            setError('Error resetting password. Please try again!');
            setSuccessMessage('');
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[dynamicStyles.container, { flex: 1 }]}>
                <Header
                    title="Forgot Password"
                    onBack={() => navigation.goBack()}
                    onToggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    dynamicStyles={dynamicStyles}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, alignSelf: 'center', width: '90%' }}>
                        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20, marginVertical: 10 }]}>Reset password</Text>
                        <Text style={[dynamicStyles.secondaryText, { fontSize: 14, marginVertical: 5 }]}>Please enter your email to reset the password</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={[dynamicStyles.text, { fontWeight: 'bold', marginVertical: 5, fontSize: 15 }]}>Email</Text>
                            <TextInput
                                placeholder="Email"
                                style={[styles.emailField, dynamicStyles.input]}
                                placeholderTextColor={dynamicStyles.secondaryText.color}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={(email) => {
                                    setEmail(email);
                                    validateEmail(email);
                                }}
                            />
                            {emailError ? <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, width: '100%' }}>{emailError}</Text> : null}
                            <TouchableOpacity style={[styles.resetButton, dynamicStyles.button]} onPress={resetPassword}>
                                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20, textAlign: 'center' }]}>Reset Password</Text>
                            </TouchableOpacity>
                            {successMessage ? (
                                <View>
                                    <Text style={styles.successText}>{successMessage}</Text>
                                </View>
                            ) : null}
                            {error ? (
                                <View>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}