import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ConsentProvider } from '@src/consent';

import { Contact } from './index';

const renderContact = () =>
    render(
        <ConsentProvider>
            <Contact />
        </ConsentProvider>,
    );

describe('<Contact />', () => {
    it('é uma seção com título e id de âncora', () => {
        renderContact();

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /contato/i,
        });
        expect(heading).toHaveAttribute('id', 'contact-title');
    });

    it('tem os 4 canais com o link certo', () => {
        renderContact();

        expect(screen.getByRole('link', { name: /e-mail/i })).toHaveAttribute(
            'href',
            'mailto:leidejanedarosa.81@gmail.com',
        );
        expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
            'href',
            'https://www.linkedin.com/in/leidejane/',
        );
        expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
            'href',
            'https://github.com/LeidejanedaRosa',
        );
        expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute(
            'href',
            'https://wa.me/5535991414032',
        );
    });

    it('o link de e-mail não abre em nova aba (não é externo)', () => {
        renderContact();

        const email = screen.getByRole('link', { name: /e-mail/i });
        expect(email).not.toHaveAttribute('target');
        expect(email).not.toHaveAttribute('rel');
    });

    it('os links externos abrem em nova aba com rel seguro', () => {
        renderContact();

        for (const name of [/linkedin/i, /github/i, /whatsapp/i]) {
            const link = screen.getByRole('link', { name });
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute(
                'rel',
                expect.stringContaining('noreferrer'),
            );
        }
    });

    it('"Preferências de cookies" limpa a escolha salva', async () => {
        localStorage.setItem('cookie-consent', 'accepted');
        const user = userEvent.setup();
        renderContact();

        await user.click(
            screen.getByRole('button', { name: 'Preferências de cookies' }),
        );

        expect(localStorage.getItem('cookie-consent')).toBeNull();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderContact();

        expect(await axe(container)).toHaveNoViolations();
    });
});
