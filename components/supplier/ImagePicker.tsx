import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function ImagePickerSection({ imageUrl, isDarkMode, takePhoto, pickImage, styles }: any) {
    return (
        <View>
            <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: isDarkMode ? '#00B1BA' : '#999' }]}
                onPress={takePhoto}
            >
                <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>
                    {imageUrl ? "Retake Image" : "Take Product Photo"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: isDarkMode ? '#00B1BA' : '#999' }]}
                onPress={pickImage}
            >
                <Text style={{ color: isDarkMode ? 'white' : 'black', fontWeight: 'bold' }}>
                    Choose from Gallery
                </Text>
            </TouchableOpacity>
            {imageUrl && (
                <Image
                    source={{ uri: imageUrl }}
                    style={{
                        height: 200,
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: isDarkMode ? '#ffffff' : '#000'
                    }}
                    resizeMode='contain'
                />
            )}
        </View>
    );
}