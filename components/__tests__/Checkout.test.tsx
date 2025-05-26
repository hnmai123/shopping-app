import CheckoutScreen from '@/app/(tabs)/(cart)/checkout';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { render, waitFor } from '@testing-library/react-native';
import * as firebase from 'firebase/firestore';
import React from 'react';


jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/context/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@/firebase/orderService', () => ({
  createOrder: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));


describe('CheckoutScreen UI', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'Test Product',
      price: 10,
      quantity: 1,
      seller: 'seller123',
      sellerName: 'Mock Seller',
    },
  ];

  beforeEach(() => {
 
    (useRoute as jest.Mock).mockReturnValue({
      params: {
        cart: mockCartItems,
        cartCount: 1,
        totalAmount: 10,
      },
    });

    (useNavigation as jest.Mock).mockReturnValue({
      goBack: jest.fn(),
    });


    (useCart as jest.Mock).mockReturnValue({
      updateCart: jest.fn(),
    });

    
    (useTheme as jest.Mock).mockReturnValue({
      isDarkMode: false,
      theme: 'light',
      toggleTheme: jest.fn(),
    });
   
    (firebase.getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: 'Mock Seller',
        address: '123 Test St',
        coords: { latitude: 0, longitude: 0 },
      }),
    });
  });

  it('renders checkout screen with cart item and summary', async () => {
    const { getByText, queryByText } = render(<CheckoutScreen />);

    await waitFor(() => {
      expect(getByText('Checkout')).toBeTruthy();
      expect(getByText('Test Product')).toBeTruthy();
      expect(getByText(/\$10\.00/)).toBeTruthy(); 
    });

    expect(queryByText('Your order has been placed successfully!')).toBeNull(); 
  });
});