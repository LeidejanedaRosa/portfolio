import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { EducationList, type EducationEntry } from './index';

const ENTRIES: EducationEntry[] = [
    {
        id: 'a',
        course: 'Técnico em Informática',
        institution: 'Colégio Instituto Batista Americano',
        period: '1997–2000',
    },
    {
        id: 'b',
        course: 'Gestão de Negócios',
        institution: 'Universidade Braz Cubas',
        period: '2011–2013',
    },
];

describe('<EducationList />', () => {
    it('lista curso, instituição e período de cada formação', () => {
        render(<EducationList entries={ENTRIES} />);

        expect(screen.getByText('Técnico em Informática')).toBeInTheDocument();
        expect(
            screen.getByText(
                /colégio instituto batista americano — 1997–2000/i,
            ),
        ).toBeInTheDocument();
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<EducationList entries={ENTRIES} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
