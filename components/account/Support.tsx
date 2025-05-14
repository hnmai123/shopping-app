import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SupportSection({ dynamicStyles, handleLogout }: any) {
    return (
        <View style={dynamicStyles.supportCard}>
            <View style={{ backgroundColor: dynamicStyles.header.backgroundColor, padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Support</Text>
            </View>
            <View style={dynamicStyles.divider} />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <MaterialIcons name="report-gmailerrorred" size={24} color={dynamicStyles.text.color} style={{ marginRight: 10 }} />
                <Text style={dynamicStyles.text}>Contact us</Text>
            </TouchableOpacity>
            <View style={dynamicStyles.divider} />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <Ionicons name="settings-outline" size={24} color={dynamicStyles.text.color} style={{ marginRight: 10 }} />
                <Text style={dynamicStyles.text}>Setting</Text>
            </TouchableOpacity>
            <View style={dynamicStyles.divider} />
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={dynamicStyles.text.color} style={{ marginRight: 10 }} />
                <Text style={dynamicStyles.text}>Log out</Text>
            </TouchableOpacity>
        </View>
    );
}