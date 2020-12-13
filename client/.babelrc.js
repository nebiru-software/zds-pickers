module.exports = {
  env: {
    development: {
      plugins: [
        [
          'babel-plugin-jsx-remove-data-test-id',
          { attributes: 'data-testid' },
        ],
        'react-hot-loader/babel',
      ],
    },
    production: {
      plugins: [
        [
          'babel-plugin-jsx-remove-data-test-id',
          { attributes: 'data-testid' },
        ],
      ],
    },
    test: {},
  },
  presets: [
    '@babel/preset-env',
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ],
  plugins: [
    // ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-export-default-from',
    // '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-import-meta',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
  retainLines: true,
}
