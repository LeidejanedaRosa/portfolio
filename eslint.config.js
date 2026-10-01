import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'coverage', '.husky'] },
    {
        // eslintConfigPrettier por último: desliga só as regras de formatação
        // do ESLint que conflitariam com o Prettier (quem formata é o
        // Prettier; o ESLint cuida de lint de verdade).
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            eslintConfigPrettier,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },
    {
        // Arquivos de type augmentation (.d.ts) precisam de interfaces vazias e
        // assinaturas genéricas idênticas às da lib para o merge funcionar.
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
);
