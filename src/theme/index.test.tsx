import { render, screen } from '@testing-library/react';
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
});
