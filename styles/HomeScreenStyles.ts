import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardMargin = 5;
const cardWidth = (screenWidth / 2) - (cardMargin * 3);

export const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
    searchBox: { flex: 1, fontSize: 16 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 46,
        marginVertical: 10,
        width: '80%',
        marginLeft: 10
    },
    productCard: {
        width: cardWidth,
        margin: cardMargin,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center'
    },
    productImage: { width: '100%', height: 100, resizeMode: 'contain' },
    productList: { padding: cardMargin },
    textContainer: { width: '100%', padding: 5 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    darkModeButton: { alignItems: 'center', justifyContent: 'center', margin: 20 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});