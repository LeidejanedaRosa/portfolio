import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from '@src/theme';

import { Layout } from './index';

const renderLayout = () =>
    render(
        <ThemeProvider>
            <Layout>
                <p>conteúdo</p>
            </Layout>
        </ThemeProvider>,
    );

describe('<Layout />', () => {
    it('tem os landmarks <nav> e <main> e o skip link', () => {
        renderLayout();

        expect(
            screen.getByRole('navigation', { name: /principal/i }),
        ).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
        expect(
            screen.getByRole('link', { name: /pular para o conteúdo/i }),
        ).toHaveAttribute('href', '#main');
    });

    it('o <header> é o elemento sticky, não o <nav> dentro dele', () => {
        // Achado real (bug): um elemento sticky só "gruda" enquanto a caixa
        // do PRÓPRIO PAI (containing block) ainda está na tela. Se o sticky
        // estivesse no <nav> e o pai dele fosse um <header> que só contém o
        // nav (mesma altura), o header sairia da tela quase imediatamente ao
        // rolar, e o nav "sticky" pararia de grudar. Por isso o sticky tem
        // que estar no <header> (cujo pai é a página inteira) — este teste
        // trava isso: header carrega a classe, nav não.
        renderLayout();

        const header = document.querySelector('header');
        const nav = screen.getByRole('navigation', { name: /principal/i });

        expect(header).toHaveClass('sticky');
        expect(nav).not.toHaveClass('sticky');
    });

    it('publica a altura do header como --nav-height', () => {
        renderLayout();

        expect(
            document.documentElement.style.getPropertyValue('--nav-height'),
        ).not.toBe('');
    });

    it('sem ResizeObserver no browser, ainda mede a altura uma vez e monta sem quebrar', () => {
        vi.stubGlobal('ResizeObserver', undefined);

        renderLayout();

        expect(
            document.documentElement.style.getPropertyValue('--nav-height'),
        ).not.toBe('');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderLayout();
        expect(await axe(container)).toHaveNoViolations();
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.style.removeProperty('--nav-height');
});
