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
});

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
});
