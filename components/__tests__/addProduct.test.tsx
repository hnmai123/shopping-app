import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import AddProduct from '../../app/(tabs)/(profile)/(supplier)/addProduct';

jest.mock('expo-router', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({ isDarkMode: false, toggleTheme: jest.fn() }),
}));

jest.mock('@/hooks/useProductForm', () => ({
  useProductForm: () => ({
    pickImage: jest.fn(),
    takePhoto: jest.fn(),
    uploadProgress: 0,
    uploading: false,
    handleAddProduct: jest.fn(),
  }),
}));

jest.mock('@/components/Header', () => 'Header');

jest.mock('@/components/supplier/ProductForm', () => {
  return function MockedProductForm(props: any) {
    const { TextInput, Button, View } = require('react-native');
    return (
      <View>
        <TextInput
          testID="product-name-input"
          value={props.productName}
          onChangeText={props.setProductName}
        />
        <Button title="Add Product" onPress={props.handleAddProduct} />
      </View>
    );
  };
});

describe('AddProduct screen', () => {
  it('renders and allows product input and submission', () => {
    const { getByTestId, getByText } = render(<AddProduct />);
    const input = getByTestId('product-name-input');

    fireEvent.changeText(input, 'Test Product');
    expect(input.props.value).toBe('Test Product');

    const button = getByText('Add Product');
    fireEvent.press(button);
  });
});
