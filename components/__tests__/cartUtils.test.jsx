import { getTotal } from '@/utils/cartUtils';
describe('getTotal', () => {
  it('Unit Test: getTotal returns correct sum', () => {
    const cart = [
      { price: 5, quantity: 2 },
      { price: 3, quantity: 1 }
    ];
    expect(getTotal(cart)).toBe(13);
  });

  it('returns 0 for an empty cart', () => {
    expect(getTotal([])).toBe(0);
  });

  it('handles cart with one item', () => {
    expect(getTotal([{ price: 10, quantity: 1 }])).toBe(10);
  });

  it('handles items with zero quantity', () => {
    const cart = [
      { price: 5, quantity: 0 },
      { price: 3, quantity: 2 }
    ];
    expect(getTotal(cart)).toBe(6);
  });

  it('handles items with zero price', () => {
    const cart = [
      { price: 0, quantity: 5 },
      { price: 3, quantity: 2 }
    ];
    expect(getTotal(cart)).toBe(6);
  });

  it('handles negative prices or quantities', () => {
    const cart = [
      { price: -5, quantity: 2 },
      { price: 3, quantity: -1 }
    ];
    expect(getTotal(cart)).toBe(-13);
  });
});