import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Contact } from './index';

describe('<Contact />', () => {
    it('é uma seção com título e id de âncora', () => {
        render(<Contact />);

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /contato/i,
        });
        expect(heading).toHaveAttribute('id', 'contact-title');
    });

    it('tem os 4 canais com o link certo', () => {
        render(<Contact />);

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
        render(<Contact />);

        const email = screen.getByRole('link', { name: /e-mail/i });
        expect(email).not.toHaveAttribute('target');
        expect(email).not.toHaveAttribute('rel');
    });

    it('os links externos abrem em nova aba com rel seguro', () => {
        render(<Contact />);

        for (const name of [/linkedin/i, /github/i, /whatsapp/i]) {
            const link = screen.getByRole('link', { name });
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute(
                'rel',
                expect.stringContaining('noreferrer'),
            );
        }
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<Contact />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
