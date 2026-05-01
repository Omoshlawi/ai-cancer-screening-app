// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['components/ui/**/*'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'import/first': 'off',
      'import/no-duplicates': 'off',
      'import/no-named-as-default': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
]);
