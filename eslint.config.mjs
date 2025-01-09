//@ts-check
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import node from 'eslint-plugin-n';
import stylistic from '@stylistic/eslint-plugin-js';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
	{
		ignores: ['.vercel', 'node_modules', 'supabase', '.svelte-kit', 'src/lib/components/ui']
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte', '*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		}
	},
	{
		plugins: {
			n: node,
			'@stylistic': stylistic
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'@stylistic/quote-props': ['error', 'as-needed'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/ban-types': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-object-literal-type-assertion': 'off',
			'@typescript-eslint/no-this-alias': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ args: 'after-used', argsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-use-before-define': 'off',
			'@typescript-eslint/prefer-interface': 'off',
			'no-constant-condition': ['error', { checkLoops: false }],
			'no-duplicate-imports': 'error',
			'no-empty': ['error', { allowEmptyCatch: true }],
			'no-inner-declarations': 'off',
			'no-restricted-properties': [
				'error',
				{ object: 'test', property: 'only', message: 'Do not check in test.only tests.' }
			],
			'no-sparse-arrays': 'off',
			'prefer-const': ['error', { destructuring: 'all' }],
			'no-var': 'error',
			'object-shorthand': ['error', 'always'],
			'prefer-arrow-callback': 'error',
			'svelte/no-inner-declarations': 'off',
			'n/prefer-global/process': ['off'],
			'n/prefer-node-protocol': 'error'
		}
	}
];
