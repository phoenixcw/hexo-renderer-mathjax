'use strict';

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['coverage/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        // Hexo injects itself as a global into every plugin.
        hexo: 'readonly'
      }
    },
    rules: {
      strict: ['error', 'global'],
      // The 0.6.0 renderer shadowed the `path` module with a local variable.
      'no-shadow': 'error',
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['test/**/*.js'],
    rules: {
      // Tests intentionally assign the Hexo instance the plugin reads.
      'no-global-assign': 'off'
    }
  }
];
