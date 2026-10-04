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

    // Achado da auditoria de 2026-10: a versão anterior só conferia que
    // `<ul>`/`<li>` existiam — mas `m.ul`/`m.li` do framer-motion também
    // renderizam como `<ul>`/`<li>` de verdade, então isso passaria igual
    // mesmo com a branch de reduced-motion apagada. `initial`/`variants`
    // aplicam `style` de forma síncrona no jsdom (confirmado com um teste
    // descartável) — é esse estilo que distingue as duas branches aqui.
    // Testado de propósito quebrando a branch de só um dos dois componentes
    // por vez: sozinho, nenhum reproduz o bug (sem o `m.ul` pai fornecendo
    // o contexto de animação, o `m.li` solto não tem `initial`/`animate`
    // próprio pra saber que estado mostrar) — só falha de verdade quando os
    // dois ficam errados juntos, que é como são usados na prática (sempre
    // em par, nunca um sem o outro no código real).
    it('sem prefers-reduced-motion, cada item começa com opacity/transform do estado "hidden"', () => {
        mockPrefersReducedMotion(false);

        const { container } = render(
            <RevealList>
                <RevealListItem>um</RevealListItem>
            </RevealList>,
        );

        expect(container.querySelector('li')).toHaveStyle({
            opacity: '0',
            transform: 'translateY(16px)',
        });
    });

    it('com prefers-reduced-motion, continua uma <ul>/<li> comum — sem opacity/transform nenhum', () => {
        mockPrefersReducedMotion(true);

        const { container } = render(
            <RevealList>
                <RevealListItem>um</RevealListItem>
            </RevealList>,
        );

        expect(container.querySelector('ul')).toBeInTheDocument();
        const item = container.querySelector('li');
        expect(item).toBeInTheDocument();
        expect(item).not.toHaveAttribute('style');
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
