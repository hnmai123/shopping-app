import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Image, Text, View } from 'react-native';

export default function CartItemCard({ item, dynamicStyles, styles, formatter }: any) {
    return (
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
    );
}