jest.mock('react-native-gesture-handler', () => {
  return {
    ...jest.requireActual('react-native-gesture-handler'),
    GestureHandlerRootView: ({ children }) => children,
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

process.env.EXPO_OS = 'ios'; // or 'android'

jest.spyOn(console, 'error').mockImplementation((message) => {
  if (message.includes('not wrapped in act')) return;
  console.error(message);
});

jest.spyOn(console, 'warn').mockImplementation((message) => {
  if (message.includes('EXPO_OS')) return;
  console.warn(message);
});

process.removeAllListeners('warning');
