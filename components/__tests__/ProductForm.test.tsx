import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ProductForm from '../supplier/ProductForm';

describe('ProductForm', () => {
  it('Unit Test for ProductForm: renders inputs and calls handlers', () => {
    const setProductName = jest.fn();
    const setPrice = jest.fn();
    const setDescription = jest.fn();
    const setCategory = jest.fn();
    const handleAddProduct = jest.fn();
    const setImageUrl = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <ProductForm
        productName=""
        setProductName={setProductName}
        price=""
        setPrice={setPrice}
        description=""
        setDescription={setDescription}
        category=""
        setCategory={setCategory}
        imageUrl={null}
        setImageUrl={setImageUrl}
        isDarkMode={false}
        handleAddProduct={handleAddProduct}
        pickImage={() => setImageUrl('picked')}
        takePhoto={() => setImageUrl('photo')}
        styles={{}}
      />
    );

    fireEvent.changeText(getByPlaceholderText(/Product Name/i), 'Juice');
    fireEvent.changeText(getByPlaceholderText(/Price/i), '4.50');
    fireEvent.changeText(getByPlaceholderText(/Category/i), 'Drinks');
    fireEvent.changeText(getByPlaceholderText(/Description/i), 'Fresh juice');

    fireEvent.press(getByText(/Add Product/i));

    expect(setProductName).toHaveBeenCalledWith('Juice');
    expect(setPrice).toHaveBeenCalledWith('4.50');
    expect(setCategory).toHaveBeenCalledWith('Drinks');
    expect(setDescription).toHaveBeenCalledWith('Fresh juice');
    expect(handleAddProduct).toHaveBeenCalled();
  });
});
