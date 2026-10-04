import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Reveal } from './index';

function mockPrefersReducedMotion(matches: boolean) {
    vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
            ({
                matches: query.includes('reduce') ? matches : false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }) as MediaQueryList,
    );
}

describe('<Reveal />', () => {
    it('renderiza o conteúdo', () => {
        render(
            <Reveal>
                <p>conteúdo</p>
            </Reveal>,
        );

        expect(screen.getByText('conteúdo')).toBeInTheDocument();
    });

    // Achado da auditoria de 2026-10: a versão anterior deste teste conferia
    // só `container.firstChild?.nodeName === 'DIV'` — mas `m.div` do
    // framer-motion TAMBÉM renderiza como `<div>` de verdade, então esse
    // assert passaria igual mesmo se a branch de reduced-motion fosse
    // apagada (confirmado: provei com um teste descartável que `initial`/
    // `variants` aplicam `style` de forma síncrona no jsdom — diferente de
    // `animate` com array de keyframes, que não aplica — então checar o
    // `style` é o sinal real que distingue as duas branches aqui).
    it('sem prefers-reduced-motion, começa com opacity/transform do estado "hidden" (whileInView ainda não disparou)', () => {
        mockPrefersReducedMotion(false);

        const { container } = render(
            <Reveal>
                <p>conteúdo</p>
            </Reveal>,
        );

        expect(container.firstChild).toHaveStyle({
            opacity: '0',
            transform: 'translateY(16px)',
        });
    });

    it('com prefers-reduced-motion, renderiza estático — sem opacity/transform nenhum, não depende de whileInView disparar', () => {
        mockPrefersReducedMotion(true);

        const { container } = render(
            <Reveal>
                <p>conteúdo</p>
            </Reveal>,
        );

        expect(screen.getByText('conteúdo')).toBeInTheDocument();
        expect(container.firstChild?.nodeName).toBe('DIV');
        expect(container.firstChild).not.toHaveAttribute('style');
    });

    it('aceita className extra pro caller controlar layout', () => {
        mockPrefersReducedMotion(true);

        const { container } = render(
            <Reveal className="mt-6">
                <p>x</p>
            </Reveal>,
        );

        expect(container.firstChild).toHaveClass('mt-6');
    });

    it('não introduz violações de acessibilidade', async () => {
        const { container } = render(
            <Reveal>
                <p>conteúdo acessível</p>
            </Reveal>,
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
