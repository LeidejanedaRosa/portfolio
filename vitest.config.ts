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
            setupFiles: ['./src/test/setup.ts'],
            css: true, // processa CSS Modules nos testes (não quebra em import de styles)
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
            },
        },
    }),
);
