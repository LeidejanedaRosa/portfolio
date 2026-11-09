import { render, screen, within } from '@testing-library/react';
import { siCypress, siGit } from 'simple-icons';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { TechBadgeList } from './index';

const ITEMS = [
    { icon: siCypress, label: 'Cypress' },
    { icon: siGit, label: 'Git' },
    { label: 'SOLID' },
];

const renderWithTitle = () =>
    render(
        <>
            <h3 id="tools-title">Outras ferramentas</h3>
            <TechBadgeList items={ITEMS} labelledBy="tools-title" />
        </>,
    );

describe('<TechBadgeList />', () => {
    it('é nomeada pelo título visível e lista cada ferramenta uma única vez', () => {
        renderWithTitle();

        const list = screen.getByRole('list', { name: 'Outras ferramentas' });
        const items = within(list).getAllByRole('listitem');
        // Diferente do carrossel, não existe cópia para loop: cada item 1x.
        expect(items).toHaveLength(ITEMS.length);
        expect(list.querySelectorAll('li')).toHaveLength(ITEMS.length);
        expect(items.map((item) => item.textContent)).toEqual([
            'Cypress',
            'Git',
            'SOLID',
        ]);
    });

    it('quebra linha em vez de rolar', () => {
        renderWithTitle();

        expect(screen.getByRole('list')).toHaveClass('flex-wrap');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderWithTitle();
        expect(await axe(container)).toHaveNoViolations();
    });
});
