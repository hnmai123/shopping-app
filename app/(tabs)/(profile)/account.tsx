// Account.tsx (Fixed version)
import Address from '@/components/account/Address';
import Payment from '@/components/account/Payment';
import UserInfoCard from '@/components/account/PersonInfo';
import Support from '@/components/account/Support';
import Header from '@/components/Header';
import { useAddress } from '@/context/AddressContext';
import { useCart } from '@/context/CartContext';
import { auth, db } from '@/firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from '../../../context/ThemeContext';

interface User {
  nickname?: string;
  name?: string;
  email?: string;
  points?: number;
  address?: string;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

export default function Account() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { updateCart } = useCart();
  const navigation = useNavigation();

  const [user, setUser] = useState<User | null>(null);
  const { address, coords, setAddress: setGlobalAddress, setCoords: setGlobalCoords } = useAddress();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userData = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userData);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
          if (userData.coords) {
            setGlobalCoords(userData.coords);
          }
          if (userData.address) {
            setGlobalAddress(userData.address)
          }
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      updateCart([]);
      setGlobalAddress(''); // Reset address
      setGlobalCoords({
        latitude: -33.8688,
        longitude: 151.2093,
      });
      await auth.signOut();
      navigation.navigate('(auth)' as never);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync(location.coords);
      let formattedAddress = 'Unknown location';
      if (geo.length > 0) {
        const { street, city, region, postalCode, country } = geo[0];
        formattedAddress = `${street || ''}, ${city || ''}, ${region || ''} ${postalCode || ''}, ${country || ''}`.trim();
      }
      setGlobalCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setGlobalAddress(formattedAddress);

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          address: formattedAddress,
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
      }

    } catch (error) {
      console.error("Error fetching current location:", error);
    }
  };
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
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '95%',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 10,
      padding: 16,
      marginVertical: 10,
    },
    paymentCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      width: '95%',
      borderRadius: 10,
      marginVertical: 5,
    },
    paymentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      justifyContent: 'space-between',
      marginHorizontal: 10,
      paddingVertical: 5,
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
    },
    addressCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      width: '95%',
      borderRadius: 10,
      marginVertical: 5,
    },
    supportCard: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      width: '95%',
      borderRadius: 10,
      marginVertical: 5,
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
          <Header
            title="Account"
            onBack={() => navigation.navigate('(supplier)' as never)}
            onToggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            dynamicStyles={dynamicStyles}
            backIconName='store'
          />

          <View style={{ backgroundColor: isDarkMode ? '#121212' : '#e9f5f9', flex: 1, alignItems: 'center' }}>
            {/* User Info Section */}
            <UserInfoCard user={user} dynamicStyles={dynamicStyles} />

            {/* Address Section */}
            <Address
              dynamicStyles={dynamicStyles}
              isDarkMode={isDarkMode}
              coords={coords}
              address={address}
              navigation={navigation}
              handleCurrentLocation={handleCurrentLocation}
            />

            <Payment dynamicStyles={dynamicStyles} />

            <Support dynamicStyles={dynamicStyles} handleLogout={handleLogout} />
          </View>
        </ScrollView>
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
