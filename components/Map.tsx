import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

type Props = {
  initialLocation: { latitude: number; longitude: number };
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  selectable?: boolean;
  markerTitle?: string;
  height?: number;
};

export default function MapComponent({
  initialLocation,
  onLocationChange,
  selectable = false,
  markerTitle = 'Selected Location',
  height,
}: Props) {
  const handleMapPress = (event: MapPressEvent) => {
    if (selectable && onLocationChange) {
      const { coordinate } = event.nativeEvent;
      onLocationChange(coordinate);
    }
  };

  return (
    <View style={[styles.container, height ? { height } : null]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          ...initialLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={initialLocation} title={markerTitle} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ let the parent control the height unless overridden
    borderRadius: 10,
    overflow: 'hidden',
  },
});
