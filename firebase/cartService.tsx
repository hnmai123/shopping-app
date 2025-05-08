import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

export const syncCartToFirestore = async (cartItems: any[]) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = doc(db, "carts", user.uid);

    const simplifiedItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
    }));

    await setDoc(cartRef, {
        items: simplifiedItems,
        updatedAt: serverTimestamp(),
    });
};

export const deleteItemFromFirestore = async (productId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);

    if (!cartSnap.exists()) return;

    const cartData = cartSnap.data();
    const filteredItems = cartData.items.filter((item: any) => item.id !== productId);
    await updateDoc(cartRef, {
        items: filteredItems,
        updatedAt: serverTimestamp(),
    });
};

export const fetchProductDetails = async (productId: string) => {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    return productSnap.exists() ? { id: productId, ...productSnap.data() } : null;
};