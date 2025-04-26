import {Stack} from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
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
    );
}