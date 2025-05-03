import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { db } from '@/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useTheme } from '../../../context/ThemeContext';

// currently have hardcoded order numbers and details with products and everything.

interface OrderItem {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  deliveryDate?: string;
  quantity: number;
}

interface Order {
  id: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
}

const OrderStatusBar = () => {
  const { isDarkMode } = useTheme();
  return (
    <View style={[styles.orderStatusBar, isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: '#F0F0F0' }]}>
      <View style={styles.statusBarItem}>
        <Ionicons name="clipboard-outline" size={24} color="#007AFF" />
        <Text style={[styles.statusBarText, isDarkMode ? { color: '#FFFFFF' } : { color: '#333' }]}>Confirming</Text>
      </View>
      <View style={styles.statusBarItem}>
        <Ionicons name="package-outline" size={24} color="#FF9500" />
        <Text style={[styles.statusBarText, isDarkMode ? { color: '#FFFFFF' } : { color: '#333' }]}>Preparing</Text>
      </View>
      <View style={styles.statusBarItem}>
        <Ionicons name="bicycle-outline" size={24} color="#4CD964" />
        <Text style={[styles.statusBarText, isDarkMode ? { color: '#FFFFFF' } : { color: '#333' }]}>Delivering</Text>
      </View>
    </View>
  );
};

const PreviousOrder = () => {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [simulatedOrder, setSimulatedOrder] = useState<Order | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(['product1', 'product2']); // HARDCODED PRODUCT ID'S

  const dynamicStyles = StyleSheet.create({
    text: {
      color: Colors[colorScheme ?? 'light'].text,
    },
    secondaryText: {
      color: Colors[colorScheme ?? 'light'].secondary,
    },
    card: {
      backgroundColor: Colors[colorScheme ?? 'light'].card,
    },
  });

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD',
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const colref = collection(db, 'products');
        const snapshot = await getDocs(colref);
        const fetchedProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setIsLoading(false);
        setError('Failed to fetch product data to simulate order.');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && selectedProductIds.length > 0) {
      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      selectedProductIds.forEach(id => {
        const selectedProduct = products.find(p => p.id === id);
        if (selectedProduct) {
          const orderItem: OrderItem = {
            name: selectedProduct.name,
            image: selectedProduct.image,
            price: selectedProduct.price,
            originalPrice: selectedProduct.originalPrice,
            deliveryDate: 'Mon 31/03/2025', // delivery date shown on product
            quantity: 1,
          };
          orderItems.push(orderItem);
          totalAmount += selectedProduct.price;
        } else {
          setError(`Product with ID "${id}" not found.`); // cant find product
        }
      });

      const order: Order = {
        id: 'Order 001',
        orderId: '001',
        orderDate: new Date().toLocaleDateString(),
        items: orderItems,
        totalAmount: totalAmount,
      };
      setSimulatedOrder(order);
    }
  }, [products, selectedProductIds]);

  return (
    <View style={[styles.previousOrderContainer, isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: 'white' }]}>
      <Text style={[dynamicStyles.text, { marginBottom: 10, color: isDarkMode? '#FFFFFF': '#000000' }, { fontSize: 20 }]}>Order 001:</Text>
      {isLoading && <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].text} style={{ marginTop: 15 }} />}
      {error && <Text style={[dynamicStyles.text, { color: 'red', marginTop: 15 }]}>{error}</Text>}

      {simulatedOrder && (
        <View style={{ marginTop: 20 }}>
          {simulatedOrder.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.orderItemImage} />
              <View style={styles.orderItemDetails}>
                <Text style={[dynamicStyles.text, styles.orderItemName, isDarkMode ? { color: '#FFFFFF' } : { color: '#000000' }]}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={[dynamicStyles.text, styles.currentPrice, isDarkMode ? { color: '#FFFFFF' } : { color: '#000000' }]}>{formatter.format(item.price)}</Text>
                  {item.originalPrice && (
                    <Text style={[dynamicStyles.secondaryText, styles.originalPrice]}>
                      {formatter.format(item.originalPrice)}
                    </Text>
                  )}
                </View>
                {item.deliveryDate && (
                  <Text style={[dynamicStyles.secondaryText, styles.deliveryInfo]}>Delivers {item.deliveryDate}</Text>
                )}
                <Text style={[dynamicStyles.secondaryText, styles.gstInfo]}>
                  Include GST of {formatter.format(item.price / 11)}
                </Text>
                <Text style={[dynamicStyles.secondaryText, { fontSize: 12,  color: isDarkMode? '#FFFFFF': '#777' }]}>
                  Quantity: {item.quantity}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ marginTop: 10 }}>
            <Text style={[dynamicStyles.text, { fontWeight: 'bold',  color: isDarkMode? '#FFFFFF': '#000000' }]}>
              Total Amount: {formatter.format(simulatedOrder.totalAmount)}
            </Text>
          </View>
        </View>
      )}
      {!isLoading && !error && !simulatedOrder && products.length > 0 && (
        <Text style={[dynamicStyles.text, { marginTop: 15 }]}>Loading: {selectedProductIds.join(', ')}</Text>
      )}
      {!isLoading && !error && products.length === 0 && (
        <Text style={[dynamicStyles.text, { marginTop: 15 }]}>No products.</Text>
      )}
    </View>
  );
};

