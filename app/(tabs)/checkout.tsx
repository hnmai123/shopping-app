import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function CheckoutScreen() {
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

    const navigation = useNavigation<NavigationProp<NavigationStackParamList>>(); // Access the navigation object

    const route = useRoute<CheckoutScreenRouteProp>();
    const { cart, cartCount, totalAmount } = route.params;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={{ marginLeft: "6%" }} onPress={() => navigation.navigate('cart')}>
                        <Text style={{ fontSize: 20 }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: 'bold', fontSize: 35 }}>Checkout
                        <Text style={{ fontSize: 12 }}> ({cartCount})</Text>
                    </Text>
                    <TouchableOpacity style={{ marginRight: "6%" }}>
                        <MaterialIcons name="dark-mode" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cartContainer}>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.productCard}>
                                <View style={styles.cardHeader}>
                                    <Ionicons name="storefront-outline" size={24} color="black" style={{ marginLeft: "2%" }} />
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 22 }}>{item.seller}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                    <Image source={{ uri: item.image }} style={styles.productImage} />
                                    <View style={styles.productInfo}>
                                        <Text style={{ fontSize: 18, marginBottom: 5 }}>{item.name}</Text>
                                        <Text>{formatter.format(item.price)}</Text>
                                        <Text>Quantity: {item.quantity}</Text>

                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ marginBottom: 5 }}>Total Price: {formatter.format(item.quantity * item.price)}</Text>
                                            <Text style={{ color: '#666666', fontSize: 12 }}>Include GST of {formatter.format(item.quantity * item.price / 11)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.cartSummary}>
                    <View style={styles.cartSummaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <Ionicons name="location-outline" size={24} color="black" />
                            <Text style={{ marginLeft: 5 }}>Shipping address</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: '#666666' }}>Default Address {">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cartSummaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <MaterialIcons name="local-shipping" size={24} color="black" />
                            <Text style={{ marginLeft: 5 }}>Shipping cost</Text>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{formatter.format(0)}</Text>
                    </View>
                    <View style={styles.cartSummaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                            <MaterialIcons name="payment" size={24} color="black" />
                            <Text style={{ marginLeft: 5 }}>Payment method</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: '#666666' }}>Default Payment {">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cartSummaryRow}>
                        <Text>Total Amount</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{formatter.format(totalAmount)}</Text>
                        <TouchableOpacity style={{ backgroundColor: '#00B1BA', height: 45, borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Place Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
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
        backgroundColor: '#86eff5',
        borderRadius: 10,
        margin: 10,
        position: 'absolute',
        bottom: 70,
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
})