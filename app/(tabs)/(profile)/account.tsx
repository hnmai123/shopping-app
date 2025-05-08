import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, Image, Touchable, ScrollView } from "react-native";
import { useTheme } from '../../../context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { auth } from "@/firebase/firebaseConfig";
import { useState, useEffect } from "react";
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapLocation from '@/components/MapLocation';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Account() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigation = useNavigation();

  const handleAddressRetrieved = (addr: string | null, location: { latitude: number; longitude: number } | null) => {
    setAddress(addr || '');
    setCoords(location || null);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {

    }
  }, []);
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase sign-out
      navigation.navigate("(auth)" as never); // Navigate to the Login screen after logout
    } catch (error) {
      console.error("Error logging out:", error);
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
    }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>

          <View style={[styles.header, dynamicStyles.header]}>
            <TouchableOpacity style={{ marginLeft: "7%" }} onPress={() => navigation.navigate('supplier' as never)}>
            <MaterialCommunityIcons name="store-edit-outline" size={30} color={dynamicStyles.text.color} />
            </TouchableOpacity>
            <Text style={[{ fontSize: 40, fontWeight: 'bold' }, , dynamicStyles.text]}>Account</Text>
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
                  style={{ width: 50, height: 50, borderRadius: 50 }} />
                <Text style={dynamicStyles.text}>Nickname</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 20 }}>
                <Text style={dynamicStyles.text}>Username</Text>
                <Text style={dynamicStyles.text}>Your Point</Text>
                <Text style={dynamicStyles.text}>Email</Text>
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

            <View style={dynamicStyles.addressCard}>
              <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Billing & Shipping Address</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: '50%', marginRight: 10 }}>
                  <MapLocation height={150} borderRadius={10} onAddressRetrieved={handleAddressRetrieved} />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Text style={[dynamicStyles.text]}>{address || "Address"}</Text>
                  <TouchableOpacity>
                    <Text style={[dynamicStyles.text]}>Using your location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={[dynamicStyles.text]}>Change {">"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={dynamicStyles.supportCard}>
              <View style={{ backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF', padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 16 }]}>Support</Text>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: 10 }}>
                <MaterialIcons name="report-gmailerrorred" size={24} color={dynamicStyles.text.color} />
                <Text style={[dynamicStyles.text]}>Contact us</Text>
              </TouchableOpacity>
              <View style={dynamicStyles.divider} />
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: 10 }}>
                <Ionicons name="settings-outline" size={24} color={dynamicStyles.text.color} />
                <Text style={[dynamicStyles.text]}>Setting</Text>
              </TouchableOpacity>
              <View style={dynamicStyles.divider} />
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: 10 }}
                onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={dynamicStyles.text.color} />
                <Text style={[dynamicStyles.text]}>Log out</Text>
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