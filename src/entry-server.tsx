import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import { App } from './app';

/**
 * Só usado em build (`vite build --ssr`, ver scripts/prerender.mjs) — nunca
 * roda no navegador. Gera o HTML inicial em Node, sem `window`/`document`/
 * `localStorage` (ver guards em src/theme e src/consent), pra injetar no
 * `<div id="root">` de dist/index.html antes do deploy. O cliente então
 * hidrata (src/index.tsx) em vez de montar do zero — por isso o navegador
 * já pinta o conteúdo (inclusive o LCP do hero) sem esperar o JS baixar e
 * rodar.
 */
export function render() {
    return renderToString(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
