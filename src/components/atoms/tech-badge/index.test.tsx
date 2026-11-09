import { render, screen } from '@testing-library/react';
import { siGit } from 'simple-icons';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { TechBadge } from './index';

const renderInList = (ui: React.ReactElement) => render(<ul>{ui}</ul>);

describe('<TechBadge />', () => {
    it('mostra o nome da ferramenta com o ícone decorativo da marca', () => {
        const { container } = renderInList(
            <TechBadge item={{ icon: siGit, label: 'Git' }} />,
        );

        expect(screen.getByRole('listitem')).toHaveTextContent('Git');
        const icon = container.querySelector('svg');
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon?.querySelector('path')).toHaveAttribute('d', siGit.path);
    });

    it('sem ícone para práticas sem marca (ex.: Clean Code)', () => {
        const { container } = renderInList(
            <TechBadge item={{ label: 'Clean Code' }} />,
        );

        expect(screen.getByText('Clean Code')).toBeInTheDocument();
        expect(container.querySelector('svg')).toBeNull();
    });

    it('cópia decorativa fica fora da árvore de acessibilidade', () => {
        renderInList(<TechBadge item={{ label: 'Git' }} hidden />);

        expect(screen.queryByRole('listitem')).toBeNull();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = renderInList(
            <TechBadge item={{ icon: siGit, label: 'Git' }} />,
        );
        expect(await axe(container)).toHaveNoViolations();
    });
});
