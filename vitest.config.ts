import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

// SRP: vite.config.ts descreve o BUILD; este arquivo descreve os TESTES.
// mergeConfig reaproveita plugins e aliases (@assets, @components...) do Vite,
// então o ambiente de teste enxerga os módulos exatamente como a aplicação.
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom', // DOM falso para rodar componentes React no Node
            globals: true, // describe/it/expect sem precisar importar em todo arquivo
            // Sem isso, o glob padrão do Vitest (*.spec.ts) também pega os
            // testes e2e do Playwright em e2e/ — dois test runners, dois
            // "test"/"expect" incompatíveis, tentando rodar o mesmo arquivo.
            include: ['src/**/*.test.{ts,tsx}'],
            setupFiles: ['./src/test/setup.ts'],
            css: true, // processa CSS Modules nos testes (não quebra em import de styles)
            restoreMocks: true, // cada teste começa com spies/mocks originais restaurados
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html', 'lcov'],
                include: ['src/**/*.{ts,tsx}'],
                exclude: [
                    'src/index.tsx', // ponto de entrada, sem lógica testável
                    'src/vite-env.d.ts',
                    'src/**/*.test.{ts,tsx}',
                    'src/test/**',
                ],
                // Meta por seção, não um número solto pro projeto inteiro:
                // cada glob trava no nível que a seção JÁ tem hoje (medido,
                // não arredondado pra cima) — serve de régua contra
                // regressão, não de meta artificial. Cobertura alta sem
                // assert de regra de negócio é teatro (não é o objetivo
                // aqui); o objetivo é não deixar a cobertura cair em
                // silêncio.
                thresholds: {
                    'src/sections/about-me/**': {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100,
                    },
                    'src/sections/contact/**': {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100,
                    },
                    'src/sections/faq/**': {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100,
                    },
                    'src/sections/home/**': {
                        statements: 100,
                        branches: 50,
                        functions: 100,
                        lines: 100,
                    },
                    'src/sections/projects/**': {
                        statements: 96,
                        branches: 83,
                        functions: 100,
                        lines: 96,
                    },
                },
            },
        },
    }),
);
