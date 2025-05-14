import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImagePickerSection from './ImagePicker';

export default function ProductForm({
    productName, setProductName,
    price, setPrice,
    category, setCategory,
    description, setDescription,
    imageUrl, isDarkMode,
    takePhoto, pickImage,
    handleAddProduct,
    styles
}: any) {
    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Product Name</Text>
            <TextInput
                value={productName}
                onChangeText={setProductName}
                style={[styles.input, { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Enter product name"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                autoCapitalize='none'
            />

            <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Price</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Enter price"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                autoCapitalize='none'
            />

            <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Category</Text>
            <TextInput
                value={category}
                onChangeText={setCategory}
                style={[styles.input, { backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Enter category"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                autoCapitalize='none'
            />

            <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 80, backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', color: isDarkMode ? '#fff' : '#000' }]}
                placeholder="Enter description"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                autoCapitalize='none'
                multiline
                textAlignVertical="top"
            />

            <ImagePickerSection
                imageUrl={imageUrl}
                isDarkMode={isDarkMode}
                takePhoto={takePhoto}
                pickImage={pickImage}
                styles={styles}
            />

            <TouchableOpacity onPress={handleAddProduct} style={styles.confirmButton}>
                <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>Add Product</Text>
            </TouchableOpacity>
        </View>
    );
}