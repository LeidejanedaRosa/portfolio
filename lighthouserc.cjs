// .cjs explícito: package.json tem "type": "module", e o @lhci/cli espera
// `module.exports` (CommonJS) neste arquivo de config.
module.exports = {
    ci: {
        collect: {
            staticDistDir: './dist',
            numberOfRuns: 1,
        },
        assert: {
            assertions: {
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                // performance ainda sem "error": CDNs de fonte e o bundle não
                // otimizado ainda podem penalizar a nota real. Primeiro
                // rodamos pra ver o número de verdade, só então travamos.
                'categories:performance': ['warn', { minScore: 0.8 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
