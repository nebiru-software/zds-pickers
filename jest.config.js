module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/src/__config__'],
  coverageReporters: ['json', 'lcov'],
  globals: {},
  moduleNameMapper: {
    '\\.(css|scss)': '<rootDir>/node_modules/jest-css-modules',
    '\\.(svg|png|jpg)': '<rootDir>/node_modules/blank-module',
  },
  modulePathIgnorePatterns: ['<rootDir>/src/__config__', '<rootDir>/src/__mocks__'],
  resetMocks: false,
  roots: ['<rootDir>/src'],
  setupFiles: [
    '<rootDir>/src/__config__/tempPolyfills.js',
    '<rootDir>/src/__config__/global.js',
    '<rootDir>/src/__config__/fetch-mock.js',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/?(*.)(spec).js?(x)'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  verbose: false,
}
