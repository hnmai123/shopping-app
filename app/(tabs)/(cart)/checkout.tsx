import CartItemCard from '@/components/checkout/CartItemCard';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { auth, db } from '@/firebase/firebaseConfig';
import { createOrder } from '@/firebase/orderService';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from '../../../context/ThemeContext';
import { styles } from '../../../styles/CheckoutScreenStyles';

export default function CheckoutScreen() {
    const { updateCart } = useCart();
    const [showNotification, setShowNotification] = useState(false); // Add notification state

    type RootStackParamList = {
        checkout: { cart: any[]; cartCount: number; totalAmount: number };
    };

    type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'checkout'>;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AUD',
    });

    type NavigationStackParamList = {
        cart: undefined;
        checkout: { cart: any[]; cartCount: number; totalAmount: number };
    };

    const navigation = useNavigation<NavigationProp<NavigationStackParamList>>();
    const route = useRoute<CheckoutScreenRouteProp>();
    const { cart, cartCount, totalAmount } = route.params;
    const { theme, toggleTheme, isDarkMode } = useTheme();

    const fetchSellerName = async (sellerId: string): Promise<string> => {
        try {
            const sellerDoc = await getDoc(doc(db, 'users', sellerId));
            if (sellerDoc.exists()) {
                const sellerData = sellerDoc.data();
                return sellerData?.name || 'Seller';
            }
        } catch (error) {
            console.error("Error fetching seller name:", error);
        }
        return "Seller";
    }
    const [cartWithSellerNames, setCartWithSellerNames] = useState<any[]>([]);

    useEffect(() => {
        const fetchSellerNames = async () => {
            const updatedCart = await Promise.all(
                cart.map(async (item: any) => {
                    const sellerName = await fetchSellerName(item.seller); // Fetch seller name
                    return { ...item, sellerName }; // Add sellerName to the cart item
                })
            );
            setCartWithSellerNames(updatedCart); // Update state with cart items including seller names
        };

        fetchSellerNames();
    }, [cart]); // Re-run if the cart changes

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
            color: isDarkMode ? '#BBBBBB' : '#666666',
        },
        card: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        },
        cardHeader: {
            backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
        },
        cartSummary: {
            backgroundColor: isDarkMode ? '#383838' : '#86eff5',
        },
        button: {
            backgroundColor: isDarkMode ? '#00B1BA' : '#00B1BA',
        },
        icon: {
            color: isDarkMode ? '#FFFFFF' : 'black',
        },
        notificationBanner: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            backgroundColor: isDarkMode ? '#00B1BA' : '#00B1BA',  // Make sure the background color is not red
        },
    });

    const handleCheckout = async () => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const userRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userRef);

            if (!userSnapshot.exists()) throw new Error("User document does not exist");
            const userData = userSnapshot.data();
            const address = userData.address || "Default Address";
            const coords = userData.coords || { latitude: 0, longitude: 0 };

            const orderId = await createOrder(cart, totalAmount, address, coords);
            Alert.alert("Order placed successfully");
            const cartRef = doc(db, 'carts', user.uid);
            await deleteDoc(cartRef);
            updateCart([]);
            navigation.goBack();
        } catch (error) {
            console.error("Error placing order:", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                <Header
                    title='Checkout'
                    onToggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    dynamicStyles={dynamicStyles}
                    backIconName="arrow-back"
                    onBack={() => navigation.goBack()}
                />
                <FlatList
                    data={cartWithSellerNames}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CartItemCard
                            item={item}
                            dynamicStyles={dynamicStyles}
                            styles={styles}
                            formatter={formatter}
                        />
                    )}
                />
                <CheckoutSummary
                    dynamicStyles={dynamicStyles}
                    styles={styles}
                    formatter={formatter}
                    totalAmount={totalAmount}
                    onPlaceOrder={() => {
                        setShowNotification(true);
                        handleCheckout();
                        setTimeout(() => setShowNotification(false), 3000);
                    }}
                />
                {/* Notification Banner */}
                {showNotification && (
                    <View style={styles.notificationBanner}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Your order has been placed successfully!</Text>
                    </View>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

