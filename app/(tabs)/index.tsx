import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import filter from "lodash.filter";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useProducts } from "../../hooks/useProducts";
import { styles } from "../../styles/HomeScreenStyles";
import { addToCart } from "../../utils/cartUtils";
import { uploadImageForLabeling } from "../../utils/imageLabeling";
import { contains, matchesLabels } from "../../utils/productUtils";

export default function HomeScreen() {
  const { cart, updateCart } = useCart();
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AUD",
  });

  const { data, isLoading, error, setData } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [fullData, setFullData] = useState<typeof data>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<typeof data>([]);

  useEffect(() => {
    setFullData(data);
    setFilteredData(data);
  }, [data]);

  const handleCameraSearch = async () => {
    try {
      setLocalLoading(true);
      const labels = await uploadImageForLabeling();
      if (!labels.length) {
        setLocalError("No labels detected from image");
        return;
      }
      const labelText = labels.join(" ").toLowerCase();
      const matchedData = filter(fullData, (item: any) =>
        matchesLabels(item, labelText)
      );
      if (matchedData.length === 0) {
        setLocalError("No matching products found");
        return;
      }
      setData(matchedData);
    } catch (error) {
      console.error("Error searching by image:", error);
      setLocalError("Failed to search by image");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase().trim();
    if (!formattedQuery) {
      setFilteredData([...fullData]); // Show all products if search is cleared
      return;
    }
    const filteredData = filter(
      fullData,
      (item: { name: string; description: string }) => {
        return contains(item, formattedQuery);
      }
    );
    setFilteredData(filteredData);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, setLocalError, updateCart);
  };

  // Clear local error after 2 seconds
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? "#121212" : "#61EDFF",
    },
    header: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#61EDFF",
    },
    text: {
      color: isDarkMode ? "#FFFFFF" : "black",
    },
    searchContainer: {
      backgroundColor: isDarkMode ? "#383838" : "#FFFFFF",
    },
    searchText: {
      color: isDarkMode ? "#FFFFFF" : "black",
    },
    productCard: {
      backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    },
    productList: {
      backgroundColor: isDarkMode ? "#121212" : "#e9f5f9",
    },
    textContainer: {
      backgroundColor: isDarkMode ? "#383838" : "#61EDFF",
    },
    loadingBackground: {
      backgroundColor: isDarkMode ? "#121212" : "#61EDFF",
    },
  });

  if (isLoading || localLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={[styles.loadingContainer, dynamicStyles.loadingBackground]}
        >
          <ActivityIndicator
            size="large"
            color={isDarkMode ? "#FFFFFF" : "#0000ff"}
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (error || localError) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={[styles.loadingContainer, dynamicStyles.loadingBackground]}
        >
          <Text style={dynamicStyles.text}>{error || localError}</Text>
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
              name={isDarkMode ? "wb-sunny" : "dark-mode"}
              size={30}
              color={isDarkMode ? "#FFD700" : "black"}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => handleAddToCart(item)}
              dynamicStyles={dynamicStyles}
              formatter={formatter}
            />
          )}
          numColumns={2}
          contentContainerStyle={[
            styles.productList,
            dynamicStyles.productList,
          ]}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
