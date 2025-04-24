import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e9f5f9' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 20 }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 25 }}>Forgot Password</Text>
                    <TouchableOpacity>
                        <MaterialIcons name="dark-mode" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, alignSelf: 'center', width: '90%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 10 }}>Reset password</Text>
                        <Text style={{ color: '#989898', fontSize: 14, marginVertical: 5 }}>Please enter your email to reset the password</Text>

                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', marginVertical: 5, fontSize: 15 }}>Email</Text>

                            <TextInput
                                placeholder="Email"
                                style={styles.emailField}
                                placeholderTextColor={'#989898'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={(email) => {
                                    setEmail(email);
                                    validateEmail(email);
                                }}
                            />
                            {emailError ? <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, width: '100%' }}>{emailError}</Text> : null}
                            <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Reset Password</Text>
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
        backgroundColor: '#61EDFF',
        padding: 10,
        paddingHorizontal: 20
    },
    emailField: {
        backgroundColor: '#86eff5',
        borderRadius: 10,
        width: '100%',
        marginBottom: 5,
        height: 45,
        paddingLeft: 10,
        fontSize: 15,
    },
    resetButton: {
        width: '100%',
        backgroundColor: '#00B1BA',
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
