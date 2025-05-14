import * as ImagePicker from 'expo-image-picker';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase/firebaseConfig';

export const uploadImageForLabeling = async (): Promise<string[]> => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (permissionResult.granted === false) {
    alert('Permission to access camera is required!');
    return [];
  }

  const result = await ImagePicker.launchCameraAsync({ base64: false });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    const fileName = `uploads/${Date.now()}.jpg`;
    const storageRef = ref(getStorage(), fileName);
    try {
      await uploadBytes(storageRef, blob);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay for the upload

      const labelSnap = await getDocs(collection(db, 'imageLabels'));
      if (labelSnap.empty) throw new Error('No labels found');

      const latestDoc = labelSnap.docs
        .filter(doc => doc.data().createdAt)
        .sort((a, b) => b.data().createdAt.seconds - a.data().createdAt.seconds)[0];

      if (!latestDoc) throw new Error('No valid label documents found');

      const labels = latestDoc.data().labels || [];
      await deleteDoc(doc(db, 'imageLabels', latestDoc.id));
      return labels;
    } finally {
      await deleteObject(storageRef);
    }
  }
  return [];
};