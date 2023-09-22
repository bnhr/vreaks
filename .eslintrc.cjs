module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/jsx-runtime',
		'plugin:jsx-a11y/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	root: true,
	settings: {
		react: {
			version: 'detect',
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.mts', '.cts', '.tsx', '.d.ts'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	plugins: ['react', 'react-refresh', '@typescript-eslint'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'import/order': [
			'warn',
			{
				groups: [
					['builtin', 'external'],
					'internal',
					['parent', 'sibling', 'index'],
				],
				pathGroups: [
					{
						pattern: 'react',
						group: 'external',
						position: 'before',
					},
				],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'import/no-unresolved': 'off',
		'import/extensions': ['error', { ts: ['.ts', '.tsx'] }],
		'import/no-unresolved': 'error',
		'import/prefer-default-imports': 'error',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/*.test.ts', '**/*.test.tsx'],
			},
		],
		'import/default': 'off',
		'import/prefer-default-imports': 'off',
		"import/no-extraneous-dependencies": ["error", { "devDependencies": ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*.spec.tsx"] }],
		'react-refresh/only-export-components': 'warn',
	},
}
