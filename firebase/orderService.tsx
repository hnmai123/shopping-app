import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const createOrder = async (
  cart: any[],
  totalAmount: number,
  address: string,
  coords: { latitude: number; longitude: number }
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const orderData = {
    userId: user.uid,
    items: cart,
    totalAmount,
    address,
    coords,
    createdAt: serverTimestamp(),
    status: 'pending',
    paymentMethod: 'default',
  };

  const ordersRef = collection(db, 'orders');
  const orderDoc = await addDoc(ordersRef, orderData);
  return orderDoc.id;
};
