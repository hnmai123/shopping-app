import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function OrdersScreen() {
  const colorScheme = useColorScheme(); // Get current theme (light or dark)

  return (
    <View style={styles.container}>
      {/* header with background colour */}
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
        {/* title and counter centred */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Orders<Text style={{ fontSize: 12 }}> ({3})</Text></Text> {/* replace 3 with count for amount of orders */}
        </View>
        {/* dark mode button stuff */}
        <TouchableOpacity style={styles.darkModeButton}>
          <MaterialIcons name="dark-mode" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>

      {/* main body */}
      <View style={styles.content}>
        <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>DO THE CODE JAMES</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#e9f5f9',
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    backgroundColor: '#61EDFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  darkModeButton: {
    position: 'absolute',
    right: '7%',
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});