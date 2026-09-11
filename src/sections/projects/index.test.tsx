import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Projects } from './index';

describe('<Projects />', () => {
    it('é uma seção com título e id de âncora', () => {
        render(<Projects />);

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /projetos/i,
        });
        expect(heading).toHaveAttribute('id', 'projects-title');
    });

    it('lista os quatro projetos com seus títulos', () => {
        render(<Projects />);

        expect(
            screen.getByRole('heading', { name: /faladoria/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /fcr/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /emr international/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /espaço saúde bem-estar/i }),
        ).toBeInTheDocument();
    });

    it('projeto privado não tem links de código/demo', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /faladoria/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/privado/i)).toBeInTheDocument();
        expect(
            within(card).queryByRole('link', { name: /ver código|ver site/i }),
        ).not.toBeInTheDocument();
    });

    it('projeto público tem links de código e demo em nova aba', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /espaço saúde bem-estar/i })
            .closest('li') as HTMLElement;

        expect(within(card).getByText(/público/i)).toBeInTheDocument();

        const codeLink = within(card).getByRole('link', {
            name: /ver código/i,
        });
        expect(codeLink).toHaveAttribute(
            'href',
            'https://github.com/LeidejanedaRosa/landing-espaco-saude-bemestar',
        );
        expect(codeLink).toHaveAttribute('target', '_blank');
        expect(codeLink).toHaveAttribute(
            'rel',
            expect.stringContaining('noreferrer'),
        );

        const demoLink = within(card).getByRole('link', { name: /ver site/i });
        expect(demoLink).toHaveAttribute(
            'href',
            'https://landing-espaco-saude-bemestar.vercel.app',
        );
    });

    it('projetos privados trazem um trecho de código real, sem segredo, atrás de um <details>', () => {
        render(<Projects />);

        const card = screen
            .getByRole('heading', { name: /faladoria/i })
            .closest('li') as HTMLElement;

        const disclosure = within(card)
            .getByText(/ver trecho de código/i)
            .closest('details') as HTMLDetailsElement;
        expect(disclosure).toBeInTheDocument();
        expect(disclosure).not.toHaveAttribute('open');
        expect(
            within(disclosure).getByText('requireRole.ts'),
        ).toBeInTheDocument();

        // nenhum segredo (token/chave/senha) vaza no trecho
        expect(disclosure.textContent).not.toMatch(
            /api[_-]?key|secret|password|token\s*[:=]/i,
        );
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<Projects />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
