import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

import { useTheme } from '@src/theme';

/**
 * Botão de alternância de tema (toggle button, padrão WAI-ARIA APG).
 * Consome o ThemeProvider — sem props. O nome acessível é FIXO ("Modo escuro");
 * o estado (ligado/desligado) vem do `aria-pressed`, não do rótulo.
 */
export const DarkModeButton = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Modo escuro"
            aria-pressed={isDark}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition-colors duration-200 hover:bg-muted"
        >
            {isDark ? (
                <SunIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
                <MoonIcon className="h-6 w-6" aria-hidden="true" />
            )}
        </button>
    );
};
