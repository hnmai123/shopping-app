import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../../Context/ThemeContext';

export default function CartLayout() {
    return (
        <ThemeProvider>
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
        </ThemeProvider>
    );
}