import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function CartItem({ item, dynamicStyles, styles, updateQuantity, deleteItem, formatter }: any) {
    return (
        <View style={[styles.productCard, dynamicStyles.card]}>
            <View style={[styles.cardHeader, dynamicStyles.cardHeader]}>
                <Ionicons name="storefront-outline" size={24} color={dynamicStyles.icon.color} />
                <Text style={[dynamicStyles.text, { fontSize: 22, paddingLeft: 10 }]}>{item.sellerName}</Text>
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
    );
}