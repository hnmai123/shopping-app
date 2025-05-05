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
        </Stack>
    );
}
