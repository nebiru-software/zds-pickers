const esModules = []

const fullCoverage = { branches: 100, functions: 100, lines: 100, statements: 100 }

module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/__config__/**',
    '!**/*.stories.js',
    '!**/node_modules/**',
    '!src/components/App.js',
    '!src/components/common/avclub/index.js',
    '!src/components/common/slider/Slider.js',
    '!src/hotLoaderConfig.js',
    '!src/index.js',
    '!src/reducers/index.js',
    '!src/routing/Routes.js',
    '!src/sagas/index.js',
    '!src/store.js',
    '!src/styles/themes/muiBootstrap.js',
  ],
  coverageReporters: ['html', 'json', 'lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 99.08,
      branches: 98.42,
      lines: 99.25,
      functions: 97.93,
    },
    'src/core': { ...fullCoverage },
    'src/hoc': { ...fullCoverage },
    'src/hooks': { ...fullCoverage },
    'src/locale': { ...fullCoverage },
    'src/middleware': { ...fullCoverage },
    'src/projections': { ...fullCoverage },
    'src/reducers': { ...fullCoverage },
    'src/routing/collections': { ...fullCoverage },
    'src/sagas': { ...fullCoverage },
    'src/selectors': { ...fullCoverage, branches: 99.02 },
    'src/styles': { ...fullCoverage },
    'src/views': { ...fullCoverage },
  },
  displayName: {
    name: 'V3',
    color: 'blueBright',
  },
  errorOnDeprecated: true,
  globals: {},
  globalSetup: '<rootDir>/__config__/globalSetup.js',
  moduleNameMapper: {
    '\\.(css|scss)': '<rootDir>/node_modules/jest-css-modules',
    '\\.(svg|png|jpg|gif|ico|mp3|mp4)': '<rootDir>/__mocks__/file-mock.js',
    popper: '<rootDir>/__mocks__/popper.js',
    'react-confirm': '<rootDir>/__mocks__/react-confirm.js',

    '^@config/(.*)$': '<rootDir>/__config__/$1',
    '^@data/(.*)$': '<rootDir>/__data__/$1',
    '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
    '^@questions/(.*)$': '<rootDir>/src/components/blast/questions/__data__/$1',
    '^@reducers/(.*)$': '<rootDir>/src/reducers/__data__/$1',
    '^@reviews/(.*)$': '<rootDir>/src/components/assignments/reviews/__data__/$1',

    '^common/(.*)$': '<rootDir>/src/components/common/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^fp/(.*)$': '<rootDir>/src/core/fp/$1',
    '^core/(.*)$': '<rootDir>/src/core/$1',
    '^hoc/(.*)$': '<rootDir>/src/hoc/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^images/(.*)$': '<rootDir>/src/images/$1',
    '^locale/(.*)$': '<rootDir>/src/locale/$1',
    '^projections/(.*)$': '<rootDir>/src/projections/$1',
    '^reducers/(.*)$': '<rootDir>/src/reducers/$1',
    '^routing/(.*)$': '<rootDir>/src/routing/$1',
    '^sagas/(.*)$': '<rootDir>/src/sagas/$1',
    '^selectors/(.*)$': '<rootDir>/src/selectors/$1',
    '^styles/(.*)$': '<rootDir>/src/styles/$1',
    '^views/(.*)$': '<rootDir>/src/views/$1',
  },
  reporters: ['default', 'jest-skipped-reporter'],
  resetMocks: false,
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/__config__/index.js'],
  setupFilesAfterEnv: [
    '<rootDir>/__config__/setupAfterEnv.js',
    '<rootDir>/__config__/force-gc.js',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/?(*.)(spec).js?(x)'],
  testURL: 'http://localhost',
  timers: 'fake',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.txt$': 'jest-raw-loader',
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules}).+\\.js$`],
  verbose: false,
}
