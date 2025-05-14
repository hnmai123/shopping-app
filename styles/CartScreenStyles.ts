import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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