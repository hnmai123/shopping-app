import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CartSummary({ totalAmount, dynamicStyles, styles, navigation, cart, cartCount, formatter }: any) {
  return (
    <View style={[styles.cartSummary, dynamicStyles.cartSummary]}>
      <View style={styles.cartSummaryRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={dynamicStyles.icon.color} style={{ marginRight: 10 }} />
          <Text style={dynamicStyles.text}>Packme voucher</Text>
        </View>
        <TouchableOpacity>
          <Text style={dynamicStyles.secondaryText}>Select or enter code {'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cartSummaryRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
          <MaterialCommunityIcons name="wallet-membership" size={24} color={dynamicStyles.icon.color} style={{ marginRight: 10 }} />
          <Text style={dynamicStyles.text}>Receivable point</Text>
        </View>
        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 25 }]}>{Math.round(totalAmount)}</Text>
      </View>
      <View style={styles.cartSummaryRow}>
        <Text style={dynamicStyles.text}>Total Amount</Text>
        <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 20 }]}>{formatter.format(totalAmount)}</Text>
        <TouchableOpacity
          style={[styles.checkoutButton, dynamicStyles.button]}
          onPress={() => navigation.navigate('checkout', { cart, cartCount, totalAmount })}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}