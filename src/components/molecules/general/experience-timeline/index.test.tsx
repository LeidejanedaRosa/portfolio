import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ExperienceTimeline, type TimelineEntry } from './index';

const ENTRIES: TimelineEntry[] = [
    {
        id: 'a',
        period: '2013–2020',
        role: 'Empreendedora',
        org: 'Estação Festas',
    },
    {
        id: 'b',
        period: 'mar 2025 – atual',
        role: 'Freelancer',
        org: 'Projetos próprios',
        description: 'Impacto social',
    },
];

describe('<ExperienceTimeline />', () => {
    it('lista as experiências em ordem, como uma sequência cronológica real', () => {
        render(<ExperienceTimeline entries={ENTRIES} />);

        const list = screen.getByRole('list');
        const items = screen.getAllByRole('listitem');
        expect(list.tagName).toBe('OL');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Estação Festas');
        expect(items[1]).toHaveTextContent('Freelancer');
    });

    it('mostra a descrição quando fornecida', () => {
        render(<ExperienceTimeline entries={ENTRIES} />);

        expect(screen.getByText('Impacto social')).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<ExperienceTimeline entries={ENTRIES} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
