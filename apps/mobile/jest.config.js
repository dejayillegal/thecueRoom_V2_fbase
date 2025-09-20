const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,
  setupFilesAfterEnv: [...(expoPreset.setupFilesAfterEnv ?? []), '<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo(nent)?|expo-modules-core|@expo|@supabase|@testing-library|react-native-gesture-handler|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-svg)/)'
  ],
  moduleNameMapper: {
    ...(expoPreset.moduleNameMapper ?? {}),
    '\\.(svg)$': '<rootDir>/__mocks__/svgMock.tsx'
  },
  moduleDirectories: ['node_modules', '<rootDir>/node_modules', '<rootDir>/../../node_modules']
};
