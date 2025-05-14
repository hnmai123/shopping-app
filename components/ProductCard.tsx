import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

interface ProductCardProps {
  item: any;
  onPress: () => void;
  dynamicStyles: any;
  formatter: any;
}

export default function ProductCard({ item, onPress, dynamicStyles, formatter }: ProductCardProps) {
  return (
    <TouchableOpacity style={[styles.productCard, dynamicStyles.productCard]} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={[styles.textContainer, dynamicStyles.textContainer]}>
        <Text style={[dynamicStyles.text, { fontSize: 12, paddingBottom: 15 }]}>{item.name}</Text>
        <Text style={[dynamicStyles.text, { fontSize: 10 }]}>{formatter.format(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: '48%',
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center'
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  textContainer: {
    width: '100%',
    padding: 5
  },
});