module.exports = {
  env: {
    test: {},
    development: {
      plugins: [],
    },
    production: {
      plugins: [],
    },
  },
  presets: [
    "@babel/preset-react",
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-syntax-async-generators',
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
