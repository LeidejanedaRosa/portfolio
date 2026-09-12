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

    it('em telas pequenas, renderiza só a cena mobile e a foto, com dimensões declaradas (evita baixar 2x e evita CLS)', () => {
        render(<HomePage />);

        const scenes = screen.getAllByRole('img', {
            name: /decisões de arquitetura/i,
        });
        expect(scenes).toHaveLength(1);
        expect(scenes[0]).toHaveAttribute('width', '1300');
        expect(scenes[0]).toHaveAttribute('height', '1758');

        const photo = screen.getByRole('img', {
            name: /retrato de leidejane/i,
        });
        expect(photo).toHaveAttribute('width', '800');
        expect(photo).toHaveAttribute('height', '1096');
    });

    it('em telas grandes, renderiza só a cena desktop e a foto, com dimensões declaradas (evita CLS)', () => {
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

        const scenes = screen.getAllByRole('img', {
            name: /decisões de arquitetura/i,
        });
        expect(scenes).toHaveLength(1);
        expect(scenes[0]).toHaveAttribute('width', '1300');
        expect(scenes[0]).toHaveAttribute('height', '1758');

        const photo = screen.getByRole('img', {
            name: /retrato de leidejane/i,
        });
        expect(photo).toHaveAttribute('width', '800');
        expect(photo).toHaveAttribute('height', '1096');
    });

    it('em coluna única, a foto vem visualmente antes do texto, mas o <h1> continua primeiro no DOM (leitor de tela/teclado)', () => {
        const { container } = render(<HomePage />);

        const heading = screen.getByRole('heading', { level: 1 });
        const textBlock = heading.closest('.order-2');
        const imageBlock = container.querySelector('.order-1');

        expect(textBlock).toBeInTheDocument();
        expect(imageBlock).toBeInTheDocument();
        // DOM: texto antes da imagem (ordem de leitura/semântica preservada).
        expect(
            textBlock!.compareDocumentPosition(imageBlock!) &
                Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
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
