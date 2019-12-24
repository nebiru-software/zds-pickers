module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:import/errors', 'plugin:import/warnings'],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    'jest',
    'json',
    'material-ui-dkadrios',
    'ocd',
    'prettier',
    'react-hooks',
  ],
  globals: {
    browser: true,
    cleanup: true,
    container: true,
    createElement: true,
    dive: true,
    fakeAnchorEl: true,
    fireEvent: true,
    gapi: true,
    getPage: true,
    goto: true,
    login: true,
    mockedStore: true,
    mount: true,
    mountExpect: true,
    React: true,
    render: true,
    routerStoreFromUrl: true,
    shallow: true,
    shallowDiveExpect: true,
    shallowExpect: true,
    spyOn: true,
    useTheme: true,
    withProps: true,
    wrapRouter: true,
    wrapRouterStore: true,
    wrapStore: true,
    wrapStoreForHook: true,
    wrapTheme: true,
  },
  settings: {
    'import/resolver': {
      parcel: {
        rootDir: 'src',
      },
    },
  },
  rules: {
    'array-element-newline': ['error', 'consistent'],
    'arrow-parens': [
      'error',
      'as-needed',
      {
        requireForBlockBody: true,
      },
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'function-paren-newline': ['error', 'multiline'],
    'import/extensions': 0,
    'import/no-duplicates': 2,
    'import/no-named-as-default': 0,
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
      },
    ],
    'import/default': 2,
    'material-ui-dkadrios/no-importing-act': 0,
    'material-ui-dkadrios/no-importing-styles': 2,
    'material-ui-dkadrios/restricted-path-imports': 2,
    'material-ui-dkadrios/tree-shakeable-imports': 2,
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-await-in-loop': 0,
    'no-confusing-arrow': 0,
    'no-extra-parens': ['error', 'functions'],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    'no-nested-ternary': 0,
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft'],
      },
    ],
    'no-restricted-imports': [
      2,
      {
        paths: [
          {
            name: 'lodash',
            message: "Please use methods from 'src/core/fp/' instead.",
          },
        ],
        patterns: ['@material-ui/core!?'],
      },
    ],
    'no-useless-concat': 2,
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
        },
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true },
    ],
    'ocd/sort-import-declaration-specifiers': 2,
    'ocd/sort-variable-declarator-properties': 2,
    'prefer-template': 2,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js'],
      },
    ],
    'react/jsx-max-props-per-line': [
      1,
      {
        maximum: 1,
        when: 'always',
      },
    ],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    semi: ['error', 'never'],
  },
}
