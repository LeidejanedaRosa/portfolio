import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fontes self-hosted (variable = 1 arquivo cobre todos os pesos).
// Bundladas pelo Vite → sem request a terceiros, sem layout shift.
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource-variable/ibm-plex-sans/wght.css';

import './index.css';
import { App } from './app';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
