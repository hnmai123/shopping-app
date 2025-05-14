import Header from '@/components/Header';
import ProductForm from '@/components/supplier/ProductForm';
import { useTheme } from '@/context/ThemeContext';
import { useProductForm } from '@/hooks/useProductForm';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default function AddProduct() {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigation = useNavigation();

    // Use your custom hook
    const {
        pickImage,
        takePhoto,
        uploadProgress,
        uploading,
        handleAddProduct,
    } = useProductForm();

    const dynamicStyles = {
        header: { backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF' },
        text: { color: isDarkMode ? 'white' : 'black' }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
                <Header
                    title="Add Product"
                    onBack={() => navigation.goBack()}
                    onToggleTheme={toggleTheme}
                    isDarkMode={isDarkMode}
                    dynamicStyles={dynamicStyles}
                />

                {uploading && (
                    <View style={{ marginVertical: 5, width: '90%', alignSelf: 'center', backgroundColor: isDarkMode ? '#2c2c2c' : '#eee', borderRadius: 4 }}>
                        <View
                            style={{
                                width: `${uploadProgress}%`,
                                height: 10,
                                backgroundColor: isDarkMode ? '#61EDFF' : '#00B1BA',
                                borderRadius: 4,
                            }}
                        />
                    </View>
                )}

                <ProductForm
                    productName={productName}
                    setProductName={setProductName}
                    price={price}
                    setPrice={setPrice}
                    category={category}
                    setCategory={setCategory}
                    description={description}
                    setDescription={setDescription}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    isDarkMode={isDarkMode}
                    takePhoto={() => takePhoto(setImageUrl)}
                    pickImage={() => pickImage(setImageUrl)}
                    handleAddProduct={() =>
                        handleAddProduct({
                            productName,
                            price,
                            category,
                            description,
                            imageUrl,
                            setProductName,
                            setPrice,
                            setDescription,
                            setCategory,
                            setImageUrl,
                        })
                    }
                    styles={styles}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    confirmButton: {
        backgroundColor: '#00B1BA',
        padding: 12,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
});