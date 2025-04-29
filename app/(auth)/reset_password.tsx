import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { useTheme } from "../Context/ThemeContext";

export default function ResetPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { theme, toggleTheme, isDarkMode } = useTheme();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailRegex.test(email) || !email ? setEmailError('') : setEmailError('Invalid email format!');
    }

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
    }

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
            backgroundColor: isDarkMode ? '#00B1BA' : '#00B1BA',
        },
        icon: {
            color: isDarkMode ? '#FFFFFF' : '#666666',
        }
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[dynamicStyles.container, { flex: 1 }]}>
                <View style={[styles.header, dynamicStyles.header]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={[dynamicStyles.text, { fontSize: 20 }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[dynamicStyles.text, { fontWeight: "bold", fontSize: 25 }]}>Forgot Password</Text>
                    <TouchableOpacity onPress={toggleTheme}>
                        <MaterialIcons 
                            name={isDarkMode ? 'wb-sunny' : 'dark-mode'} 
                            size={24} 
                            color={isDarkMode ? '#FFD700' : 'black'} 
                        />
                    </TouchableOpacity>
                </View>
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
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.successText}>{successMessage}</Text>
                                </View>
                            ) : null}
                            {error ? (
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        paddingHorizontal: 20
    },
    emailField: {
        borderRadius: 10,
        width: '100%',
        marginBottom: 5,
        height: 45,
        paddingLeft: 10,
        fontSize: 15,
    },
    resetButton: {
        width: '100%',
        height: 45,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },
    successText: {
        color: 'green',
        fontSize: 14,
        width: '100%',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        width: '100%',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold'
    }
});