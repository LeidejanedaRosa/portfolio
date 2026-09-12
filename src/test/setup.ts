import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// vitest-axe 0.1 não registra o matcher sozinho — fazemos manualmente.
expect.extend(axeMatchers);

// jsdom não implementa IntersectionObserver — stub no-op para componentes que o
// usam (scroll spy, lazy load) montarem sem quebrar. Testes que precisam do
// callback substituem este stub localmente (ex.: use-active-section.test).
if (typeof window.IntersectionObserver === 'undefined') {
    class IntersectionObserverStub {
        readonly root = null;
        readonly rootMargin = '';
        readonly thresholds: ReadonlyArray<number> = [];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }
    const stub =
        IntersectionObserverStub as unknown as typeof IntersectionObserver;
    window.IntersectionObserver = stub;
    globalThis.IntersectionObserver = stub;
}

// jsdom não implementa ResizeObserver — stub no-op para componentes que o
// usam para medir elementos (ex.: Navigation publicando --nav-height).
if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    const stub = ResizeObserverStub as unknown as typeof ResizeObserver;
    window.ResizeObserver = stub;
    globalThis.ResizeObserver = stub;
}

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

// jsdom não implementa showModal()/close() do <dialog> nativo (usado pelo
// PrivacyDialog pra focus trap + inert de fundo grátis do navegador).
// Polyfill mínimo: reflete `.open` e dispara "close" (mesmo evento nativo
// que o componente escuta, cobrindo tanto ESC quanto o botão Fechar).
if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        this.open = true;
    };
}
if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event('close'));
    };
}
// Browsers fecham o <dialog> modal aberto sozinhos ao apertar ESC — jsdom não
// simula isso, então replicamos aqui pra quem testar via teclado.
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openDialog =
        document.querySelector<HTMLDialogElement>('dialog[open]');
    openDialog?.dispatchEvent(new Event('cancel'));
    openDialog?.close();
});

// Cada teste começa com um DOM limpo e sem estado persistido — sem vazamento
// entre casos (localStorage e a classe .dark do <html> sobrevivem ao cleanup).
afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
});
