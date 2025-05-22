import { fireEvent, render, screen } from '@testing-library/react-native';
import LoginScreen from '../../app/(auth)/login';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.reject(new Error('Invalid email or password'))),
  getReactNativePersistence: jest.fn(() => ({})), 
  initializeAuth: jest.fn(() => ({})),
}));

describe('LoginScreen', () => {
  it('UI test for LoginScreen: accepts email and password', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText(/Email/i);
    const passwordInput = getByPlaceholderText(/Password/i);
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');

    fireEvent.press(getByText(/Login/i));
  });
});

it('UI test: shows error message on invalid login', async () => {
  render(<LoginScreen />);
  fireEvent.changeText(screen.getByPlaceholderText(/Email/i), 'wrong@example.com');
  fireEvent.changeText(screen.getByPlaceholderText(/Password/i), 'wrongpass');
  const loginButtons = screen.getAllByText(/Log in/i);
  fireEvent.press(loginButtons[0]); 

  expect(await screen.findByText(/Sorry, your password or email was incorrect./i)).toBeTruthy();
});