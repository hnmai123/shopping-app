import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { fetchProductDetails } from '../firebase/cartService';
const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const cartRef = doc(db, "carts", user.uid);
            const cartDoc = await getDoc(cartRef);
            if (!cartDoc.exists()) return;

            const cartItems = cartDoc.data().items || [];

            const hydratedCart = await Promise.all(
                cartItems.map(async (item: any) => {
                    const product = await fetchProductDetails(item.productId);
                    return {
                        ...product,
                        quantity: item.quantity,
                    };
                })
            );
            setCart(hydratedCart);
        };
        fetchCart();
    }, []);

    const updateCart = (updatedCart: any[]) => {
        setCart(updatedCart);
    };
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    return (
        <CartContext.Provider value={{ cart, cartCount, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);