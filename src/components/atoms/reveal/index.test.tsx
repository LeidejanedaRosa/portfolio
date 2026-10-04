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

    it('com prefers-reduced-motion, renderiza estático (sem depender de whileInView disparar)', () => {
        mockPrefersReducedMotion(true);

        const { container } = render(
            <Reveal>
                <p>conteúdo</p>
            </Reveal>,
        );

        expect(screen.getByText('conteúdo')).toBeInTheDocument();
        expect(container.firstChild?.nodeName).toBe('DIV');
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
