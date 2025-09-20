import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

process.env.EXPO_PUBLIC_SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://example-project.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key';

jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-linking', () => ({
  ...jest.requireActual('expo-linking'),
  createURL: jest.fn((path = '') => `thecueroom://${path}`),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => undefined;
  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

const originalWarn = console.warn;
const suppressedMessages = ['`new NativeEventEmitter()`'];

console.warn = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && suppressedMessages.some((entry) => args[0].includes(entry))) {
    return;
  }

  originalWarn(...args);
};
