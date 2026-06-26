import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.ts'],
        ignores: ['dist/**'],
        languageOptions: {
            ecmaVersion: 'latest',
            parser: tsParser,
            sourceType: 'commonjs'
        },
        rules: {
            'comma-dangle': ['error', 'never'],
            'eol-last': ['error', 'always'],
            'indent': ['error', 4, { SwitchCase: 1 }],
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
            'no-trailing-spaces': 'error',
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'object-shorthand': ['error', 'always']
        }
    }
];
