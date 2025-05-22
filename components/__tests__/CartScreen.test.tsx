import { NavigationContainer } from "@react-navigation/native";
import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import Cart from "../../app/(tabs)/(cart)/cart";

// Silence act() warnings in test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

// Mock Firebase Firestore to prevent `.mjs` error
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => true, data: () => ({}) })
  ),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock firebase config file (if it exports db/auth)
jest.mock("@/firebase/firebaseConfig", () => ({
  db: {},
  auth: {},
}));

// Mock cart context to return dummy data
jest.mock("@/context/CartContext", () => ({
  useCart: () => ({
    cart: [{ id: "1", name: "Apple", price: 5.0, quantity: 2 }],
    getTotal: () => 10,
    removeFromCart: jest.fn(),
  }),
}));

describe("Cart screen", () => {
  it("UI test for CartScreen: renders cart items and total", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Cart />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("Apple")).toBeTruthy();
      expect(getByText(/\$10/)).toBeTruthy();
      expect(getByText(/Total/i)).toBeTruthy();
    });
  });
});
