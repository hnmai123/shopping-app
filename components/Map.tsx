import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

type Props = {
  initialLocation: { latitude: number; longitude: number };
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  selectable?: boolean;
  height?: number;
};

export default function MapComponent({
  initialLocation,
  onLocationChange,
  selectable = false,
  height,
}: Props) {
  const handleMapPress = (event: MapPressEvent) => {
    if (selectable && onLocationChange) {
      onLocationChange(event.nativeEvent.coordinate);
    }
  };

  return (
    <View style={[styles.container, height ? { height } : null]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={{
          ...initialLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        <Marker
          coordinate={initialLocation}
          draggable={selectable}
          onDragEnd={(e) => {
            if (selectable && onLocationChange) {
              onLocationChange(e.nativeEvent.coordinate);
            }
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
