import { Stack } from 'expo-router';
import React from 'react';

export default function SupplierLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="supplier"
                options={{
                    title: 'Supplier',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="addProduct"
                options={{
                    title: 'addProduct',
                    presentation: 'modal',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}