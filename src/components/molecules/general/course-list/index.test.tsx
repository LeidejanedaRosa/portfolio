import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { CourseList, type CourseEntry } from './index';

const ENTRIES: CourseEntry[] = [
    {
        id: 'a',
        course: 'Clean Code',
        institution: 'Rocketseat',
        period: 'fev 2024',
    },
    {
        id: 'b',
        course: 'Curso Básico de Python',
        institution: 'Solyd Offensive Security',
        period: 'mai 2023',
    },
];

const MANY_ENTRIES: CourseEntry[] = [
    ...ENTRIES,
    { id: 'c', course: 'Git', institution: 'Coodesh', period: 'fev 2024' },
    {
        id: 'd',
        course: 'GitHub',
        institution: 'Coodesh',
        period: 'fev 2024',
    },
    { id: 'e', course: 'React', institution: 'Coodesh', period: 'mar 2023' },
];

describe('<CourseList />', () => {
    it('lista curso, instituição e período de cada certificado', () => {
        render(<CourseList entries={ENTRIES} />);

        expect(screen.getByText('Clean Code')).toBeInTheDocument();
        expect(screen.getByText(/rocketseat — fev 2024/i)).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('sem botão "ver todos" quando cabe tudo dentro do initialCount', () => {
        render(<CourseList entries={ENTRIES} initialCount={4} />);

        expect(
            screen.queryByRole('button', { name: /ver todos/i }),
        ).not.toBeInTheDocument();
    });

    it('mostra só initialCount itens, com botão pra expandir o resto', async () => {
        const user = userEvent.setup();
        render(<CourseList entries={MANY_ENTRIES} initialCount={2} />);

        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        const expandButton = screen.getByRole('button', {
            name: 'Ver todos os cursos (5)',
        });
        expect(expandButton).toHaveAttribute('aria-expanded', 'false');

        await user.click(expandButton);

        expect(screen.getAllByRole('listitem')).toHaveLength(5);
        expect(
            screen.getByRole('button', { name: 'Mostrar menos' }),
        ).toHaveAttribute('aria-expanded', 'true');
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<CourseList entries={ENTRIES} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
