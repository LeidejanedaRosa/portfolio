import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ThemeProvider, useTheme } from './index';

function Probe() {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button type="button" onClick={toggleTheme}>
                alternar
            </button>
        </div>
    );
}

const renderWithProvider = () =>
    render(
        <ThemeProvider>
            <Probe />
        </ThemeProvider>,
    );

/** Faz o matchMedia responder que o SISTEMA prefere escuro. */
function mockSystemDark() {
    vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
            ({
                matches: query.includes('dark'),
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

/**
 * Mock de matchMedia que de fato guarda o listener registrado, pra testar
 * o ThemeProvider reagindo a uma mudança de preferência do SO DURANTE a
 * sessão (não só na primeira leitura em getInitialTheme). `matches` começa
 * em `initialMatches`; `fireChange` simula o evento nativo do navegador.
 */
function mockMatchMediaWithChangeSupport(initialMatches: boolean) {
    let matches = initialMatches;
    let listener: ((event: MediaQueryListEvent) => void) | null = null;

    vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) =>
            ({
                get matches() {
                    return matches;
                },
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: (
                    _type: string,
                    cb: (event: MediaQueryListEvent) => void,
                ) => {
                    listener = cb;
                },
                removeEventListener: () => {
                    listener = null;
                },
                dispatchEvent: () => false,
            }) as unknown as MediaQueryList,
    );

    return {
        fireChange(nextMatches: boolean) {
            matches = nextMatches;
            listener?.({ matches: nextMatches } as MediaQueryListEvent);
        },
    };
}

describe('ThemeProvider / useTheme', () => {
    it('useTheme fora do provider lança erro explicativo', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        expect(() => render(<Probe />)).toThrow(/ThemeProvider/);

        consoleError.mockRestore();
    });

    it('sem escolha salva e sistema claro → começa claro', () => {
        renderWithProvider();

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(document.documentElement).not.toHaveClass('dark');
    });

    it('sem escolha salva → segue o sistema quando ele prefere escuro', () => {
        mockSystemDark();

        renderWithProvider();

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement).toHaveClass('dark');
    });

    it('escolha salva no localStorage tem prioridade sobre o sistema', () => {
        mockSystemDark();
        localStorage.setItem('theme', 'light');

        renderWithProvider();

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('alternar inverte o tema, aplica .dark no <html> e persiste', async () => {
        const user = userEvent.setup();
        renderWithProvider();

        await user.click(screen.getByRole('button', { name: 'alternar' }));

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement).toHaveClass('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('sem escolha manual, acompanha o SO quando ele muda durante a sessão', () => {
        const media = mockMatchMediaWithChangeSupport(false);
        renderWithProvider();
        expect(screen.getByTestId('theme')).toHaveTextContent('light');

        act(() => {
            media.fireChange(true);
        });

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement).toHaveClass('dark');
    });

    it('com escolha manual salva, ignora mudança do SO durante a sessão', async () => {
        const media = mockMatchMediaWithChangeSupport(false);
        const user = userEvent.setup();
        renderWithProvider();

        // escolha manual: persiste no localStorage, não é só estado React
        await user.click(screen.getByRole('button', { name: 'alternar' }));
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');

        // SO muda pra claro — não deveria reverter a escolha manual
        media.fireChange(false);

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('com localStorage falhando ao persistir, ainda assim ignora mudança do SO (escolha manual rastreada em memória)', async () => {
        const media = mockMatchMediaWithChangeSupport(false);
        const setItemSpy = vi
            .spyOn(Storage.prototype, 'setItem')
            .mockImplementation(() => {
                throw new Error('QuotaExceededError (simulado)');
            });
        const user = userEvent.setup();
        renderWithProvider();

        // a escolha manual funciona mesmo com persist() falhando por baixo
        await user.click(screen.getByRole('button', { name: 'alternar' }));
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(localStorage.getItem('theme')).toBeNull(); // confirma que falhou mesmo

        // SO muda — se checássemos só o localStorage (que está vazio por
        // causa da falha), isso sobrescreveria a escolha manual por engano
        act(() => {
            media.fireChange(false);
        });

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');

        setItemSpy.mockRestore();
    });

    it('mantém a meta theme-color (chrome do navegador) sincronizada com o tema', async () => {
        const meta = document.createElement('meta');
        meta.id = 'theme-color-meta';
        meta.setAttribute('content', '#f8fafc');
        document.head.appendChild(meta);

        const user = userEvent.setup();
        renderWithProvider();
        expect(meta.getAttribute('content')).toBe('#f8fafc');

        await user.click(screen.getByRole('button', { name: 'alternar' }));

        expect(meta.getAttribute('content')).toBe('#0f172a');

        meta.remove();
    });
});
