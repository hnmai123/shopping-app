import Header from "@/components/Header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { auth, db } from "../../firebase/firebaseConfig";
import { styles } from "../../styles/RegisterScreenStyles";

function PasswordInput({
    placeholder,
    value,
    onChangeText,
    showPassword,
    setShowPassword,
    dynamicStyles,
}: any) {
    return (
        <View style={[styles.passwordContainer, dynamicStyles.input]}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#989898"
                secureTextEntry={!showPassword}
                value={value}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={onChangeText}
                style={{ flex: 0.95, fontSize: 15, color: dynamicStyles.text.color }}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev: boolean) => !prev)}>
                <MaterialIcons
                    name={!showPassword ? "visibility-off" : "visibility"}
                    size={25}
                    color={dynamicStyles.icon.color}
                />
            </TouchableOpacity>
        </View>
    );
}

export default function Register() {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { toggleTheme, isDarkMode } = useTheme();
    const [name, setName] = useState("");

    const dynamicStyles = {
        container: {
            backgroundColor: isDarkMode ? "#121212" : "#e9f5f9",
        },
        header: {
            backgroundColor: isDarkMode ? "#1E1E1E" : "#61EDFF",
        },
        text: {
            color: isDarkMode ? "#FFFFFF" : "black",
        },
        secondaryText: {
            color: isDarkMode ? "#BBBBBB" : "#808080",
        },
        accentText: {
            color: isDarkMode ? "#61EDFF" : "#00B1BA",
        },
        input: {
            backgroundColor: isDarkMode ? "#383838" : "#86eff5",
            color: isDarkMode ? "#FFFFFF" : "black",
        },
        button: {
            backgroundColor: "#00B1BA",
        },
        icon: {
            color: isDarkMode ? "#FFFFFF" : "#666666",
        },
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailRegex.test(email) || !email
            ? setEmailError("")
            : setEmailError("Invalid email format!");
    };

    const createAccount = async () => {
        if (emailError || !email || !password || !confirmPassword) {
            setError("Please fill in all fields correctly!");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            setError("");
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredentials.user;

            await setDoc(doc(db, "users", user.uid), {
                email: email,
                name: name,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            setSuccessMessage("Account created successfully, please sign in!");
            setTimeout(() => {
                navigation.goBack();
            }, 1000);
        } catch (error) {
            console.error("Error creating account:", error);
            setError("Error creating account. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={[dynamicStyles.container, { flex: 1 }]}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Header
                            title="Register"
                            onBack={() => navigation.goBack()}
                            onToggleTheme={toggleTheme}
                            isDarkMode={isDarkMode}
                            dynamicStyles={dynamicStyles}
                        />
                        <View style={{ flex: 1 }}>
                            <View style={styles.logoArea}>
                                <Image
                                    source={require("../../assets/images/favicon.png")}
                                    style={{ width: 131, height: 131, marginBottom: 10 }}
                                />
                                <Text
                                    style={[
                                        dynamicStyles.text,
                                        { fontWeight: "bold", fontSize: 40, marginBottom: 10 },
                                    ]}
                                >
                                    PACKME
                                </Text>
                                <Text
                                    style={[
                                        dynamicStyles.text,
                                        { fontSize: 30, marginBottom: 20 },
                                    ]}
                                >
                                    Create your account
                                </Text>
                            </View>
                            <View style={[styles.loginContainer, dynamicStyles.container]}>
                                <TextInput
                                    placeholder="Email"
                                    style={[styles.loginField, dynamicStyles.input]}
                                    placeholderTextColor="#989898"
                                    value={email}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        validateEmail(text);
                                    }}
                                />
                                {emailError ? (
                                    <Text
                                        style={{
                                            color: "red",
                                            fontSize: 14,
                                            marginBottom: 10,
                                            width: "78%",
                                            alignSelf: "center",
                                            marginLeft: 10,
                                        }}
                                    >
                                        {emailError}
                                    </Text>
                                ) : null}
                                <TextInput
                                    placeholder="Name"
                                    style={[styles.loginField, dynamicStyles.input]}
                                    placeholderTextColor="#989898"
                                    value={name}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={setName}
                                />
                                <PasswordInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    dynamicStyles={dynamicStyles}
                                />
                                <PasswordInput
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    showPassword={showConfirmPassword}
                                    setShowPassword={setShowConfirmPassword}
                                    dynamicStyles={dynamicStyles}
                                />
                                <TouchableOpacity
                                    style={[styles.signUpButton, dynamicStyles.button]}
                                    onPress={createAccount}
                                >
                                    <Text
                                        style={[
                                            dynamicStyles.text,
                                            { fontWeight: "bold", fontSize: 20, textAlign: "center" },
                                        ]}
                                    >
                                        Register
                                    </Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10,
                                    }}
                                >
                                    <Text style={dynamicStyles.secondaryText}>
                                        Already have an account?
                                    </Text>
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
                                        <Text style={[styles.errorText, { color: "green" }]}>
                                            {successMessage}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </GestureHandlerRootView>
        </KeyboardAvoidingView>
    );
}