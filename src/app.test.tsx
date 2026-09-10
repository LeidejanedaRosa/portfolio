import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { App } from './app';

/**
 * Smoke test do pipeline real (aliases @assets, framer-motion, tokens) +
 * garantia de que a página tem os landmarks e as 4 seções montadas.
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

    it('tem landmark <main> e o skip link para ele', () => {
        render(<App />);

        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
        expect(
            screen.getByRole('link', { name: /pular para o conteúdo/i }),
        ).toHaveAttribute('href', '#main');
    });

    // A11y do <main> (o que esta branch construiu). A página inteira só passa a
    // ser auditada quando a navegação antiga (NavBar/HamburgerMenu, com <div onClick>
    // e botões sem nome) for reescrita — ver docs/BACKLOG.md §4.4/§4.5.
    it('não tem violações de acessibilidade no conteúdo principal', async () => {
        render(<App />);

        expect(await axe(screen.getByRole('main'))).toHaveNoViolations();
    });
});
