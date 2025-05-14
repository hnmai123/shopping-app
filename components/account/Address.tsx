import MapComponent from '@/components/Map';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AddressSection({
    dynamicStyles,
    isDarkMode,
    coords,
    address,
    navigation,
    handleCurrentLocation,
}: any) {
    return (
        <View style={dynamicStyles.addressCard}>
            <View style={{
                backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
                padding: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>
                    Billing & Shipping Address
                </Text>
            </View>
            <View style={dynamicStyles.divider} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 5 }}>
                <TouchableOpacity style={{ width: '50%', marginRight: 10 }} onPress={() => navigation.navigate('map' as never)}>
                    <MapComponent initialLocation={coords} selectable={false} height={150} />
                </TouchableOpacity>
                <View style={{ flex: 1, margin: 5, gap: 10 }}>
                    <Text style={dynamicStyles.text}>{address || "Address"}</Text>
                    <TouchableOpacity onPress={handleCurrentLocation}>
                        <Text style={{ color: isDarkMode ? '#66B2FF' : '#007AFF' }}>Using your location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('map' as never)}>
                        <Text style={dynamicStyles.text}>Change {">"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}