import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { RevealList, RevealListItem } from './list';

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

describe('<RevealList /> + <RevealListItem />', () => {
    it('renderiza uma <ul> com um <li> por item', () => {
        const { container } = render(
            <RevealList>
                <RevealListItem>um</RevealListItem>
                <RevealListItem>dois</RevealListItem>
            </RevealList>,
        );

        expect(container.querySelector('ul')).toBeInTheDocument();
        expect(container.querySelectorAll('li')).toHaveLength(2);
        expect(screen.getByText('um')).toBeInTheDocument();
        expect(screen.getByText('dois')).toBeInTheDocument();
    });

    it('com prefers-reduced-motion, continua uma <ul>/<li> comum', () => {
        mockPrefersReducedMotion(true);

        const { container } = render(
            <RevealList>
                <RevealListItem>um</RevealListItem>
            </RevealList>,
        );

        expect(container.querySelector('ul')).toBeInTheDocument();
        expect(container.querySelector('li')).toBeInTheDocument();
    });

    it('não introduz violações de acessibilidade', async () => {
        const { container } = render(
            <RevealList>
                <RevealListItem>conteúdo acessível</RevealListItem>
            </RevealList>,
        );

        expect(await axe(container)).toHaveNoViolations();
    });
});
