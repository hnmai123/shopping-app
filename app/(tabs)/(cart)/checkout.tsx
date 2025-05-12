import { useCart } from '@/context/CartContext';
import { auth, db } from '@/firebase/firebaseConfig';
import { createOrder } from '@/firebase/orderService';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from '../../../context/ThemeContext';

export default function CheckoutScreen() {
    const {updateCart} = useCart();
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

    const fetchSellerName = async (sellerId: string) : Promise<string> => {
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
                <View style={[styles.header, dynamicStyles.header]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={[dynamicStyles.text, { fontSize: 20 }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 35 }]}>Checkout
                        <Text style={[dynamicStyles.text, { fontSize: 12 }]}> ({cartCount})</Text>
                    </Text>
                    <TouchableOpacity onPress={toggleTheme}>
                        <MaterialIcons 
                            name={isDarkMode ? 'wb-sunny' : 'dark-mode'} 
                            size={24} 
                            color={isDarkMode ? '#FFD700' : 'black'} 
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.cartContainer, dynamicStyles.container]}>
                    <FlatList
                        data={cartWithSellerNames}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={[styles.productCard, dynamicStyles.card]}>
                                <View style={[styles.cardHeader, dynamicStyles.cardHeader]}>
                                    <Ionicons name="storefront-outline" size={24} color={dynamicStyles.icon.color} style={{ position: 'absolute', left: "2%" }} />
                                    <Text style={[dynamicStyles.text, { fontSize: 22 }]}>{item.sellerName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                    <Image source={{ uri: item.image }} style={styles.productImage} />
                                    <View style={styles.productInfo}>
                                        <Text style={[dynamicStyles.text, { fontSize: 18, marginBottom: 5 }]}>{item.name}</Text>
                                        <Text style={dynamicStyles.text}>{formatter.format(item.price)}</Text>
                                        <Text style={dynamicStyles.text}>Quantity: {item.quantity}</Text>

                                        <View style={{ marginTop: 10 }}>
                                            <Text style={[dynamicStyles.text, { marginBottom: 5 }]}>Total Price: {formatter.format(item.quantity * item.price)}</Text>
                                            <Text style={[dynamicStyles.secondaryText, { fontSize: 12 }]}>Include GST of {formatter.format(item.quantity * item.price / 11)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={[styles.cartSummary, dynamicStyles.cartSummary]}>
                    <View style={styles.cartSummaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <Ionicons name="location-outline" size={24} color={dynamicStyles.icon.color} />
                            <Text style={[dynamicStyles.text, { marginLeft: 5 }]}>Shipping address</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={dynamicStyles.secondaryText}>Default Address {">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cartSummaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <MaterialIcons name="local-shipping" size={24} color={dynamicStyles.icon.color} />
                            <Text style={[dynamicStyles.text, { marginLeft: 5 }]}>Shipping cost</Text>
                        </View>
                        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20 }]}>{formatter.format(0)}</Text>
                    </View>
                    <View style={styles.cartSummaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <MaterialIcons name="payment" size={24} color={dynamicStyles.icon.color} />
                            <Text style={[dynamicStyles.text, { marginLeft: 5 }]}>Payment method</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={dynamicStyles.secondaryText}>Default Payment {">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cartSummaryRow}>
                        <Text style={dynamicStyles.text}>Total Amount</Text>
                        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 17 }]}>{formatter.format(totalAmount)}</Text>
                        <TouchableOpacity 
                            style={[styles.placeOrderButton, dynamicStyles.button]} 
                            onPress={() => {
                                // Handle order placement logic here
                                setShowNotification(true);
                                handleCheckout(); // Call the checkout function
                                // Show notification for 3 seconds
                                setTimeout(() => {
                                    setShowNotification(false);
                                }, 3000);
                            }}
                        >
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
        paddingHorizontal: 20
    },
    cartContainer: {
        flex: 1
    },
    productCard: {
        borderRadius: 10,
        margin: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: 'relative'
    },
    productImage: {
        width: "50%",
        height: 130,
        resizeMode: 'contain',
    },
    productInfo: {
        padding: 5,
        marginLeft: 5,
        flex: 1,
        justifyContent: 'space-between',
    },
    cartSummary: {
        borderRadius: 10,
        margin: 10,
        width: '95%',
        alignSelf: 'center',
    },
    cartSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
        padding: 10,
        alignItems: 'center',
    },
    placeOrderButton: {
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
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
        backgroundColor: '#00B1BA',  // Ensure it’s not red
    }
});
