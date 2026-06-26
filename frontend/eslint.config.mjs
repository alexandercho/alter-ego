// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';

export default defineConfig([
    expoConfig,
    {
        ignores: ['dist/**']
    },
    {
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json'
                },
                node: true
            }
        },
        rules: {
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'object-shorthand': ['error', 'always'],
            'comma-dangle': ['error', 'never'], // no trailing commas
            'indent': ['error', 4, {
                SwitchCase: 1
            }],
            'no-multiple-empty-lines': ['error', {
                max: 1,
                maxEOF: 1
            }]
        }
    }
]);
