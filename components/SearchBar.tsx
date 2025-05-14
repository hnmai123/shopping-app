import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onCameraPress: () => void;
  dynamicStyles: any;
  isDarkMode: boolean;
}

export default function SearchBar({ searchQuery, onChangeText, onCameraPress, dynamicStyles, isDarkMode }: SearchBarProps) {
  return (
    <View style={[styles.searchContainer, dynamicStyles.searchContainer]}>
      <Ionicons name="search" size={24} color={isDarkMode ? '#FFFFFF' : 'black'} style={{ marginRight: 10 }} />
      <TextInput
        placeholder="Search ..."
        placeholderTextColor={isDarkMode ? '#BBBBBB' : '#666666'}
        clearButtonMode="always"
        style={[styles.searchBox, dynamicStyles.searchText]}
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onCameraPress}>
        <Ionicons name="camera-outline" size={24} color={isDarkMode ? '#FFFFFF' : 'black'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 46,
    marginVertical: 10,
    width: '80%',
    marginLeft: 10
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
  },
});