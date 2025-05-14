import OrderCard from '@/components/OrderCard';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { auth, db } from '@/firebase/firebaseConfig';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import { styles } from '../../styles/OrdersScreenStyles';

export default function OrdersScreen() {
  const [isRating, setIsRating] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const currentOrder = orders[currentOrderIndex];

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

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title={"Orders"}
          onToggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          dynamicStyles={dynamicStyles}
          backIconName="message"
          onBack={() => { }}
          count={orders.length}
        />

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
              <OrderCard
                order={currentOrder}
                orderIndex={currentOrderIndex}
                totalOrders={orders.length}
                isDarkMode={isDarkMode}
                dynamicStyles={dynamicStyles}
                formatter={formatter}
                onPrev={() => setCurrentOrderIndex((prev) => Math.max(prev - 1, 0))}
                onNext={() => setCurrentOrderIndex((prev) => Math.min(prev + 1, orders.length - 1))}
                onRate={handleRating}
                onFeedback={async (feedback: string) => {
                  await updateDoc(doc(db, 'orders', currentOrder.id), { feedback });
                }}
                isRating={isRating}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}