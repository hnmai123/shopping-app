import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import MapComponent from '@/components/Map';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type MapPickerRouteParams = {
  onLocationSelected: (location: { latitude: number; longitude: number }, address: string) => void;
};

export default function MapPicker() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('Fetching address...');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode, toggleTheme } = useTheme();

//   const { onLocationSelected } = route.params as MapPickerRouteParams;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission denied", "Please enable location access.");
          return;
        }

        const current = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        setLocation(coords);
        await reverseGeocode(coords);
        setLoading(false);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch location.");
        setLoading(false);
      }
    })();
  }, []);

  const reverseGeocode = async (coords: { latitude: number; longitude: number }) => {
    const geo = await Location.reverseGeocodeAsync(coords);
    if (geo.length > 0) {
      const { street, city, region, postalCode, country } = geo[0];
      const formatted = `${street || ''}, ${city || ''}, ${region || ''} ${postalCode || ''}, ${country || ''}`.trim();
      setAddress(formatted);
    } else {
      setAddress("Unknown location");
    }
  };

  const handleLocationChange = async (coords: { latitude: number; longitude: number }) => {
    setLocation(coords);
    setAddress('Loading...');
    await reverseGeocode(coords);
  };

  const handleConfirm = () => {
    if (location) {
    //   onLocationSelected(location, address);
      navigation.goBack();
    }
  };

  if (loading || !location) {
    return (
      <View style={[styles.center, { backgroundColor: isDarkMode ? '#121212' : 'white' }]}>
        <ActivityIndicator size="large" color="#00B1BA" />
        <Text style={{ marginTop: 10, color: isDarkMode ? 'white' : 'black' }}>Loading map...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : '#ffffff' }}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDarkMode ? 'white' : 'black' }]}>Pick a Location</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <MaterialIcons name={isDarkMode ? 'wb-sunny' : 'dark-mode'} size={24} color={isDarkMode ? '#FFD700' : 'black'} />
        </TouchableOpacity>
      </View>

      <MapComponent
        initialLocation={location}
        selectable={true}
        onLocationChange={handleLocationChange}
      />

      <View style={[styles.infoPanel, { backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff' }]}>
        <Text style={{ fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>Selected Address:</Text>
        <Text style={{ marginTop: 4, color: isDarkMode ? '#BBBBBB' : '#333' }}>{address}</Text>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoPanel: {
    padding: 16,
  },
  confirmButton: {
    backgroundColor: '#00B1BA',
    padding: 12,
    marginTop: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
});
