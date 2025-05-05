import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useTheme } from '../../../context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Account() {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#61EDFF',
    },
    header: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
    },
    text: {
      color: isDarkMode ? '#FFFFFF' : 'black',
    },
    searchContainer: {
      backgroundColor: isDarkMode ? '#383838' : '#FFFFFF',
    },
    searchText: {
      color: isDarkMode ? '#FFFFFF' : 'black',
    },
    productCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    productList: {
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    textContainer: {
      backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
    },
    loadingBackground: {
      backgroundColor: isDarkMode ? '#121212' : '#61EDFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity style={{ marginLeft: "7%" }}>
            <Text style={[{ fontSize: 22 }, dynamicStyles.text]}>Edit</Text>
          </TouchableOpacity>
          <Text style={[{fontSize: 40, fontWeight: 'bold'}, , dynamicStyles.text]}>Account</Text>
          <TouchableOpacity style={{marginRight: "7%"}} onPress={toggleTheme}>
            <MaterialIcons
              name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
              size={24}
              color={isDarkMode ? '#FFD700' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <View style = {dynamicStyles.loadingContainer}>

        </View>
      </SafeAreaView>

    </GestureHandlerRootView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 10,
  },
});