import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { App } from './app';

/**
 * Smoke test do pipeline real (aliases, framer-motion, tokens) + garantia de
 * que a página tem os landmarks, as 4 seções montadas e zero violação de a11y.
 */
describe('<App />', () => {
    it('monta as quatro seções com seus títulos', () => {
        render(<App />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /leidejane da rosa/i,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', {
                level: 2,
                name: /desenvolvedora full stack/i,
            }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: /projetos/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: /contato/i }),
        ).toBeInTheDocument();
    });

    it('mostra o aviso de cookies quando ainda não há escolha salva', () => {
        render(<App />);

        expect(
            screen.getByRole('region', { name: /aviso de cookies/i }),
        ).toBeInTheDocument();
    });

    it('tem os landmarks <nav> e <main> e o skip link', () => {
        render(<App />);

        expect(
            screen.getByRole('navigation', { name: /principal/i }),
        ).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
        expect(
            screen.getByRole('link', { name: /pular para o conteúdo/i }),
        ).toHaveAttribute('href', '#main');
    });

    // Timeout maior que o padrão (5s): a página inteira ficou mais rica
    // (fluxo de tecnologias com 14 nós + SVG animado + carrossel + o hero
    // novo do Sobre), e o axe-core escaneando a árvore toda pode passar de
    // 15s quando a suíte inteira roda em paralelo e disputa CPU.
    it('não tem violações de acessibilidade na página inteira', async () => {
        const { container } = render(<App />);

        // iframes: false — os previews ao vivo da seção Projetos travam o
        // axe em jsdom (sem navegação real, o `src` nunca carrega; ver o
        // mesmo comentário em sections/projects/index.test.tsx).
        expect(await axe(container, { iframes: false })).toHaveNoViolations();
    }, 30000);
});
