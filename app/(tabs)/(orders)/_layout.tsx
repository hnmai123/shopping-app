import { Stack } from 'expo-router';
import React from 'react';

export default function OrdersLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="orders" options={{
                title: 'Orders',
                headerShown: false,
            }}
            />
        </Stack>
    );
}