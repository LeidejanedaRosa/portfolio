import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { AboutMe } from './index';

describe('<AboutMe />', () => {
    it('é uma seção com título e id de âncora', () => {
        render(<AboutMe />);

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /sobre mim/i,
        });
        expect(heading).toHaveAttribute('id', 'about-title');
    });

    it('conta a trajetória (Cubos → Clarke → freelancer)', () => {
        render(<AboutMe />);

        expect(screen.getByText(/cubos academy/i)).toBeInTheDocument();
        expect(screen.getByText(/clarke energia/i)).toBeInTheDocument();
        expect(
            screen.getByText(/ferramenta não é engenharia/i),
        ).toBeInTheDocument();
    });

    it('mostra a stack agrupada com os nomes das tecnologias', () => {
        render(<AboutMe />);

        expect(screen.getByText('Front-end')).toBeInTheDocument();
        expect(screen.getByText('Testes & fluxo')).toBeInTheDocument();

        // nomes visíveis (a <svg> é decorativa, aria-hidden)
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
        expect(screen.getByText('GitHub Actions')).toBeInTheDocument();
    });

    it('cita as práticas que não têm logo', () => {
        render(<AboutMe />);

        expect(
            screen.getByText(/playwright, testes e2e, ci\/cd/i),
        ).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<AboutMe />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
