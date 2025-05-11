import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useTheme();

   return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#FFFFFF' : Colors.light.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' },
        ],
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="notifications-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(cart)"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="cart-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="bag-check-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    position: Platform.OS === 'ios' ? 'absolute' : 'relative',
    elevation: 5,
  },
});