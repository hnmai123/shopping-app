import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

type Props = {
  height?: number;
  borderRadius?: number;
  onAddressRetrieved?: (address: string, location: { latitude: number; longitude: number }) => void;
};

export default function MapLocation({ height = 180, borderRadius = 10, onAddressRetrieved }: Props) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        const newLocation = { latitude, longitude };
        setLocation(newLocation);

        const geocode = await Location.reverseGeocodeAsync(newLocation);

        let formatted = 'Unknown location';
        if (geocode.length > 0) {
          const { street, city, region, postalCode, country } = geocode[0];
          formatted = `${street || ''}, ${city || ''}, ${region || ''} ${postalCode || ''}, ${country || ''}`.trim();
        }
        onAddressRetrieved?.(formatted, newLocation);

      } catch (err) {
        setError('Failed to fetch location');
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={[styles.loading, { height }]}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={[styles.loading, { height }]}>
        <ActivityIndicator size="large" color="green" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <View style={{ height, borderRadius, overflow: 'hidden', backgroundColor: 'lightgray' }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        <Marker coordinate={location} title="You are here" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
});
