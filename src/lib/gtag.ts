declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

/**
 * Mesmo `gtag()` que o Google documenta: só empurra os argumentos pro
 * dataLayer (funciona mesmo antes do GTM carregar — ele processa o
 * histórico acumulado assim que injeta). Usado pelo Consent Mode em
 * src/consent; index.html declara o `gtag` global equivalente pro script
 * inline de default (os dois escrevem no mesmo array).
 */
export function gtag(...args: unknown[]): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
}
