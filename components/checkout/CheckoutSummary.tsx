import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutSummary({ dynamicStyles, styles, formatter, totalAmount, onPlaceOrder }: any) {
  return (
    <View style={[styles.cartSummary, dynamicStyles.cartSummary]}>
      <View style={styles.cartSummaryRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
          <Ionicons name="location-outline" size={24} color={dynamicStyles.icon.color} />
          <Text style={[dynamicStyles.text, { marginLeft: 5 }]}>Shipping address</Text>
        </View>
        <TouchableOpacity>
          <Text style={dynamicStyles.secondaryText}>Default Address {">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cartSummaryRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
          <MaterialIcons name="local-shipping" size={24} color={dynamicStyles.icon.color} />
          <Text style={[dynamicStyles.text, { marginLeft: 5 }]}>Shipping cost</Text>
        </View>
        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20 }]}>{formatter.format(0)}</Text>
      </View>
      <View style={styles.cartSummaryRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
          <MaterialIcons name="payment" size={24} color={dynamicStyles.icon.color} />
          <Text style={[dynamicStyles.text, { marginLeft: 5 }]}>Payment method</Text>
        </View>
        <TouchableOpacity>
          <Text style={dynamicStyles.secondaryText}>Default Payment {">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cartSummaryRow}>
        <Text style={dynamicStyles.text}>Total Amount</Text>
        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 17 }]}>{formatter.format(totalAmount)}</Text>
        <TouchableOpacity
          style={[styles.placeOrderButton, dynamicStyles.button]}
          onPress={onPlaceOrder}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}