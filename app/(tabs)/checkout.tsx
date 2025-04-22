import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CheckoutScreen() {
    const cartCount = 0
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                    <TouchableOpacity style={{marginLeft: "7%"}}>
                        <Text style={{fontSize: 22}}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style = {{fontWeight: 'bold'}}>Checkout
                        <Text style={{ fontSize: 12}}> ({cartCount})</Text>
                    </Text>
                    <TouchableOpacity>
                        <MaterialIcons name="dark-mode" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {

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

    }
})