import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../../../context/CartContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

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

    const updateQuantity = (item: any, action: string) => {
        const updatedCart = cart.map((cartItem: any) => {
            if (cartItem.id === item.id) {
                const newQuantity = action === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;
                return { ...cartItem, quantity: newQuantity > 0 ? newQuantity : 1 };
            }
            return cartItem;
        })
        updateCart(updatedCart);
    }

    const deleteItem = (item: any) => {
        const updatedCart = cart.filter((cartItem: any) => cartItem.id !== item.id);
        updateCart(updatedCart);
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
                <View style={[styles.header, dynamicStyles.header]}>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={[styles.editButtonText, dynamicStyles.text]}>Edit</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerText, dynamicStyles.text]}>My Cart
                        <Text style={[dynamicStyles.text, { fontSize: 12 }]}> ({cartCount})</Text>
                    </Text>
                    <TouchableOpacity style={styles.darkModeButton} onPress={toggleTheme}>
                        <MaterialIcons 
                            name={isDarkMode ? 'wb-sunny' : 'dark-mode'} 
                            size={24} 
                            color={isDarkMode ? '#FFD700' : 'black'} 
                        />
                    </TouchableOpacity>
                </View>
                <View style={[styles.cartContainer, dynamicStyles.cartContainer]}>
                    {cart.length === 0 ? (
                        <View style={[styles.emptyCartContainer, dynamicStyles.card]}>
                            <Text style={[styles.emptyCartText, dynamicStyles.text]}>Your cart is empty!</Text>
                            <Text style={[styles.emptyCartText, dynamicStyles.text]}>Go shopping to get more experience!</Text>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={cart}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={[styles.productCard, dynamicStyles.card]}>
                                        <View style={[styles.cardHeader, dynamicStyles.cardHeader]}>
                                            <Ionicons name="storefront-outline" size={24} color={dynamicStyles.icon.color} />
                                            <Text style={[dynamicStyles.text, { fontSize: 22, paddingLeft: 10 }]}>{item.seller}</Text>
                                            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => deleteItem(item)}>
                                                <Text style={dynamicStyles.text}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 5 }}>
                                            <Image source={{ uri: item.image }} style={styles.productImage} />
                                            <View style={styles.productInfo}>
                                                <Text style={[dynamicStyles.text, { fontSize: 18 }]}>{item.name}</Text>
                                                <Text style={[dynamicStyles.secondaryText, { fontSize: 15 }]}>{item.description}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={dynamicStyles.text}>{formatter.format(item.price)}</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <TouchableOpacity onPress={() => updateQuantity(item, 'increase')}>
                                                            <MaterialCommunityIcons name="plus-circle-outline" size={24} color={dynamicStyles.icon.color} style={styles.quantity} />
                                                        </TouchableOpacity>
                                                        <Text style={[styles.quantity, dynamicStyles.text]}>{item.quantity}</Text>
                                                        <TouchableOpacity onPress={() => updateQuantity(item, 'decrease')} disabled={item.quantity === 1}>
                                                            <MaterialCommunityIcons name="minus-circle-outline" size={24} color={dynamicStyles.icon.color} style={styles.quantity} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )} 
                            />
                            <View style={[styles.cartSummary, dynamicStyles.cartSummary]}>
                                <View style={styles.cartSummaryRow}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                        <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={dynamicStyles.icon.color} style={{ marginRight: 10 }} />
                                        <Text style={dynamicStyles.text}>Packme voucher</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Text style={dynamicStyles.secondaryText}>Select or enter code {'>'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cartSummaryRow}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                        <MaterialCommunityIcons name="wallet-membership" size={24} color={dynamicStyles.icon.color} style={{ marginRight: 10 }} />
                                        <Text style={dynamicStyles.text}>Receivable point</Text>
                                    </View>
                                    <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 25}]}>{Math.round(totalAmount)}</Text>
                                </View>
                                <View style={styles.cartSummaryRow}>
                                    <Text style={dynamicStyles.text}>Total Amount</Text>
                                    <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20 }]}>{formatter.format(totalAmount)}</Text>
                                    <TouchableOpacity
                                        style={[styles.checkoutButton, dynamicStyles.button]}
                                        onPress={() => navigation.navigate('checkout', { cart, cartCount, totalAmount })}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Checkout</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
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
    editButton: {
        marginLeft: "7%"
    },
    editButtonText: {
        fontSize: 22,
    },
    headerText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    darkModeButton: {
        marginRight: "7%"
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
        padding: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'space-between',
    },
    productImage: {
        width: "50%",
        height: 125,
        resizeMode: 'contain',
    },
    productInfo: {
        padding: 5,
        flex: 1,
        justifyContent: 'space-between',
    },
    emptyCartContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 10,
    },
    emptyCartText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantity: {
        fontSize: 18,
        paddingHorizontal: 8,
    },
    cartSummary: {
        borderRadius: 10,
        margin: 10,
        position: 'absolute',
        bottom: 40,
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
    checkoutButton: {
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});