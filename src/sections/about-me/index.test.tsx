import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { AboutMe } from './index';

describe('<AboutMe />', () => {
    it('é uma seção com título e id de âncora', () => {
        render(<AboutMe />);

        const heading = screen.getByRole('heading', {
            level: 2,
            name: /desenvolvedora full stack/i,
        });
        expect(heading).toHaveAttribute('id', 'about-title');
    });

    it('conta a trajetória (Cubos → Clarke → autônoma e voluntariado)', () => {
        render(<AboutMe />);

        // Cada uma aparece 2x agora: na prosa da bio e na timeline de
        // experiência (Parte 2) — por isso getAllByText, não getByText.
        expect(screen.getAllByText(/cubos academy/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/clarke energia/i).length).toBeGreaterThan(
            0,
        );
        expect(
            screen.getByText(/ferramenta não é engenharia/i),
        ).toBeInTheDocument();
    });

    it('conta a história em cards, sem perder os fatos específicos', () => {
        render(<AboutMe />);

        // Fatos que já estiveram em risco de sumir numa versão anterior
        // (resumo genérico demais) — travados aqui de propósito.
        expect(
            screen.getByText(/visual basic, delphi, access/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/design system/i)).toBeInTheDocument();
        expect(screen.getByText(/python\/flask/i)).toBeInTheDocument();
        // "Estação Festas" e "2013–2020" também aparecem na timeline de
        // Experiência — por isso getAllByText, não getByText.
        expect(
            screen.getAllByText('Estação Festas Infantis').length,
        ).toBeGreaterThan(0);
        expect(screen.getAllByText('2013–2020').length).toBeGreaterThan(0);
    });

    it('mostra a foto de perfil ao lado do texto', () => {
        render(<AboutMe />);

        expect(
            screen.getByRole('img', { name: /retrato de leidejane da rosa/i }),
        ).toBeInTheDocument();
    });

    it('mostra a timeline de experiência com a mais recente primeiro', () => {
        render(<AboutMe />);

        const heading = screen.getByRole('heading', { name: 'Experiência' });
        expect(heading).toBeInTheDocument();

        // Escopado ao <ol> da timeline (não ao carrossel, que também tem
        // <li>): pega o primeiro <ol> da página — é o único.
        const { getAllByRole } = within(
            document.querySelector('ol') as HTMLElement,
        );
        const items = getAllByRole('listitem');
        expect(items[0]).toHaveTextContent('Faladoria');
        expect(items.at(-1)).toHaveTextContent('Estação Festas Infantis');
        // Voluntariado e monitoria entram na mesma linha do tempo que os
        // empregos — currículo, LinkedIn e README contam a mesma história.
        expect(items).toHaveLength(7);
        expect(items[2]).toHaveTextContent('SouJunior');
        expect(items[3]).toHaveTextContent('Monitora de Desenvolvimento');
    });

    it('mostra a formação acadêmica', () => {
        render(<AboutMe />);

        expect(
            screen.getByRole('heading', { name: 'Educação' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Técnico em Informática')).toBeInTheDocument();
        expect(
            screen.getByText(/universidade braz cubas — 2011–2013/i),
        ).toBeInTheDocument();
    });

    it('mostra os 10 cursos: 2 no celular (com botão) e todos a partir de md', async () => {
        const user = userEvent.setup();
        render(<AboutMe />);

        expect(
            screen.getByRole('heading', { name: 'Cursos' }),
        ).toBeInTheDocument();

        // "Curso Básico de Python" só existe na lista de cursos — "computação
        // em nuvem" não serve de âncora: o card "Hoje" também cita o termo.
        const courseList = screen
            .getAllByRole('list')
            .find((list) =>
                within(list).queryByText('Curso Básico de Python'),
            ) as HTMLElement;
        const items = within(courseList).getAllByRole('listitem');
        expect(items).toHaveLength(10);
        expect(items[0]).toHaveTextContent('Escola da Nuvem');

        // Ao lado da Experiência (md+), a lista inteira preenche a coluna; no
        // celular, só os 2 primeiros até expandir. A troca é CSS (a página é
        // pré-renderizada), então o teste confere as classes, não o layout.
        expect(items[1]).not.toHaveClass('hidden');
        for (const item of items.slice(2)) {
            expect(item).toHaveClass('hidden', 'md:block');
        }
        const expandButton = screen.getByRole('button', {
            name: 'Ver todos os cursos (10)',
        });
        expect(expandButton).toHaveClass('md:hidden');

        await user.click(expandButton);

        for (const item of within(courseList).getAllByRole('listitem')) {
            expect(item).not.toHaveClass('hidden');
        }
    });

    it('lista os cursos da WoMakersCode pelo nome da empresa', () => {
        render(<AboutMe />);

        expect(
            screen.getByText('Bootcamp Back-End Python e Django (130h)'),
        ).toBeInTheDocument();
        expect(screen.getAllByText(/^WoMakersCode — /)).toHaveLength(3);
        expect(screen.queryByText(/mais mulheres em tech/i)).toBeNull();
    });

    it('mostra o fluxo de tecnologias com as 3 colunas', () => {
        render(<AboutMe />);

        expect(screen.getByText('Front-end')).toBeInTheDocument();
        expect(screen.getByText('Back-end')).toBeInTheDocument();
        expect(screen.getByText('Dados')).toBeInTheDocument();

        // 14 nós no diagrama (5 front-end + 6 back-end + 3 dados) — exclui o
        // botão "Ver todos os cursos" (mesma role, botão diferente).
        const diagramButtons = screen
            .getAllByRole('button')
            .filter((button) => !button.textContent?.includes('Ver todos'));
        expect(diagramButtons).toHaveLength(14);
    });

    it('no desktop (xl), mostra as ferramentas paradas embaixo do quadro, no lugar do carrossel', () => {
        render(<AboutMe />);

        const staticList = screen.getByRole('list', {
            name: 'Outras ferramentas',
        });
        expect(within(staticList).getAllByRole('listitem')).toHaveLength(11);
        expect(staticList.closest('.xl\\:block')).toHaveClass('hidden');

        const carousel = screen.getByRole('list', {
            name: 'Outras ferramentas do dia a dia',
        });
        expect(carousel.closest('.xl\\:hidden')).not.toBeNull();
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

    // Timeout maior que o padrão (5s): a árvore cresceu (diagrama de 14 nós
    // + carrossel com 22 <li>, 11 reais + 11 da cópia decorativa) e o
    // axe-core escaneando tudo pode passar de 5s sob disputa de CPU (ex.:
    // rodando junto de outros arquivos no hook do Husky) — isolado, roda em
    // ~3.3s. Mesmo raciocínio já aplicado em app.test.tsx.
    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<AboutMe />);

        expect(await axe(container)).toHaveNoViolations();
    }, 15000);
});
