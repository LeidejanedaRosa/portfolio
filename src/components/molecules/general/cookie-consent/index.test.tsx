import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it } from 'vitest';

import { __resetLoadGTMForTests } from '@src/lib/load-gtm';
import { ConsentProvider } from '@src/consent';

import { CookieConsentBanner } from './index';

const renderBanner = () =>
    render(
        <ConsentProvider>
            <CookieConsentBanner />
        </ConsentProvider>,
    );

afterEach(() => {
    __resetLoadGTMForTests();
    document
        .querySelectorAll('script[src*="googletagmanager.com"]')
        .forEach((el) => el.remove());
});

describe('<CookieConsentBanner />', () => {
    it('aparece quando ainda não há decisão salva', () => {
        renderBanner();

        expect(
            screen.getByRole('region', { name: 'Aviso de cookies' }),
        ).toBeInTheDocument();
    });

    it('some ao aceitar', async () => {
        const user = userEvent.setup();
        renderBanner();

        await user.click(screen.getByRole('button', { name: 'Aceitar' }));

        expect(
            screen.queryByRole('region', { name: 'Aviso de cookies' }),
        ).not.toBeInTheDocument();
    });

    it('some ao recusar', async () => {
        const user = userEvent.setup();
        renderBanner();

        await user.click(screen.getByRole('button', { name: 'Recusar' }));

        expect(
            screen.queryByRole('region', { name: 'Aviso de cookies' }),
        ).not.toBeInTheDocument();
    });

    it('não aparece quando já existe escolha salva', () => {
        localStorage.setItem('cookie-consent', 'accepted');

        renderBanner();

        expect(
            screen.queryByRole('region', { name: 'Aviso de cookies' }),
        ).not.toBeInTheDocument();
    });

    it('"Saiba mais" abre o diálogo de privacidade', async () => {
        const user = userEvent.setup();
        renderBanner();

        await user.click(screen.getByRole('button', { name: 'Saiba mais' }));

        expect(
            screen.getByRole('dialog', { name: 'Privacidade' }),
        ).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderBanner();

        expect(await axe(container)).toHaveNoViolations();
    });
});
