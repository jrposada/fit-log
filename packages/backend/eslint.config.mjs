import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  { ignores: ['.esbuild'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    ignores: ['cloudformation'],
    files: ['**/*.{ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {},
    rules: {},
  },
]);
