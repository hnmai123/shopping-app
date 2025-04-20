import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<any[]>([]);

    const updateCart = (updatedCart: any[]) => {
        setCart(updatedCart);
    };
    const cartCount = cart.length;
    return (
        <CartContext.Provider value={{ cart, cartCount, updateCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);