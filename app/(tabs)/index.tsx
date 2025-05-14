import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import filter from 'lodash.filter';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { auth, db } from '../../firebase/firebaseConfig';

export default function HomeScreen() {
  const { cart, updateCart } = useCart();
  const { theme, toggleTheme, isDarkMode } = useTheme();

  interface Product {
    id: string;
    category: string;
    description: string;
    image: string;
    name: string;
    price: number;
    seller: string;
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fullData, setFullData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const colref = collection(db, 'products');

    const unsubscribe = onSnapshot(colref, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          category: docData.category,
          description: docData.description,
          image: docData.image,
          name: docData.name,
          price: docData.price,
          seller: docData.seller,
        };
      });
      setData(fetchedData);
      setFullData(fetchedData);
      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000); // Clear error after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  const uploadImageForLabeling = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: false
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const fileName = `uploads/${Date.now()}.jpg`;
      const storageRef = ref(getStorage(), fileName);
      try {
        await uploadBytes(storageRef, blob);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay for the upload

        const labelSnap = await getDocs(collection(db, 'imageLabels'));

        if (labelSnap.empty) {
          throw new Error('No labels found');
        }

        const latestDoc = labelSnap.docs
          .filter(doc => doc.data().createdAt) // in case some docs are incomplete
          .sort((a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds)[0];

        if (!latestDoc) {
          throw new Error('No valid label documents found');
        }
        // delete firestore document after fetching labels
        const labels = latestDoc.data().labels || [];
        await deleteDoc(doc(db, 'imageLabels', latestDoc.id));
        return labels;

      } finally {
        await deleteObject(storageRef);
      }
    }
    return [];
  };

  const handleCameraSearch = async () => {
    try {
      setIsLoading(true)
      const labels = await uploadImageForLabeling();
      if (!labels.length) {
        setError('No labels detected from image');
        return;
      }
      const labelText = labels.join(' ').toLowerCase();
      const matchedData = filter(fullData, (item: any) => matchesLabels(item, labelText));
      if (matchedData.length === 0) {
        setError('No matching products found');
        return;
      }
      setData(matchedData);
    } catch (error) {
      console.error('Error searching by image:', error);
      setError('Failed to search by image');
    } finally {
      setIsLoading(false);

    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const formatterdquery = query.toLowerCase();
    const filteredData = filter(fullData, (item: { name: string; description: string; }) => {
      return contains(item, formatterdquery);
    })
    setData(filteredData);
  }

  const matchesLabels = ({ name, description }: { name: string; description: string }, labelText: string) => {
    const itemText = `${name} ${description}`.toLowerCase();
    return labelText.split(' ').some(label => itemText.includes(label));
  };

  const contains = ({ name, description }: { name: string; description: string }, query: string) => {
    if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  }

  const addtoCart = async (product: any) => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to add items to your cart.");
      return;
    }

    const cartRef = doc(db, 'carts', user.uid);
    const cartDoc = await getDoc(cartRef);

    let updatedItems = [];
    if (!cartDoc.exists()) {
      updatedItems = [{ ...product, quantity: 1 }];
      await setDoc(cartRef, {
        items: updatedItems,
        updatedAt: serverTimestamp(),
      });
    } else {
      const cartData = cartDoc.data();
      const existingItems = cartData.items.find((item: any) => item.id === product.id);
      if (existingItems) {
        updatedItems = cartData.items.map((item: any) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...cartData.items, { ...product, quantity: 1 }];
      }

      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: serverTimestamp(),
      });
    }

    updateCart((previousCart: any[]) => {
      const existingProduct = previousCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...previousCart, { ...product, quantity: 1 }];
      }
    });
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
    }
  });

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.loadingContainer, dynamicStyles.loadingBackground]}>
          <ActivityIndicator size="large" color={isDarkMode ? '#FFFFFF' : '#0000ff'} />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.loadingContainer, dynamicStyles.loadingBackground]}>
          <Text style={dynamicStyles.text}>{error}</Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <SearchBar
            searchQuery={searchQuery}
            onChangeText={handleSearch}
            onCameraPress={handleCameraSearch}
            dynamicStyles={dynamicStyles}
            isDarkMode={isDarkMode}
          />
          <TouchableOpacity style={styles.darkModeButton} onPress={toggleTheme}>
            <MaterialIcons
              name={isDarkMode ? 'wb-sunny' : 'dark-mode'}
              size={24}
              color={isDarkMode ? '#FFD700' : 'black'}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => addtoCart(item)}
              dynamicStyles={dynamicStyles}
              formatter={formatter}
            />
          )}
          numColumns={2}
          contentContainerStyle={[styles.productList, dynamicStyles.productList]}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const screenWidth = Dimensions.get('window').width;
const cardMargin = 5;
const cardWidth = (screenWidth / 2) - (cardMargin * 3);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 46,
    marginVertical: 10,
    width: '80%',
    marginLeft: 10
  },
  productCard: {
    width: cardWidth,
    margin: cardMargin,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center'
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  productList: {
    padding: cardMargin,
  },
  textContainer: {
    width: '100%',
    padding: 5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});