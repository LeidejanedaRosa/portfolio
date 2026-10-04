import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

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

    it('a foto de fundo é decorativa (não entra na árvore de acessibilidade)', () => {
        render(<HomePage />);

        expect(screen.queryAllByRole('img')).toHaveLength(0);
    });

    it('a foto de fundo declara dimensões (evita CLS) e é a mesma em qualquer breakpoint', () => {
        const { container } = render(<HomePage />);

        const photo = container.querySelector('img[aria-hidden="true"]');
        expect(photo).toHaveAttribute('width', '1280');
        expect(photo).toHaveAttribute('height', '720');
    });

    it('pista de scroll é decorativa (redundante pro leitor de tela, que já navega por landmark/heading)', () => {
        render(<HomePage />);

        const cue = screen.getByText('Role');
        expect(cue.closest('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<HomePage />);

        expect(await axe(container)).toHaveNoViolations();
    });

    // `motion-reduce:animate-none` (Tailwind, CSS puro — ver comentário em
    // index.tsx) desliga o quique sozinho via media query; não depende de
    // `prefersReducedMotion` em JS pra isso, então não há uma branch pra
    // testar aqui além de confirmar que a classe está sempre presente.
    it('o quique da pista de scroll desliga sozinho em prefers-reduced-motion (classe motion-reduce:animate-none)', () => {
        render(<HomePage />);

        const cue = screen.getByText('Role').parentElement;
        expect(cue).toHaveClass(
            'animate-[scroll-cue-bounce_1.6s_ease-in-out_infinite]',
            'motion-reduce:animate-none',
        );
    });

    // Achado da auditoria de 2026-10: antes a Home usava o
    // `useReducedMotion` do framer-motion (não o hook compartilhado do
    // projeto), que cacheia o valor numa referência de módulo — um
    // `matchMedia` mockado aqui nunca era reconsultado, e um teste unitário
    // "passava" mesmo com o parallax sempre ligado de verdade. Trocar pro
    // `usePrefersReducedMotion` (que relê a cada montagem) resolve a causa,
    // mas o EFEITO (o parallax de verdade ligar/desligar) continua
    // impossível de provar aqui: sem scroll real, `useTransform` sempre
    // calcula o mesmo valor (0) nos dois casos no instante da renderização
    // — só diverge depois que a página rola de verdade, o que o jsdom não
    // simula. Esse caso virou teste e2e (`e2e/home.spec.ts`, navegador
    // real, scroll de verdade) em vez de um unitário que fingiria provar
    // algo que não prova.
});
