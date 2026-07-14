import js from '@eslint/js';
import globals from 'globals';

export default [
	{ ignores: ['assets/dist/**', 'node_modules/**', 'vendor/**'] },
	js.configs.recommended,
	{
		files: ['assets/src/**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.browser },
		},
	},
	{
		files: ['vite.config.js', 'eslint.config.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { ...globals.node },
		},
	},
];