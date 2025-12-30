import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintReact from '@eslint-react/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  // Global ignores
  {
    ignores: ['dist', 'node_modules', 'build', 'coverage', 'playwright-report', 'test-results'],
  },

  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],

  // Main configuration
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@tanstack/query': pluginQuery,
    },

    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // React Refresh rules (Vite-optimized)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Code style
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],

      // Import restrictions (feature-based architecture)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/features/*/*', '~/features/*/*/*'],
              message: 'Import from feature public API (~/features/*) instead of deep imports',
            },
          ],
        },
      ],

      // ESLint React customizations
      '@eslint-react/no-missing-key': 'warn',

      // TanStack Query best practices
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
    },
  },
]
