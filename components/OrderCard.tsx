import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/OrdersScreenStyles';

export default function OrderCard({
    order,
    orderIndex,
    totalOrders,
    isDarkMode,
    dynamicStyles,
    formatter,
    onPrev,
    onNext,
    onRate,
    onFeedback,
    isRating,
}: any) {
    return (
        <View style={[isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: 'white' }, { paddingBottom: 10, borderRadius: 10 }]}>
            <View
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    },
                    isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: '#61EDFF' },
                ]}>
                <TouchableOpacity disabled={orderIndex === 0} onPress={onPrev}>
                    <Ionicons
                        name="chevron-back"
                        size={32}
                        color={orderIndex === 0 ? '#aaa' : '#007AFF'}
                    />
                </TouchableOpacity>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 18 }]}>
                    Order #{String(orderIndex + 1).padStart(3, '0')}
                </Text>
                <TouchableOpacity disabled={orderIndex === totalOrders - 1} onPress={onNext}>
                    <Ionicons
                        name="chevron-forward"
                        size={32}
                        color={orderIndex === totalOrders - 1 ? '#aaa' : '#007AFF'}
                    />
                </TouchableOpacity>
            </View>
            <View style={{
                height: 1,
                backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
            }} />
            {order.items.map((item: any, i: number) => (
                <React.Fragment key={item.name + i}>
                    <View
                        style={[
                            styles.itemCard,
                            isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: 'white' },
                        ]}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={[styles.itemName, dynamicStyles.text]}>{item.name}</Text>
                            <Text style={dynamicStyles.text}>{formatter.format(item.price)}</Text>
                            <Text style={dynamicStyles.text}>Quantity: {item.quantity}</Text>
                            <Text style={dynamicStyles.text}>GST: {formatter.format(item.price / 11)}</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
                        }}
                    />
                </React.Fragment>
            ))}
            <Text style={[dynamicStyles.text, { paddingLeft: 15, marginTop: 10, fontWeight: 'bold' }]}>
                Total: {formatter.format(order.totalAmount)}
            </Text>
            <View
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 8,
                    },
                    isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: '#FFFFFF' },
                ]}>
                <TouchableOpacity onPress={() => onFeedback('unhappy')}>
                    <Ionicons name="thumbs-down-outline" size={30} color="#FF3B30" />
                    <Text style={[dynamicStyles.text, { textAlign: 'center', fontSize: 12 }]}>Unhappy</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => onRate(star)} disabled={isRating}>
                            <Ionicons
                                name={star <= (order.rating || 0) ? 'star' : 'star-outline'}
                                size={30}
                                color="#FFD700"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={() => onFeedback('happy')}>
                    <Ionicons name="happy-outline" size={30} color="#4CD964" />
                    <Text style={[dynamicStyles.text, { textAlign: 'center', fontSize: 12 }]}>Happy</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}