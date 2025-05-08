import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, Image, Touchable, ScrollView } from "react-native";
import { useTheme } from '../../../context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { auth } from "@/firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Supplier() {
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState('');
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const navigation = useNavigation();

    const handleAddressRetrieved = (addr: string | null, location: { latitude: number; longitude: number } | null) => {
        setAddress(addr || '');
        setCoords(location || null);
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {

        }
    }, []);
    const handleLogout = async () => {
        try {
            await auth.signOut(); // Firebase sign-out
            navigation.navigate("(auth)" as never); // Navigate to the Login screen after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: isDarkMode ? '#121212' : '#61EDFF',
        },
        header: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
        },
        text: {
            color: isDarkMode ? '#FFFFFF' : 'black',
        },
        searchContainer: {
            backgroundColor: isDarkMode ? '#383838' : '#FFFFFF',
        },
        searchText: {
            color: isDarkMode ? '#FFFFFF' : 'black',
        },
        productCard: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            width: '95%',
            borderRadius: 10,
        },
        productList: {
            backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
        },
        textContainer: {
            backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
        },
        loadingBackground: {
            backgroundColor: isDarkMode ? '#121212' : '#61EDFF',
        },
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '95%',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            borderRadius: 10,
            padding: 16,
            marginVertical: 10,
        },
        paymentCard: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            width: '95%',
            borderRadius: 10,
            marginVertical: 5,
        },
        paymentRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 8,
            justifyContent: 'space-between',
            marginHorizontal: 10,
        },
        divider: {
            height: 1,
            backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
            marginTop: 4,
        },
        addressCard: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            width: '95%',
            borderRadius: 10,
            marginVertical: 5,
        },
        supportCard: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            width: '95%',
            borderRadius: 10,
            marginVertical: 5,
        },
        managementCard: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            width: '95%',
            borderRadius: 10,
            marginVertical: 5,
        },

        managementRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 8,
            marginHorizontal: 10,
        }
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                <View style={[styles.header, dynamicStyles.header]}>
                    <TouchableOpacity style={{ marginLeft: "7%" }} onPress={() => navigation.navigate('account' as never)}>
                        <Ionicons size={30} name="person-outline" color={dynamicStyles.text.color} />
                    </TouchableOpacity>
                    <Text style={[{ fontSize: 30, fontWeight: 'bold' }, , dynamicStyles.text]}>Management</Text>
                    <TouchableOpacity style={{ marginRight: "7%" }} onPress={toggleTheme}>
                        <MaterialIcons
                            name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
                            size={24}
                            color={isDarkMode ? '#FFD700' : 'black'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: isDarkMode ? '#121212' : '#e9f5f9', flex: 1, alignItems: 'center' }}>
                    <View style={dynamicStyles.card}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Image
                                source={require('@/assets/images/Acount.png')}
                                style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <Text style={dynamicStyles.text}>Nickname</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 20 }}>
                            <Text style={dynamicStyles.text}>Username</Text>
                            <Text style={dynamicStyles.text}>Role</Text>
                            <Text style={dynamicStyles.text}>Email</Text>
                        </View>
                    </View>
                    <View style={dynamicStyles.managementCard}>
                        <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                            <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Store Management</Text>
                        </View>
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Orders</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text]}>View {">"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={dynamicStyles.divider} />
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Inventory/Stock</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text]}>View {">"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={dynamicStyles.divider} />
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Status</Text>
                            <Text style={[dynamicStyles.text]}>Working</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text]}>View {">"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={dynamicStyles.managementCard}>
                        <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Add Product</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text, {fontSize: 14 }]}>Upload new item {">"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={dynamicStyles.managementCard}>
                        <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                            <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Data Analytics</Text>
                        </View>
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Income</Text>
                            <Text style={[dynamicStyles.text]}>$13,123.13</Text>
                        </View>
                        <View style={dynamicStyles.divider} />
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Dashboard</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text]}>View {">"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={dynamicStyles.divider} />
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Report</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text]}>View {">"}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={dynamicStyles.divider} />
                        <View style={dynamicStyles.managementRow}>
                            <Text style={[dynamicStyles.text]}>Feedback</Text>
                            <TouchableOpacity>
                                <Text style={[dynamicStyles.text]}>View {">"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        padding: 10,
    },
});