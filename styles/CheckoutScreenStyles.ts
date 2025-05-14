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
