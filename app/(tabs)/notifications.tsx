import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const notifications = [
    {
      id: '1',
      title: 'Packme sent you a voucher of free shipping',
      action: 'receive now!',
      time: '2 hours ago'
    },
    {
      id: '2',
      title: 'Your order is coming today',
      action: 'check the door!',
      time: '5 hours ago'
    },
    {
      id: '3',
      title: 'The application will be updated tomorrow!',
      action: '',
      time: '1 day ago'
    },
    {
      id: '4',
      title: 'MixiFood sent you a message',
      action: 'reply now!',
      time: '2 days ago'
    },
    {
      id: '5',
      title: 'Super sales next week',
      action: 'up to 99%!',
      time: '3 days ago'
    },
    {
      id: '6',
      title: 'Your loyalty point is',
      action: '4518 points!',
      time: '1 week ago'
    }
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
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity style={{marginLeft: "7%"}}>
          <MaterialIcons name="message" size={24} color={isDarkMode ? '#FFD700' : 'black'}/>
        </TouchableOpacity>
        <Text style={[styles.headerText, dynamicStyles.text]}>Notifications</Text>
        <TouchableOpacity onPress={toggleTheme} style={{marginRight: "7%"}}>
          <MaterialIcons 
            name={isDarkMode ? 'wb-sunny' : 'dark-mode'} 
            size={24} 
            color={isDarkMode ? '#FFD700' : 'black'} 
          />
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 32,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  notificationItem: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationAction: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 12,
  },
});