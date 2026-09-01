import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

const nodeGlobals = {
  __dirname: 'readonly',
  console: 'readonly',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly'
};

const browserGlobals = {
  console: 'readonly',
  document: 'readonly',
  fetch: 'readonly',
  localStorage: 'readonly',
  URLSearchParams: 'readonly',
  window: 'readonly'
};

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },
  {
    name: 'security-showcase/backend',
    files: ['backend/**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: nodeGlobals
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }]
    }
  },
  {
    name: 'security-showcase/frontend',
    files: ['frontend/src/**/*.{js,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          varsIgnorePattern: '^React$'
        }
      ]
    }
  }
]);