import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { __resetLoadGTMForTests } from '@src/lib/load-gtm';

import { ConsentProvider, useConsent } from './index';

function Probe() {
    const { status, accept, reject, reset } = useConsent();
    return (
        <div>
            <span data-testid="status">{status ?? 'undecided'}</span>
            <button type="button" onClick={accept}>
                aceitar
            </button>
            <button type="button" onClick={reject}>
                recusar
            </button>
            <button type="button" onClick={reset}>
                redefinir
            </button>
        </div>
    );
}

const renderWithProvider = () =>
    render(
        <ConsentProvider>
            <Probe />
        </ConsentProvider>,
    );

afterEach(() => {
    __resetLoadGTMForTests();
    document
        .querySelectorAll('script[src*="googletagmanager.com"]')
        .forEach((el) => el.remove());
    delete window.dataLayer;
});

function lastConsentUpdate() {
    // loadGTM() também empurra pro mesmo dataLayer, mas como objeto (não
    // array) — filtra só as entradas no formato gtag() antes de desestruturar.
    return (window.dataLayer ?? [])
        .filter((entry): entry is unknown[] => Array.isArray(entry))
        .filter(([cmd, action]) => cmd === 'consent' && action === 'update')
        .at(-1);
}

describe('ConsentProvider / useConsent', () => {
    it('useConsent fora do provider lança erro explicativo', () => {
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        expect(() => render(<Probe />)).toThrow(/ConsentProvider/);

        consoleError.mockRestore();
    });

    it('sem escolha salva → começa indeciso e NÃO carrega o GTM', () => {
        renderWithProvider();

        expect(screen.getByTestId('status')).toHaveTextContent('undecided');
        expect(
            document.head.querySelector('script[src*="googletagmanager.com"]'),
        ).toBeNull();
    });

    it('aceitar persiste e carrega o GTM', async () => {
        const user = userEvent.setup();
        renderWithProvider();

        await user.click(screen.getByRole('button', { name: 'aceitar' }));

        expect(screen.getByTestId('status')).toHaveTextContent('accepted');
        expect(localStorage.getItem('cookie-consent')).toBe('accepted');
        expect(
            document.head.querySelector('script[src*="googletagmanager.com"]'),
        ).not.toBeNull();
        expect(lastConsentUpdate()).toEqual([
            'consent',
            'update',
            { analytics_storage: 'granted' },
        ]);
    });

    it('recusar persiste e NÃO carrega o GTM', async () => {
        const user = userEvent.setup();
        renderWithProvider();

        await user.click(screen.getByRole('button', { name: 'recusar' }));

        expect(screen.getByTestId('status')).toHaveTextContent('rejected');
        expect(localStorage.getItem('cookie-consent')).toBe('rejected');
        expect(
            document.head.querySelector('script[src*="googletagmanager.com"]'),
        ).toBeNull();
        expect(lastConsentUpdate()).toEqual([
            'consent',
            'update',
            { analytics_storage: 'denied' },
        ]);
    });

    it('escolha salva no localStorage é respeitada ao montar', () => {
        localStorage.setItem('cookie-consent', 'rejected');

        renderWithProvider();

        expect(screen.getByTestId('status')).toHaveTextContent('rejected');
    });

    it('redefinir volta pro estado indeciso (reabre o banner)', async () => {
        const user = userEvent.setup();
        renderWithProvider();

        await user.click(screen.getByRole('button', { name: 'aceitar' }));
        await user.click(screen.getByRole('button', { name: 'redefinir' }));

        expect(screen.getByTestId('status')).toHaveTextContent('undecided');
        expect(localStorage.getItem('cookie-consent')).toBeNull();
    });

    it('redefinir envia consent denied mesmo com o GTM já carregado (revoga no meio da sessão)', async () => {
        const user = userEvent.setup();
        renderWithProvider();

        // já aceitou nesta sessão — o GTM está rodando
        await user.click(screen.getByRole('button', { name: 'aceitar' }));
        expect(
            document.head.querySelector('script[src*="googletagmanager.com"]'),
        ).not.toBeNull();

        await user.click(screen.getByRole('button', { name: 'redefinir' }));

        // o script já injetado não é removido (não dá pra "desinjetar" JS de
        // terceiro), mas o sinal de denied já vai — é isso que uma tag do
        // GA4/Ads configurada com Consent Mode usa pra parar de mandar dado.
        expect(lastConsentUpdate()).toEqual([
            'consent',
            'update',
            { analytics_storage: 'denied' },
        ]);
    });
});
