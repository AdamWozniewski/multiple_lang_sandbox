import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    'settings': {
      'import/resolver': {
        'node': {
          'extensions': [
            'ts',
          ],
          'paths': [
            './packages/*',
          ],
        },
      },
      'import/core-modules': [
        'electron',
      ],
      'react': {
        'version': '18.2.0',
      },
    },
    'ignorePatterns': [
      'tsconfig.json',
      'test-definition.json',
    ],
    'env': {
      'browser': true,
      'es2021': true,
      'node': true,
    },
    'extends': [
      'airbnb-base',
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:storybook/recommended',
      'plugin:react-hooks/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
      'ecmaFeatures': {
        'jsx': true,
      },
      'ecmaVersion': 'latest',
      'sourceType': 'module',
    },
    'plugins': [
      'react',
      'react-hooks',
      '@typescript-eslint',
      'prettier',
//    "@emotion" - react ui
    ],
    'rules': {
      'no-useless-constructor': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/prefer-default-export': 'off',
      'no-plusplus': 'off',
      'import/extensions': [
        'error',
        'never',
        {
          'styles': 'always',
        },
      ],
      'import/no-unresolved': 'off',
      'no-console': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          'devDependencies': [
            '**/*.stories.*',
            '**/.storybook/**/*.*',
            '/test/**/*',
            '/build/**',
          ],
          'peerDependencies': true,
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          'allow': [
            'arrowFunctions',
          ],
        },
      ],
      'default-case': 'off',
      'consistent-return': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-curly-brace-presence': 'error',
    },
    'overrides': [
      {
        'files': 'test/**/*',
        'rules': {
          'no-unused-expressions': 'off',
        },
      },
      {
        'files': 'src/ui/store/*',
        'rules': {
          'no-param-reassign': 'off',
        },
      },
      {
        'files': '*.js',
        'rules': {
          '@typescript-eslint/no-var-requires': 'off',
          'global-require': 'off',
        },
      },
    ],
  }];