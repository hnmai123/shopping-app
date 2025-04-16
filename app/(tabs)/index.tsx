import { StyleSheet, View, Text, SafeAreaView, TextInput, Image, ActivityIndicator} from 'react-native';
import { useEffect, useState } from 'react';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';


export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ id: string; category: string; description: string; image: string; name: string; price: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
        setIsLoading(false);
        console.log(fetchedData);
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
    console.log(query);
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
              <View>
                <Text>{item.name}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#61EDFF',
    paddingTop: 20,
  },
  searchBox: {
    width: '90%',
    height: 46,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    marginLeft: '2%',
    marginBottom: 20,
  },
  productCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    marginVertical: "2%",
    marginHorizontal: "2%",
  },
  productImage: {
    width: 125,
    height: 125,
    borderRadius: 5,
    marginRight: 10,
  },
  productList: {

  }
});