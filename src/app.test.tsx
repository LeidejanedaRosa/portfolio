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
            screen.getByRole('heading', { level: 2, name: /sobre mim/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: /projetos/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: /contato/i }),
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

    it('não tem violações de acessibilidade na página inteira', async () => {
        const { container } = render(<App />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
