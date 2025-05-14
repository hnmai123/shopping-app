import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function StoreManagementCard({ dynamicStyles, isDarkMode, onOrders, onInventory, onStatus }: any) {
    return (
        <View style={dynamicStyles.managementCard}>
            <View style={{
                backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
                padding: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Store Management</Text>
            </View>
            <View style={{
                height: 1,
                backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
            }} />

            <View style={dynamicStyles.managementRow}>
                <Text style={dynamicStyles.text}>Orders</Text>
                <TouchableOpacity onPress={onOrders}>
                    <Text style={dynamicStyles.text}>View {">"}</Text>
                </TouchableOpacity>
            </View>
            <View style={dynamicStyles.divider} />

            <View style={dynamicStyles.managementRow}>
                <Text style={dynamicStyles.text}>Inventory/Stock</Text>
                <TouchableOpacity onPress={onInventory}>
                    <Text style={dynamicStyles.text}>View {">"}</Text>
                </TouchableOpacity>
            </View>
            <View style={dynamicStyles.divider} />

            <View style={dynamicStyles.managementRow}>
                <Text style={dynamicStyles.text}>Status</Text>
                <Text style={dynamicStyles.text}>Working</Text>
                <TouchableOpacity onPress={onStatus}>
                    <Text style={dynamicStyles.text}>View {">"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}