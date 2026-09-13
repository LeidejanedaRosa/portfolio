import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { siCypress, siGit, siGithubactions, siPytest } from 'simple-icons';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { TechCarousel } from './index';

const ITEMS = [
    { icon: siCypress, label: 'Cypress' },
    { icon: siPytest, label: 'Pytest' },
    { icon: siGit, label: 'Git' },
    { icon: siGithubactions, label: 'GitHub Actions' },
];

describe('<TechCarousel />', () => {
    it('lista as ferramentas com nome acessível', () => {
        render(<TechCarousel items={ITEMS} label="Outras ferramentas" />);

        const list = screen.getByRole('list', { name: 'Outras ferramentas' });
        expect(list).toBeInTheDocument();

        // 4 itens acessíveis — a cópia duplicada pro loop visual (abaixo)
        // fica de fora da árvore de acessibilidade, então dá pra usar
        // getAllByRole com segurança (o mesmo texto existe 2x no DOM, mas só
        // 1x na árvore de acessibilidade — getByText direto pegaria as duas
        // e quebraria por "múltiplos elementos encontrados").
        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(ITEMS.length);
        expect(within(items[0]).getByText('Cypress')).toBeInTheDocument();
        expect(
            within(items[3]).getByText('GitHub Actions'),
        ).toBeInTheDocument();
    });

    it('duplica a lista pro loop visual, mas a cópia não é lida por leitor de tela', () => {
        const { container } = render(
            <TechCarousel items={ITEMS} label="Outras ferramentas" />,
        );

        // no DOM: original + cópia = o dobro. Na árvore de acessibilidade
        // (testada acima via getAllByRole): só os originais.
        expect(container.querySelectorAll('li')).toHaveLength(ITEMS.length * 2);
    });

    it('mostra um item sem ícone (prática/metodologia sem marca, ex.: Clean Code)', () => {
        const { container } = render(
            <TechCarousel
                items={[{ label: 'Clean Code' }]}
                label="Outras ferramentas"
            />,
        );

        const [item] = screen.getAllByRole('listitem');
        expect(within(item).getByText('Clean Code')).toBeInTheDocument();
        // sem ícone: nenhum <svg> renderizado dentro do badge
        expect(container.querySelector('li svg')).not.toBeInTheDocument();
    });

    it('a animação fica na classe marquee-track — pausa em hover/foco e em prefers-reduced-motion via CSS (ver index.css)', () => {
        const { container } = render(
            <TechCarousel items={ITEMS} label="Outras ferramentas" />,
        );

        // jsdom não computa CSS real (a folha do Tailwind não é carregada
        // nos testes), então não dá pra checar `animation-play-state`
        // calculado — mesma limitação já documentada em
        // skill-node/index.test.tsx. A trava possível aqui é garantir que a
        // classe que a regra do index.css mira continua no elemento certo.
        const track = container.querySelector('ul');
        expect(track).toHaveClass('marquee-track');
    });

    it('a lista é alcançável por teclado, pra quem não usa mouse conseguir pausar (WCAG 2.2.2)', async () => {
        const user = userEvent.setup();
        render(<TechCarousel items={ITEMS} label="Outras ferramentas" />);

        // As badges são <li> sem botão/link (de propósito — não têm ação),
        // então sem o próprio <ul> ser focável o :focus-within do
        // index.css nunca dispara pra quem navega só por teclado (só o
        // hover do mouse pausava antes desse fix).
        const list = screen.getByRole('list', { name: 'Outras ferramentas' });
        await user.tab();

        expect(list).toHaveFocus();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(
            <TechCarousel items={ITEMS} label="Outras ferramentas" />,
        );
        expect(await axe(container)).toHaveNoViolations();
    });
});
