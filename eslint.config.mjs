import js from '@eslint/js';
import globals from 'globals';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, prettier: pluginPrettier },
    extends: ['js/recommended', configPrettier],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'prettier/prettier': 'error' },
  },
]);
