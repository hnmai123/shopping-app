// orders.tsx (Fixed background color below orders area)
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { auth, db } from '@/firebase/firebaseConfig';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function OrdersScreen() {
  const [isRating, setIsRating] = useState(false);

  const handleRating = async (star: number) => {
    if (isRating || !orders[currentOrderIndex]?.id) return;
    setIsRating(true);
    try {
      await updateDoc(doc(db, 'orders', orders[currentOrderIndex].id), { rating: star });

    } catch (error) {
      console.error('Rating update failed:', error);
    }
    setIsRating(false);
  };

  const colorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useTheme();
  interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  interface Order {
    id: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt?: { seconds: number };
    rating?: number;
    feedback?: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    header: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
    },
    text: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
  });

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD',
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User not authenticated');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
        const sorted = fetched.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
        setOrders(sorted);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const currentOrder = orders[currentOrderIndex];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity style={{ marginLeft: "7%" }}>
            <MaterialIcons name="message" size={24} color={isDarkMode ? '#FFD700' : 'black'} />
          </TouchableOpacity>
          <Text style={[styles.headerText, dynamicStyles.text]}>
            Orders
            <Text style={{ fontSize: 12 }}> ({orders.length})</Text>
          </Text>
          <TouchableOpacity style={styles.headerSide} onPress={toggleTheme}>
            <MaterialIcons
              name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
              size={24}
              color={isDarkMode ? '#FFD700' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.statusBar, isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.statusItem}>
              <Ionicons name="clipboard-outline" size={30} color="#007AFF" />
              <Text style={[styles.statusText, dynamicStyles.text]}>Confirming</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="gift-outline" size={30} color="#FF9500" />
              <Text style={[styles.statusText, dynamicStyles.text]}>Preparing</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="bicycle-outline" size={30} color="#4CD964" />
              <Text style={[styles.statusText, dynamicStyles.text]}>Delivering</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].text} />
          ) : orders.length === 0 ? (
            <Text
              style={[
                dynamicStyles.text,
                { textAlign: 'center', marginTop: 30, fontSize: 16, paddingHorizontal: 20 },
              ]}>
              You have not placed any orders yet. Head over to the home page and start shopping!
            </Text>
          ) : (
            <View style={{ paddingHorizontal: 15 }}>
              <View style={[isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: 'white' }, { paddingBottom: 10, borderRadius: 10 }]}>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: '#61EDFF' },
                  ]}>
                  <TouchableOpacity
                    disabled={currentOrderIndex === 0}
                    onPress={() => setCurrentOrderIndex((prev) => Math.max(prev - 1, 0))}>
                    <Ionicons
                      name="chevron-back"
                      size={32}
                      color={currentOrderIndex === 0 ? '#aaa' : '#007AFF'}
                    />
                  </TouchableOpacity>

                  <Text style={[dynamicStyles.text, { fontWeight: 'bold', fontSize: 18 }]}>Order #{String(currentOrderIndex + 1).padStart(3, '0')}</Text>

                  <TouchableOpacity
                    disabled={currentOrderIndex === orders.length - 1}
                    onPress={() => setCurrentOrderIndex((prev) => Math.min(prev + 1, orders.length - 1))}>
                    <Ionicons
                      name="chevron-forward"
                      size={32}
                      color={currentOrderIndex === orders.length - 1 ? '#aaa' : '#007AFF'}
                    />
                  </TouchableOpacity>

                </View>
                <View style={{
                  height: 1,
                  backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
                }} />
                {currentOrder.items.map((item, i) => (
                  <React.Fragment key={item.name + i}>
                    <View
                      style={[
                        styles.itemCard,
                        isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: 'white' },
                      ]}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      <View style={styles.itemDetails}>
                        <Text style={[styles.itemName, dynamicStyles.text]}>{item.name}</Text>
                        <Text style={dynamicStyles.text}>{formatter.format(item.price)}</Text>
                        <Text style={dynamicStyles.text}>Quantity: {item.quantity}</Text>
                        <Text style={dynamicStyles.text}>GST: {formatter.format(item.price / 11)}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: isDarkMode ? '#383838' : '#61EDFF',
                      }}
                    />
                  </React.Fragment>
                ))}

                <Text style={[dynamicStyles.text, { paddingLeft: 15, marginTop: 10, fontWeight: 'bold' }]}>Total: {formatter.format(currentOrder.totalAmount)}</Text>
              </View>

              <View
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 8,
                  },
                  isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: '#FFFFFF' },
                ]}>
                <TouchableOpacity onPress={async () => await updateDoc(doc(db, 'orders', currentOrder.id), { feedback: 'unhappy' })}>
                  <Ionicons name="thumbs-down-outline" size={30} color="#FF3B30" />
                  <Text style={[dynamicStyles.text, { textAlign: 'center', fontSize: 12 }]}>Unhappy</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {[1, 2, 3, 4, 5].map((star) => (<TouchableOpacity key={star}
                    onPress={() => handleRating(star)}>
                    <Ionicons
                      name={star <= (currentOrder.rating || 0) ? 'star' : 'star-outline'} size={30}
                      color="#FFD700"
                    />
                  </TouchableOpacity>))}
                </View>

                <TouchableOpacity onPress={async () => await updateDoc(doc(db, 'orders', currentOrder.id), { feedback: 'happy' })}>
                  <Ionicons name="happy-outline" size={30} color="#4CD964" />
                  <Text style={[dynamicStyles.text, { textAlign: 'center', fontSize: 12 }]}>Happy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 22,
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  headerSide: {
    marginRight: '7%',
  },
  scrollContent: {
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    borderRadius: 8,
    margin: 15,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginTop: 5,
  },
  itemCard: {
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
    elevation: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
    backgroundColor: '#eee',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
