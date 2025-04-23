import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailRegex.test(email) || !email ? setEmailError('') : setEmailError('Invalid email format');
    }

    const createAccount = async () => {
        if (emailError || !email || !password || !confirmPassword) {
            setError('Please fill in all fields correctly');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        } else {
            try {
                setError('');
                await createUserWithEmailAndPassword(auth, email, password);
                navigation.goBack();
            } catch (error) {
                console.error("Error creating account:", error);
                setError('Error creating account. Please try again.');
            }
        }
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#e9f5f9' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 22 }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 40 }}>Register</Text>
                    <TouchableOpacity>
                        <MaterialIcons name="dark-mode" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.logoArea}>
                        <Image source={require('../../assets/images/favicon.png')} style={{ width: 131, height: 131, marginBottom: 10 }} />
                        <Text style={{ fontWeight: 'bold', fontSize: 40, marginBottom: 10 }}>PACKME</Text>
                        <Text style={{ fontSize: 30, marginBottom: 20 }}>Create your account</Text>
                    </View>
                    <View style={styles.loginContainer}>
                        <TextInput
                            placeholder="Email"
                            style={styles.loginField}
                            placeholderTextColor={"#999999"}
                            value={email}
                            autoCapitalize='none'
                            autoCorrect={false}
                            onChangeText={(text) => {
                                setEmail(text);
                                validateEmail(text);
                            }}
                        />

                        {emailError ? <Text style={{ color: 'red', fontSize: 14, marginBottom: 10, width: '78%', alignSelf: 'center', marginLeft: 10 }}>{emailError}</Text> : null}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={"#999999"}
                                secureTextEntry={!showPassword}
                                value={password}
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={setPassword}
                                style={{ flex: 0.95, fontSize: 15 }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons name={!showPassword ? 'visibility-off' : 'visibility'} size={25} color="#666666" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor={"#999999"}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={setConfirmPassword}
                                style={{ flex: 0.95, fontSize: 15 }}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <MaterialIcons name={!showConfirmPassword ? 'visibility-off' : 'visibility'} size={25} color="#666666" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.signUpButton} onPress={createAccount}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Register</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#808080' }}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={{ color: '#00B1BA' }}> Log in</Text>
                            </TouchableOpacity>

                        </View>
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}
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
        marginBottom: 5,
        backgroundColor: '#61EDFF',
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
        backgroundColor: '#e9f5f9',
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
    signUpButton: {
        width: '78%',
        backgroundColor: '#00B1BA',
        height: 45,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        width: '78%',
        textAlign: 'center',
    },
})




