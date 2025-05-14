import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function PaymentSection({ dynamicStyles }: any) {
    return (
        <View style={dynamicStyles.paymentCard}>
            <View style={{ backgroundColor: dynamicStyles.header.backgroundColor, padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Payment Information</Text>
            </View>
            <View style={dynamicStyles.divider} />
            <View style={dynamicStyles.paymentRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <Text style={dynamicStyles.text}>Credit cards</Text>
                    <Fontisto name="visa" size={24} color={dynamicStyles.text.color} />
                    <Fontisto name="mastercard" size={24} color={dynamicStyles.text.color} />
                    <Fontisto name="american-express" size={24} color={dynamicStyles.text.color} />
                </View>
                <TouchableOpacity>
                    <Text style={dynamicStyles.text}>**** 1234</Text>
                </TouchableOpacity>
            </View>
            <View style={dynamicStyles.divider} />
            <View style={dynamicStyles.paymentRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <Text style={dynamicStyles.text}>E-wallet</Text>
                    <Fontisto name="apple-pay" size={24} color={dynamicStyles.text.color} />
                    <FontAwesome6 name="google-pay" size={24} color={dynamicStyles.text.color} />
                    <Fontisto name="paypal" size={24} color={dynamicStyles.text.color} />
                </View>
                <TouchableOpacity>
                    <Text style={dynamicStyles.text}>Enter {">"}</Text>
                </TouchableOpacity>
            </View>
            <View style={dynamicStyles.divider} />
            <View style={dynamicStyles.paymentRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <Ionicons name="wallet-outline" size={24} color={dynamicStyles.text.color} />
                    <Text style={dynamicStyles.text}>Your balance: </Text>
                </View>
                <Text style={dynamicStyles.text}>$100</Text>
            </View>
        </View>
    );
}