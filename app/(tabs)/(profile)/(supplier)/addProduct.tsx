import { useTheme } from '@/context/ThemeContext';
import { auth, db, storage } from '@/firebase/firebaseConfig';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function AddProduct() {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { isDarkMode, toggleTheme } = useTheme();
    const navigation = useNavigation();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);


    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.3,
        })
        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission to access camera is required!");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.3,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };
    const uploadImage = async (uri: string,
        onProgress: (progress: number) =>
            void): Promise<string> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `productImages/${Date.now()}.jpg`);
        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(imageRef, blob);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            )
        })
    };

    const handleAddProduct = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            Alert.alert("Error", "You must be logged in.");
            return;
        }

        if (!productName || !price || !category || !description) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            let imageUri = '';
            if (imageUrl) {
                imageUri = await uploadImage(imageUrl, setUploadProgress);
            }
            const productsRef = collection(db, 'products');
            await addDoc(productsRef, {
                name: productName,
                price: parseFloat(price),
                category,
                description,
                seller: currentUser.uid,
                image: imageUri,
                createdAt: serverTimestamp(),
            });
            Alert.alert("Success", "Product added.");
            setProductName('');
            setPrice('');
            setDescription('');
            setCategory('');
            setImageUrl(null);
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to add product.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>

                <View style={[styles.header, { backgroundColor: isDarkMode ? '#1E1E1E' : '#61EDFF' }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color={isDarkMode ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text style={[styles.headerText, { color: isDarkMode ? 'white' : 'black' }]}>Upload your product</Text>
                    <TouchableOpacity onPress={toggleTheme}>
                        <MaterialIcons name={isDarkMode ? 'wb-sunny' : 'dark-mode'} size={24} color={isDarkMode ? '#FFD700' : 'black'} />
                    </TouchableOpacity>
                </View>

                {uploading && (
                    <View style={{ marginTop: 10, width: '90%', alignSelf: 'center', backgroundColor: isDarkMode ? '#2c2c2c' : '#eee', borderRadius: 4 }}>
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
                    <View>
                        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: isDarkMode ? '#00B1BA' : '#999' }]} onPress={takePhoto}>
                            <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>{imageUrl ? "Retake Image" : "Take Product Photo"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.confirmButton, { backgroundColor: isDarkMode ? '#00B1BA' : '#999' }]} onPress={pickImage}>
                            <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>Choose from Gallery</Text>
                        </TouchableOpacity>
                        {imageUrl && (
                            <Image source={{ uri: imageUrl }} style={{ height: 200, width: '100%', marginTop: 10, borderRadius: 8 }} />
                        )}
                    </View>


                    <TouchableOpacity onPress={handleAddProduct} style={styles.confirmButton}>
                        <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>Add Product</Text>
                    </TouchableOpacity>
                </View>
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
