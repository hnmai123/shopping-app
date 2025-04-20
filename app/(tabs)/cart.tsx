import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../../context/CartContext'; // Import the useCart hook

export default function Cart() {
    const { cart, cartCount, updateCart } = useCart(); // Access global cart state

    const deleteItem = (item: any) => {
        const updatedCart = cart.filter((cartItem: any) => cartItem.id !== item.id);
        updateCart(updatedCart); // Update the global cart state
    };
    
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
                                            <Text>${item.price}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />)}
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
});
