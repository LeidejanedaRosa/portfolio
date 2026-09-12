declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

// Evita injetar o script duas vezes (ex: StrictMode monta o efeito 2x em dev).
let loaded = false;

/**
 * Injeta o Google Tag Manager. Só deve ser chamado DEPOIS do consentimento
 * explícito (ver src/consent) — nunca no carregamento da página.
 */
export function loadGTM(containerId: string): void {
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    document.head.appendChild(script);
}

/** Exposto só para os testes resetarem o guard entre casos. */
export function __resetLoadGTMForTests(): void {
    loaded = false;
}
