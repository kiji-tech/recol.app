import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  verbose: true,
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  setupFiles: ['./node_modules/react-native-google-mobile-ads/jest.setup.ts'],
};

export default config;
