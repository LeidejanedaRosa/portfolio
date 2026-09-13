import { render, screen, within } from '@testing-library/react';
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

        // 14 nós no diagrama (5 front-end + 6 back-end + 3 dados)
        expect(screen.getAllByRole('button')).toHaveLength(14);
    });

    it('mostra no carrossel tanto ferramentas com logo quanto práticas sem marca', () => {
        render(<AboutMe />);

        const carousel = screen.getByRole('list', {
            name: 'Outras ferramentas do dia a dia',
        });
        expect(carousel).toBeInTheDocument();

        // O carrossel duplica a lista pro loop visual (a cópia é
        // aria-hidden) — por isso a checagem fica restrita aos <li>
        // acessíveis, em vez de um getByText solto no documento inteiro.
        // 11 itens: 5 com logo (Cypress, Pytest, Git, GitHub Actions,
        // Storybook) + 6 sem logo (Playwright, CI/CD, Clean Code, SOLID,
        // Acessibilidade, Arquitetura — práticas/metodologias ou marca fora
        // do pacote de ícones, ver comentário no arquivo).
        const items = within(carousel).getAllByRole('listitem');
        expect(items).toHaveLength(11);
        expect(within(items[0]).getByText('Cypress')).toBeInTheDocument();
        expect(
            within(items[3]).getByText('GitHub Actions'),
        ).toBeInTheDocument();
        expect(within(items[4]).getByText('Storybook')).toBeInTheDocument();
        expect(within(items[7]).getByText('Clean Code')).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<AboutMe />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
