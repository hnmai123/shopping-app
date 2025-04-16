import { StyleSheet, View, Text, SafeAreaView, TextInput, Image, ActivityIndicator, Dimensions} from 'react-native';
import { useEffect, useState } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import filter from 'lodash.filter';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ id: string; category: string; description: string; image: string; name: string; price: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fullData, setFullData] = useState<{ id: string; category: string; description: string; image: string; name: string; price: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  const contains = ({name, description} : {name: string; description: string}, query: string) => {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Search ..."
          clearButtonMode="always"
          style={styles.searchBox}
          autoCapitalize="none"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={(query) => handleSearch(query)}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style = {styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.textContainer}>
                <Text style={{ fontSize: 12, paddingBottom: 15 }}>{item.name}</Text>
                <Text style={{fontSize: 10}}>${item.price}</Text>
              </View>
            </View>
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
    width: '80%',
    height: 46,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    marginLeft: '2%',
    marginBottom: 20,
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
    height: 150,
    resizeMode: 'cover',
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

