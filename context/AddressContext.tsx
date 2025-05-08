import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type AddressContextType = {
  address: string;
  coords: Coordinates;
  setAddress: (address: string) => void;
  setCoords: (coords: Coordinates) => void;
};

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string>('Fetching address...');
  const [coords, setCoords] = useState<Coordinates>({
    latitude: -33.8688,
    longitude: 151.2093,
  });

  // Reverse geocode when coords change
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const geo = await Location.reverseGeocodeAsync(coords);
        if (geo.length > 0) {
          const { street, city, region, postalCode, country } = geo[0];
          const formatted = `${street || ''}, ${city || ''}, ${region || ''} ${postalCode || ''}, ${country || ''}`.trim();
          setAddress(formatted);
        } else {
          setAddress('Unknown location');
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        setAddress('Failed to fetch address');
      }
    };

    fetchAddress();
  }, [coords]);

  return (
    <AddressContext.Provider value={{ address, coords, setAddress, setCoords }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
