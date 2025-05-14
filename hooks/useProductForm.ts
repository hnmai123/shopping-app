import { auth, db, storage } from '@/firebase/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useProductForm() {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const pickImage = async (setImageUrl: (url: string) => void) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.3,
        });
        if (!result.canceled) {
            setImageUrl(result.assets[0].uri);
        }
    };

    const takePhoto = async (setImageUrl: (url: string) => void) => {
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

    const uploadImage = async (uri: string): Promise<string> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const imageRef = ref(storage, `productImages/${Date.now()}.jpg`);
        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(imageRef, blob);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleAddProduct = async ({
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
    }: any) => {
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
                imageUri = await uploadImage(imageUrl);
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

    return {
        pickImage,
        takePhoto,
        uploadProgress,
        uploading,
        handleAddProduct,
    };
}