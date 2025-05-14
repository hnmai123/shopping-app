import { useTheme } from '@/context/ThemeContext';
import { styles } from '@/styles/NotificationStyles';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';

export default function NotificationsScreen() {
  const { toggleTheme, isDarkMode } = useTheme();

  const notifications = [
    { id: '1', title: 'Packme sent you a voucher of free shipping', action: 'receive now!', time: '2 hours ago' },
    { id: '2', title: 'Your order is coming today', action: 'check the door!', time: '5 hours ago' },
    { id: '3', title: 'The application will be updated tomorrow!', action: '', time: '1 day ago' },
    { id: '4', title: 'MixiFood sent you a message', action: 'reply now!', time: '2 days ago' },
    { id: '5', title: 'Super sales next week', action: 'up to 99%!', time: '3 days ago' },
    { id: '6', title: 'Your loyalty point is', action: '4518 points!', time: '1 week ago' }
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    header: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
    },
    text: {
      color: isDarkMode ? '#FFFFFF' : 'black',
    },
    notificationItem: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    timeText: {
      color: isDarkMode ? '#BBBBBB' : '#666666',
    }
  });

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <Header
        title="Notifications"
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        dynamicStyles={dynamicStyles}
        backIconName="message"
        onBack={() => { }}
        count={notifications.length}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationItem, dynamicStyles.notificationItem]}>
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationTitle, dynamicStyles.text]}>{item.title}</Text>
              {item.action ? (
                <Text style={[styles.notificationAction, { color: isDarkMode ? '#61EDFF' : '#00B1BA' }]}>
                  {item.action}
                </Text>
              ) : null}
              <Text style={[styles.timeText, dynamicStyles.timeText]}>{item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}