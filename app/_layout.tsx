import { AddressProvider } from '@/context/AddressContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <AddressProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <Stack.Screen name="(tabs)" />
            ) : (
              <Stack.Screen name="(auth)" />
            )}
          </Stack>
          <StatusBar style="auto" />
        </AddressProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
