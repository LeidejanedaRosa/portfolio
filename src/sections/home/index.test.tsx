import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { HomePage } from './index';

describe('<HomePage />', () => {
    it('apresenta o nome como <h1> e o cargo logo abaixo', () => {
        render(<HomePage />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /leidejane da rosa/i,
            }),
        ).toBeInTheDocument();
        expect(screen.getByText(/engenheira de software/i)).toBeInTheDocument();
    });

    it('tem CTA primário apontando para a seção de projetos', () => {
        render(<HomePage />);

        expect(
            screen.getByRole('link', { name: /ver projetos/i }),
        ).toHaveAttribute('href', '#projects');
    });

    it('em telas pequenas, não baixa a foto dos cadernos (só o fundo atrás do texto)', () => {
        render(<HomePage />);

        expect(
            screen.queryByRole('img', { name: /cadernos com anotações/i }),
        ).not.toBeInTheDocument();
    });

    it('em telas grandes, renderiza a foto dos cadernos com dimensões declaradas (evita CLS)', () => {
        vi.spyOn(window, 'matchMedia').mockImplementation(
            (query) =>
                ({
                    matches: query.includes('1024px'),
                    media: query,
                    onchange: null,
                    addListener: () => {},
                    removeListener: () => {},
                    addEventListener: () => {},
                    removeEventListener: () => {},
                    dispatchEvent: () => false,
                }) as MediaQueryList,
        );

        render(<HomePage />);

        const photo = screen.getByRole('img', {
            name: /cadernos com anotações/i,
        });
        expect(photo).toHaveAttribute('width', '1264');
        expect(photo).toHaveAttribute('height', '842');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<HomePage />);

        expect(await axe(container)).toHaveNoViolations();
    });

    it('renderiza com prefers-reduced-motion sem quebrar', () => {
        vi.spyOn(window, 'matchMedia').mockImplementation(
            (query) =>
                ({
                    matches: query.includes('reduce'),
                    media: query,
                    onchange: null,
                    addListener: () => {},
                    removeListener: () => {},
                    addEventListener: () => {},
                    removeEventListener: () => {},
                    dispatchEvent: () => false,
                }) as MediaQueryList,
        );

        render(<HomePage />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: /leidejane da rosa/i,
            }),
        ).toBeInTheDocument();
    });
});
