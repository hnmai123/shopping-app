import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

export const addToCart = async (
  product: any,
  setLocalError: (msg: string) => void,
  updateCart: (fn: (prev: any[]) => any[]) => void
) => {
  const user = auth.currentUser;
  if (!user) {
    setLocalError("Please log in to add items to your cart.");
    return;
  }

  const cartRef = doc(db, 'carts', user.uid);
  const cartDoc = await getDoc(cartRef);

  let updatedItems = [];
  if (!cartDoc.exists()) {
    updatedItems = [{ ...product, quantity: 1 }];
    await setDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    });
  } else {
    const cartData = cartDoc.data();
    const existingItems = cartData.items.find((item: any) => item.id === product.id);
    if (existingItems) {
      updatedItems = cartData.items.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedItems = [...cartData.items, { ...product, quantity: 1 }];
    }

    await updateDoc(cartRef, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    });
  }

  updateCart((previousCart: any[]) => {
    const existingProduct = previousCart.find((item) => item.id === product.id);
    if (existingProduct) {
      return previousCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...previousCart, { ...product, quantity: 1 }];
    }
  });
};

export function getTotal(cart: { price: number; quantity: number }[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
} 