import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Header from '@/components/Header';
import { deleteItemFromFirestore, syncCartToFirestore } from '@/firebase/cartService';
import { db } from '@/firebase/firebaseConfig';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from '../../../styles/CartScreenStyles';

export default function Cart() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { theme, toggleTheme, isDarkMode } = useTheme();

    type RootStackParamList = {
        cart: { cart: any, cartCount: number, totalAmount: number };
        checkout: { cart: any, cartCount: number, totalAmount: number };
    };

    const { cart, cartCount, updateCart } = useCart();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'AUD',
    });

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

    const updateQuantity = async (item: any, action: string) => {
        const updatedCart = cart.map((cartItem: any) => {
            if (cartItem.id === item.id) {
                const newQuantity = action === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;
                return { ...cartItem, quantity: newQuantity > 0 ? newQuantity : 1 };
            }
            return cartItem;
        })
        updateCart(updatedCart);
        await syncCartToFirestore(updatedCart);
    }

    const deleteItem = async (item: any) => {
        const updatedCart = cart.filter((cartItem: any) => cartItem.id !== item.id);
        updateCart(updatedCart);
        await deleteItemFromFirestore(item.id);
    };

    const totalAmount = cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0);

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
        cartContainer: {
            backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
        }
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                <Header
                    title="My Cart"
                    onToggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    dynamicStyles={dynamicStyles}
                    backIconName="delete"
                    onBack={() => navigation.goBack()}
                    count={cartCount}
                />
                <View style={[styles.cartContainer, dynamicStyles.cartContainer]}>
                    {cart.length === 0 ? (
                        <View style={[styles.emptyCartContainer, dynamicStyles.card]}>
                            <Text style={[styles.emptyCartText, dynamicStyles.text]}>Your cart is empty!</Text>
                            <Text style={[styles.emptyCartText, dynamicStyles.text]}>Go shopping to get more experience!</Text>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={cartWithSellerNames}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <CartItem
                                        item={item}
                                        dynamicStyles={dynamicStyles}
                                        styles={styles}
                                        updateQuantity={updateQuantity}
                                        deleteItem={deleteItem}
                                        formatter={formatter}
                                    />
                                )}
                            />
                            <CartSummary
                                totalAmount={totalAmount}
                                dynamicStyles={dynamicStyles}
                                styles={styles}
                                navigation={navigation}
                                cart={cart}
                                cartCount={cartCount}
                                formatter={formatter}
                            />
                        </>
                    )}
                </View>

            </SafeAreaView>
        </GestureHandlerRootView>
    );
}