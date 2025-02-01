import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  verbose: true,
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
};

export default config;
