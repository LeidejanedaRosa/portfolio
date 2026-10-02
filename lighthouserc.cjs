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
                // Preload da imagem do hero + LazyMotion (framer-motion)
                // levaram a nota real de ~60 pra 90 — agora trava como
                // "error" igual as outras 3 categorias. 0.8, não 0.9: dá
                // uma margem de 10 pontos pra variação normal entre
                // execuções do Lighthouse (a máquina do CI pode ser mais
                // lenta que a local), sem deixar a nota cair em silêncio.
                'categories:performance': ['error', { minScore: 0.8 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
