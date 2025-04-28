import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../Context/ThemeContext'; // Add this import

export default function AuthLayout() {
    return (
        // Wrap your Stack with ThemeProvider
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" options={{
                    title: 'Login',
                    headerShown: false,
                }}
                />
                <Stack.Screen name="register" options={{
                    title: 'Register',
                    headerShown: false,
                    presentation: 'modal',
                }}
                />
                <Stack.Screen name="reset_password" options={{
                    title: 'Reset Password',
                    headerShown: false,
                    presentation: 'modal',
                }}
                />
            </Stack>
        </ThemeProvider>
    );
}