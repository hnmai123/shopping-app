// Account.tsx (Fixed version)
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import { useTheme } from '../../../context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapComponent from '@/components/Map';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db, auth } from '@/firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import { useAddress } from '@/context/AddressContext';
import * as Location from 'expo-location';

// Types for navigation route
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
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
      marginTop: 4,
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
          <View style={[styles.header, dynamicStyles.header]}>
            <TouchableOpacity style={{ marginLeft: "7%" }} onPress={() => navigation.navigate('supplier' as never)}>
              <MaterialCommunityIcons name="store-edit-outline" size={30} color={dynamicStyles.text.color} />
            </TouchableOpacity>
            <Text style={[{ fontSize: 40, fontWeight: 'bold' }, dynamicStyles.text]}>Account</Text>
            <TouchableOpacity style={{ marginRight: "7%" }} onPress={toggleTheme}>
              <MaterialIcons
                name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
                size={24}
                color={isDarkMode ? '#FFD700' : 'black'}
              />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: isDarkMode ? '#121212' : '#e9f5f9', flex: 1, alignItems: 'center' }}>
            <View style={dynamicStyles.card}>
              <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  source={require('@/assets/images/Acount.png')}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <Text style={dynamicStyles.text}>{user?.nickname || "Nickname"}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 20 }}>
                <Text style={dynamicStyles.text}>{user?.name || "Name"}</Text>
                <Text style={dynamicStyles.text}>Your Point</Text>
                <Text style={dynamicStyles.text}>{user?.email || "Email"}</Text>
              </View>
            </View>

            {/* Address Section */}
            <View style={dynamicStyles.addressCard}>
              <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Billing & Shipping Address</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <TouchableOpacity style={{ width: '50%', marginRight: 10 }} onPress={() => navigation.navigate('map' as never)}>
                  <MapComponent initialLocation={coords} selectable={false} height={150} />
                </TouchableOpacity>
                <View style={{ flex: 1, margin: 5, gap: 10 }}>
                  <Text style={dynamicStyles.text}>{address || "Address"}</Text>
                  <TouchableOpacity onPress={handleCurrentLocation}>
                    <Text style={dynamicStyles.text}>Using your location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('map' as never)}>
                    <Text style={dynamicStyles.text}>Change {">"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={dynamicStyles.paymentCard}>
              <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Payment Information</Text>
              </View>

              <View style={dynamicStyles.paymentRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <Text style={dynamicStyles.text}>Credit cards</Text>
                  <Fontisto name="visa" size={24} color={dynamicStyles.text.color} />
                  <Fontisto name="mastercard" size={24} color={dynamicStyles.text.color} />
                  <Fontisto name="american-express" size={24} color={dynamicStyles.text.color} />
                </View>
                <TouchableOpacity>
                  <Text style={dynamicStyles.text}>**** 1234</Text>
                </TouchableOpacity>
              </View>

              <View style={dynamicStyles.divider} />

              <View style={dynamicStyles.paymentRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <Text style={dynamicStyles.text}>E-wallet</Text>
                  <Fontisto name="apple-pay" size={24} color={dynamicStyles.text.color} />
                  <FontAwesome6 name="google-pay" size={24} color={dynamicStyles.text.color} />
                  <Fontisto name="paypal" size={24} color={dynamicStyles.text.color} />
                </View>
                <TouchableOpacity>
                  <Text style={dynamicStyles.text}>Enter {">"}</Text>
                </TouchableOpacity>
              </View>

              <View style={dynamicStyles.divider} />

              <View style={dynamicStyles.paymentRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <Ionicons name="wallet-outline" size={24} color={dynamicStyles.text.color} />
                  <Text style={dynamicStyles.text}>Your balance: </Text>
                </View>
                <Text style={dynamicStyles.text}>$100</Text>
              </View>
            </View>

            {/* Support Section */}
            <View style={dynamicStyles.supportCard}>
              <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Support</Text>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <MaterialIcons name="report-gmailerrorred" size={24} color={dynamicStyles.text.color} style={{ marginRight: 10 }} />
                <Text style={dynamicStyles.text}>Contact us</Text>
              </TouchableOpacity>
              <View style={dynamicStyles.divider} />
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <Ionicons name="settings-outline" size={24} color={dynamicStyles.text.color} style={{ marginRight: 10 }} />
                <Text style={dynamicStyles.text}>Setting</Text>
              </TouchableOpacity>
              <View style={dynamicStyles.divider} />
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={dynamicStyles.text.color} style={{ marginRight: 10 }} />
                <Text style={dynamicStyles.text}>Log out</Text>
              </TouchableOpacity>
            </View>
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
