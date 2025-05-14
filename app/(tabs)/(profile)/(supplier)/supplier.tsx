import ManagementCard from "@/components/account/ManagementCard";
import PersonInfo from "@/components/account/PersonInfo";
import StoreManagementCard from "@/components/account/StoreManagement";
import Header from "@/components/Header";
import { auth, db } from "@/firebase/firebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from '../../../../context/ThemeContext';

interface User {
    nickname?: string;
    name?: string;
    email?: string;
    points?: number;
    address?: string;
    coords?: {
        latitude: number;
        longitude: number;
    };
}

export default function Supplier() {
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const [user, setUser] = useState<User | undefined>(undefined);
    const navigation = useNavigation();


    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUser(userData);
                }
            }
        };

        fetchUser();
    }, []);


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
            paddingVertical: 5,
        }
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                <Header
                    title="Management"
                    onBack={() => navigation.goBack()}
                    onToggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    dynamicStyles={dynamicStyles}
                    backIconName="supervisor-account"
                />
                
                <View style={{ backgroundColor: isDarkMode ? '#121212' : '#e9f5f9', flex: 1, alignItems: 'center' }}>
                    <PersonInfo user={user} dynamicStyles={dynamicStyles} role="Manager"/>

                    <StoreManagementCard
                        dynamicStyles={dynamicStyles}
                        isDarkMode={isDarkMode}
                        onOrders={() => {/* navigate to orders */ }}
                        onInventory={() => {/* navigate to inventory */ }}
                        onStatus={() => {/* navigate to status */ }}
                    />

                    <ManagementCard
                        title="Store Management"
                        rows={[
                            { label: "Orders", onPress: () => {/* navigate to orders */ } },
                            { label: "Inventory/Stock", onPress: () => {/* navigate to inventory */ } },
                            { label: "Status", value: "Working", onPress: () => {/* navigate to status */ } },
                        ]}
                        dynamicStyles={dynamicStyles}
                    />

                    <View style={dynamicStyles.managementCard}>
                        <TouchableOpacity style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 20, borderRadius: 10, justifyContent: 'space-between', flexDirection: 'row' }}
                            onPress={() => navigation.navigate('addProduct' as never)}>
                            <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Add Product</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('addProduct' as never)}>
                                <Text style={[dynamicStyles.text, { fontSize: 14 }]}>Upload new item {">"}</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
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