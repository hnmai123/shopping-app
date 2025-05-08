import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="account"
                options={{
                    title: 'Profile',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name ="supplier"
                options={{
                    title: 'Supplier',
                    headerShown: false,
                    // Removed tabBarStyle as it is not valid for Stack.Screen
                }}
            />
            <Stack.Screen
                name="map"
                options={{
                    title: 'Map',
                    presentation: 'modal',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
