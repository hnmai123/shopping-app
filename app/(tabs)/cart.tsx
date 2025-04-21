import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../../context/CartContext'; // Import the useCart hook
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Cart() {
    const { cart, cartCount, updateCart } = useCart(); // Access global cart state
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
        updateCart(updatedCart); // Update the global cart state
    }
    const deleteItem = (item: any) => {
        const updatedCart = cart.filter((cartItem: any) => cartItem.id !== item.id);
        updateCart(updatedCart); // Update the global cart state
    };
    const totalAmount = cart.reduce((total: number, item: any) => total + item.price * item.quantity, 0);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>My Cart
                        <Text style={{ fontSize: 12 }}> ({cartCount})</Text>
                    </Text>
                    <TouchableOpacity style={styles.darkModeButton}>
                        <MaterialIcons name="dark-mode" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cartContainer}>
                    {cart.length === 0 ? (
                        <View style={styles.emptyCartContainer}>
                            <Text style={styles.emptyCartText}>Your cart is empty!</Text>
                            <Text style={styles.emptyCartText}>Go shopping to get more experience!</Text>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={cart}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.productCard}>
                                        <View style={styles.cardHeader}>
                                            <Ionicons name="storefront-outline" size={24} color="black" />
                                            <Text style={{ fontSize: 22, paddingLeft: 10 }}>{item.seller}</Text>
                                            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => deleteItem(item)}>
                                                <Text>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', padding: 5 }}>
                                            <Image source={{ uri: item.image }} style={styles.productImage} />
                                            <View style={styles.productInfo}>
                                                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                                                <Text style={{ fontSize: 15 }}>{item.description}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text>{formatter.format(item.price)}</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <TouchableOpacity onPress={() => updateQuantity(item, 'increase')}>
                                                            <MaterialCommunityIcons name="plus-circle-outline" size={24} color="black" style={styles.quantity} />
                                                        </TouchableOpacity>
                                                        <Text style={styles.quantity}>{item.quantity}</Text>
                                                        <TouchableOpacity onPress={() => updateQuantity(item, 'decrease')} disabled={item.quantity === 1}>
                                                            <MaterialCommunityIcons name="minus-circle-outline" size={24} color="black" style={styles.quantity} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                )} />
                            <View style={styles.cartSummary}>
                                <View style={styles.cartSummaryRow}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                                    <MaterialCommunityIcons name="ticket-percent-outline" size={24} color="black" style ={{marginRight: 10}}/>
                                    <Text>Packme voucher</Text>
                                    </View>
                                    
                                    <TouchableOpacity>
                                        <Text>Select or enter code {'>'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.cartSummaryRow}>
                                    <View style ={{flexDirection: 'row', alignItems: 'center', padding: 5}}>
                                    <MaterialCommunityIcons name="wallet-membership" size={24} color="black" style ={{marginRight: 10}}/>
                                    <Text>Receivable point</Text>
                                    </View>
                                    <Text style = {{fontWeight: 'bold', fontSize: 25, marginRight: '8%'}}>{Math.round(totalAmount)}</Text>
                                </View>
                                <View style={styles.cartSummaryRow}>
                                    <Text>Total Amount</Text>
                                    <Text style = {{fontWeight: 'bold', fontSize: 20}}>{formatter.format(totalAmount)}</Text>
                                    <TouchableOpacity style ={{backgroundColor: '#00B1BA', height: 45, borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                                        <Text style ={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Place Order</Text>
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
        backgroundColor: '#e9f5f9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        backgroundColor: '#61EDFF',
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
        backgroundColor: '#e9f5f9',
        flex: 1
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 10,
    },
    cardHeader: {
        backgroundColor: '#61EDFF',
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
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
    },
    emptyCartText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    quantity: {
        fontSize: 18,
        color: 'black',
        paddingHorizontal: 8,
    },
    cartSummary: {
        backgroundColor: '#86eff5',
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
    }
});
