import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

// Fontes self-hosted (variable = 1 arquivo cobre todos os pesos).
// Bundladas pelo Vite → sem request a terceiros, sem layout shift.
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource-variable/ibm-plex-sans/wght.css';

import './index.css';
import { App } from './app';

const container = document.getElementById('root')!;
const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

// Em produção, dist/index.html já chega com o HTML pré-renderizado dentro
// de #root (ver scripts/prerender.mjs) — hidrata em vez de jogar fora e
// remontar do zero, senão perderíamos o ganho de pintar antes do JS rodar.
// Em dev (`vite dev`), #root não passa pelo prerender — só tem o
// comentário-placeholder, nenhum elemento filho — então monta normalmente.
if (container.children.length > 0) {
    hydrateRoot(container, app);
} else {
    createRoot(container).render(app);
}
