import { Stack } from 'expo-router';
import React from 'react';

export default function CartLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="checkout"
                options={{
                    title: 'Checkout',
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}