import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  verbose: true,
  testMatch: ['<rootDir>/test/**/*.spec.ts', '<rootDir>/test/**/*.spec.tsx'],
  setupFiles: ['./node_modules/react-native-google-mobile-ads/jest.setup.ts', './test/mocks/mockSetup.ts'],
};

export default config;
