import Header from '@/components/Header';
import MapComponent from '@/components/Map';
import { useAddress } from '@/context/AddressContext';
import { useTheme } from '@/context/ThemeContext';
import { auth, db } from '@/firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MapPicker() {
  const { coords, setCoords, setAddress: setGlobalAddress } = useAddress();
  const [location, setLocation] = useState(coords);
  const [address, setAddress] = useState('Fetching address...');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    (async () => {
      try {
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
      setGlobalAddress(formatted);
    } else {
      setAddress("Unknown location");
      setGlobalAddress("Unknown location");
    }
  };

  const handleLocationChange = async (coords: { latitude: number; longitude: number }) => {
    setLocation(coords);
    setAddress('Loading...');
    await reverseGeocode(coords);
  };

  const handleConfirm = async () => {
    if (location) {
      setCoords(location);
      setGlobalAddress(address);
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          address,
          coords: location,
        });
      }
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
      <Header
        title="Pick a Location"
        onBack={() => navigation.goBack()}
        onToggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        dynamicStyles={{
          header: { backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF' },
          text: { color: isDarkMode ? 'white' : 'black' }
        }}
      />

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
