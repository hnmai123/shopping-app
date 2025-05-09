import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth, db } from "../../firebase/firebaseConfig";

export default function Register() {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const [name, setName] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailRegex.test(email) || !email ? setEmailError('') : setEmailError('Invalid email format!');
    }

    const createAccount = async () => {
        if (emailError || !email || !password || !confirmPassword) {
            setError('Please fill in all fields correctly!');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        } else {
            try {
                setError('');
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredentials.user;

                await setDoc(doc(db, 'users', user.uid), {
                    email: email,
                    name: name,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });

                setSuccessMessage('Account created successfully, please sign in!');

                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
            } catch (error) {
                console.error("Error creating account:", error);
                setError('Error creating account. Please try again.');
                setSuccessMessage('');
            }
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
            color: isDarkMode ? '#BBBBBB' : '#808080',
        },
        accentText: {
            color: isDarkMode ? '#61EDFF' : '#00B1BA',
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={[dynamicStyles.container, { flex: 1 }]}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={[styles.header, dynamicStyles.header]}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={[dynamicStyles.text, { fontSize: 20 }]}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={[dynamicStyles.text, { fontWeight: "bold", fontSize: 35 }]}>Register</Text>
                            <TouchableOpacity onPress={toggleTheme}>
                                <MaterialIcons
                                    name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
                                    size={24}
                                    color={isDarkMode ? '#FFD700' : 'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={styles.logoArea}>
                                <Image source={require('../../assets/images/favicon.png')} style={{ width: 131, height: 131, marginBottom: 10 }} />
                                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 40, marginBottom: 10 }]}>PACKME</Text>
                                <Text style={[dynamicStyles.text, { fontSize: 30, marginBottom: 20 }]}>Create your account</Text>
                            </View>
                            <View style={[styles.loginContainer, dynamicStyles.container]}>
                                <TextInput
                                    placeholder="Email"
                                    style={[styles.loginField, dynamicStyles.input]}
                                    placeholderTextColor="#989898"
                                    value={email}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        validateEmail(text);
                                    }}
                                />

                                {emailError ? <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, width: '78%', alignSelf: 'center', marginLeft: 10 }}>{emailError}</Text> : null}

                                <TextInput
                                    placeholder="Name"
                                    style={[styles.loginField, dynamicStyles.input]}
                                    placeholderTextColor="#989898"
                                    value={name}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={(text) => {
                                        setName(text);
                                    }}
                                />

                                <View style={[styles.passwordContainer, dynamicStyles.input]}>
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor="#989898"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        onChangeText={setPassword}
                                        style={{ flex: 0.95, fontSize: 15, color: dynamicStyles.text.color }}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <MaterialIcons
                                            name={!showPassword ? 'visibility-off' : 'visibility'}
                                            size={25}
                                            color={dynamicStyles.icon.color}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.passwordContainer, dynamicStyles.input]}>
                                    <TextInput
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#989898"
                                        secureTextEntry={!showConfirmPassword}
                                        value={confirmPassword}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        onChangeText={setConfirmPassword}
                                        style={{ flex: 0.95, fontSize: 15, color: dynamicStyles.text.color }}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <MaterialIcons
                                            name={!showConfirmPassword ? 'visibility-off' : 'visibility'}
                                            size={25}
                                            color={dynamicStyles.icon.color}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={[styles.signUpButton, dynamicStyles.button]} onPress={createAccount}>
                                    <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20, textAlign: 'center' }]}>Register</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={dynamicStyles.secondaryText}>Already have an account?</Text>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Text style={dynamicStyles.accentText}> Log in</Text>
                                    </TouchableOpacity>
                                </View>
                                {error ? (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}
                                {successMessage ? (
                                    <View style={styles.errorContainer}>
                                        <Text style={[styles.errorText, { color: 'green' }]}>{successMessage}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </GestureHandlerRootView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        padding: 10,
        paddingHorizontal: 20
    },
    logoArea: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    loginContainer: {
        flex: 1,
    },
    loginField: {
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
        height: 45,
        borderRadius: 10,
        alignSelf: 'center',
        paddingLeft: 10,
        marginBottom: 10,
    },
    signUpButton: {
        width: '78%',
        height: 45,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        width: '78%',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
    }
})