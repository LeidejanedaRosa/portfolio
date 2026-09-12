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

    it('mostra o fluxo de tecnologias com as 3 colunas', () => {
        render(<AboutMe />);

        expect(screen.getByText('Front-end')).toBeInTheDocument();
        expect(screen.getByText('Back-end')).toBeInTheDocument();
        expect(screen.getByText('Dados')).toBeInTheDocument();

        // 13 nós no diagrama
        expect(screen.getAllByRole('button')).toHaveLength(13);
    });

    it('cita as tecnologias que não têm nó no diagrama', () => {
        render(<AboutMe />);

        expect(
            screen.getByText(/express, celery, cypress, pytest/i),
        ).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<AboutMe />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
