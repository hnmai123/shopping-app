import { Stack } from 'expo-router';
import React from 'react';

export default function OrdersLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="orderss" options={{
                title: 'Orders',
                headerShown: false,
            }}
            />
        </Stack>
    );
}