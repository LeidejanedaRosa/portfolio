import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// vitest-axe 0.1 não registra o matcher sozinho — fazemos manualmente.
expect.extend(axeMatchers);

// jsdom não implementa matchMedia — stub para hooks de media query
// (framer-motion useReducedMotion, etc.). Padrão: nenhuma media query casa.
if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string): MediaQueryList => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}

// Cada teste começa com um DOM limpo e sem estado persistido — sem vazamento
// entre casos (localStorage e a classe .dark do <html> sobrevivem ao cleanup).
afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
});
