import { StyleSheet, View, Text, SafeAreaView, TextInput, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import filter from 'lodash.filter';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  interface Product {
    id: string;
    category: string;
    description: string;
    image: string;
    name: string;
    price: number;
    seller: string;
  };

  type RootStackParamList = {
    cart: { cart: Product[]; cartCount: number };
  };

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fullData, setFullData] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const colref = collection(db, 'products');
        const snapshot = await getDocs(colref);
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
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoading(false);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const formatterdquery = query.toLowerCase();
    const filteredData = filter(fullData, (item) => {
      return contains(item, formatterdquery);
    })
    setData(filteredData);
  }
  const contains = ({ name, description }: { name: string; description: string }, query: string) => {
    if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  }

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#61EDFF' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#61EDFF' }}>
          <Text>{error}</Text>
        </View>
      </GestureHandlerRootView>
    );
  }
 
  const addtoCart = (product: Product) => {
    setCart((previousCart: Product[]) => {
      const existingProduct = previousCart.find((item) => item.id === product.id);
      const updatedCart = existingProduct ? previousCart : [...previousCart, product];
      setCart(updatedCart);
      setCartCount(updatedCart.length);
      navigation.navigate('cart', { cart: updatedCart, cartCount: updatedCart.length });
      return updatedCart;
    });
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="black" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search ..."
            clearButtonMode="always"
            style={styles.searchBox}
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />
          <TouchableOpacity>
            <Ionicons name="camera-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard} onPress={() => addtoCart(item)}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.textContainer}>
                <Text style={{ fontSize: 12, paddingBottom: 15 }}>{item.name}</Text>
                <Text style={{ fontSize: 10 }}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          contentContainerStyle={styles.productList}
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
    backgroundColor: '#61EDFF',
    paddingTop: 20,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 46,
    marginBottom: 20,
    width: '80%',
    marginLeft: 10
  },
  productCard: {
    width: cardWidth,
    margin: cardMargin,
    backgroundColor: '#fff',
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
    backgroundColor: '#e9f5f9',
  },
  textContainer: {
    backgroundColor: '#61EDFF',
    width: '100%',
    padding: 5
  }
});

