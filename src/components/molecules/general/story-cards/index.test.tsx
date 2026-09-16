import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { GiftIcon, GraduationCapIcon } from './icons';
import { StoryCards, type StoryCardEntry } from './index';

const ENTRIES: StoryCardEntry[] = [
    {
        id: 'a',
        title: 'Formação',
        icon: GraduationCapIcon,
        text: 'Técnico de Informática, depois Gestão de Negócios.',
    },
    {
        id: 'b',
        title: 'Estação Festas',
        icon: GiftIcon,
        period: '2013–2020',
        text: 'Empreendedora: clientes, operação, logística, marketing e gestão do negócio.',
    },
];

describe('<StoryCards />', () => {
    it('mostra um ícone e o título de cada fase (sem numeração — não é um ranking)', () => {
        const { container } = render(<StoryCards entries={ENTRIES} />);

        expect(screen.getByText('Formação')).toBeInTheDocument();
        expect(screen.getByText('Estação Festas')).toBeInTheDocument();
        expect(container.querySelectorAll('svg')).toHaveLength(2);
        expect(screen.queryByText('01')).not.toBeInTheDocument();
    });

    it('mostra o período só quando fornecido', () => {
        render(<StoryCards entries={ENTRIES} />);

        expect(screen.getByText('2013–2020')).toBeInTheDocument();
        // O 1º card não tem period — só 1 ocorrência no total.
        expect(screen.getAllByText(/–/)).toHaveLength(1);
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<StoryCards entries={ENTRIES} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
