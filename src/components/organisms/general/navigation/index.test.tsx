import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@src/theme';

import { Navigation } from './index';

const renderNav = () =>
    render(
        <ThemeProvider>
            <Navigation />
        </ThemeProvider>,
    );

describe('<Navigation />', () => {
    it('é um landmark de navegação', () => {
        renderNav();
        expect(
            screen.getByRole('navigation', { name: /principal/i }),
        ).toBeInTheDocument();
    });

    it('tem os 4 links âncora apontando para as seções', () => {
        renderNav();

        const hrefs = (name: RegExp) =>
            screen
                .getAllByRole('link', { name, hidden: true })
                .map((link) => link.getAttribute('href'));

        expect(hrefs(/início/i)).toContain('#home');
        expect(hrefs(/sobre/i)).toContain('#about');
        expect(hrefs(/projetos/i)).toContain('#projects');
        expect(hrefs(/contato/i)).toContain('#contact');
    });

    it('o wordmark leva ao topo', () => {
        renderNav();
        expect(
            screen.getByRole('link', { name: 'Leidejane da Rosa' }),
        ).toHaveAttribute('href', '#home');
    });

    it('o botão do menu alterna aria-expanded e revela o painel', async () => {
        const user = userEvent.setup();
        renderNav();

        const toggle = screen.getByRole('button', { name: 'Menu' });
        const panel = document.getElementById('mobile-nav');

        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav');
        expect(panel).not.toBeVisible();

        await user.click(toggle);

        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(panel).toBeVisible();
    });

    it('ESC fecha o menu e devolve o foco ao botão', async () => {
        const user = userEvent.setup();
        renderNav();
        const toggle = screen.getByRole('button', { name: 'Menu' });

        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');

        await user.keyboard('{Escape}');

        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveFocus();
    });

    it('clicar num link do painel fecha o menu e devolve o foco ao botão', async () => {
        const user = userEvent.setup();
        renderNav();
        const toggle = screen.getByRole('button', { name: 'Menu' });
        await user.click(toggle);

        const panel = within(
            document.getElementById('mobile-nav') as HTMLElement,
        );
        await user.click(panel.getByRole('link', { name: /projetos/i }));

        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveFocus();
    });

    it('marca a seção inicial com aria-current', () => {
        renderNav();

        const currentLinks = screen
            .getAllByRole('link', { name: /início/i, hidden: true })
            .filter((link) => link.getAttribute('aria-current') === 'true');

        expect(currentLinks.length).toBeGreaterThan(0);
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderNav();
        expect(await axe(container)).toHaveNoViolations();
    });

    it('sem ResizeObserver no browser, ainda mede a altura uma vez e monta sem quebrar', () => {
        vi.stubGlobal('ResizeObserver', undefined);

        renderNav();

        expect(
            document.documentElement.style.getPropertyValue('--nav-height'),
        ).not.toBe('');
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.style.removeProperty('--nav-height');
});