const FeedbackSection = () => {
  const colorScheme = useColorScheme();
  const { isDarkMode } = useTheme();
  const dynamicStyles = StyleSheet.create({
    text: {
      color: Colors[colorScheme ?? 'light'].text,
    },
    feedbackBar: {
      backgroundColor: Colors[colorScheme ?? 'light'].card,
    },
  });

  return (
    <View style={[styles.feedbackContainer, isDarkMode ? { backgroundColor: '#1E1E1E' } : { backgroundColor: 'white' }]}>
      <Text style={[styles.feedbackTitle, dynamicStyles.text, isDarkMode ? { color: '#FFFFFF' } : { color: '#000000' }]}>Feedback</Text>
      <View style={styles.feedbackBar}>
        <TouchableOpacity style={styles.feedbackOption}>
          <Ionicons name="thumbs-down-outline" size={24} color="#FF3B30" />
          <Text style={[styles.feedbackLabel, dynamicStyles.text, isDarkMode ? { color: '#FFFFFF' } : { color: '#555' }]}>Unhappy</Text>
        </TouchableOpacity>
        <View style={styles.ratingStars}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons key={index} name="star-outline" size={24} color="#FFD700" />
          ))}
        </View>
        <TouchableOpacity style={styles.feedbackOption}>
          <Ionicons name="happy-outline" size={24} color="#4CD964" />
          <Text style={[styles.feedbackLabel, dynamicStyles.text, isDarkMode ? { color: '#FFFFFF' } : { color: '#555' }]}>Extremely Happy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#121212' : '#e9f5f9',
    },
    header: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF',
    },
    text: {
      color: isDarkMode ? '#FFFFFF' : 'black',
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerText, dynamicStyles.text]}>
            Orders<Text style={{ fontSize: 12 }}> ({ 1 })</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.darkModeButton} onPress={toggleTheme}>
          <MaterialIcons
            name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
            size={24}
            color={isDarkMode ? '#FFD700' : 'black'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <OrderStatusBar />
        <PreviousOrder />
        <FeedbackSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#e9f5f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#61EDFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  darkModeButton: {
    position: 'absolute',
    right: '7%',
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  orderStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    marginBottom: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  statusBarItem: {
    alignItems: 'center',
  },
  statusBarText: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  previousOrderContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  orderItemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
    backgroundColor: '#f9f9f9',
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  currentPrice: {
    fontSize: 16,
    marginRight: 8,
    color: '#000',
  },
  originalPrice: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  deliveryInfo: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 3,
  },
  gstInfo: {
    fontSize: 12,
    color: '#777',
  },
  feedbackContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    marginTop: 10
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feedbackOption: {
    alignItems: 'center',
  },
  feedbackLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
  },
  ratingStars: {
    flexDirection: 'row',
  },
});

