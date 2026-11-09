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

    describe('expandedFromMd', () => {
        it('deixa todos os itens no HTML e esconde só no celular os que passam do initialCount', () => {
            render(
                <CourseList
                    entries={MANY_ENTRIES}
                    initialCount={2}
                    expandedFromMd
                />,
            );

            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(5);
            expect(items[0]).not.toHaveClass('hidden');
            expect(items[1]).not.toHaveClass('hidden');
            for (const item of items.slice(2)) {
                expect(item).toHaveClass('hidden', 'md:block');
            }
        });

        it('mostra o botão só no celular, e expandir revela todos', async () => {
            const user = userEvent.setup();
            render(
                <CourseList
                    entries={MANY_ENTRIES}
                    initialCount={2}
                    expandedFromMd
                />,
            );

            const expandButton = screen.getByRole('button', {
                name: 'Ver todos os cursos (5)',
            });
            expect(expandButton).toHaveClass('md:hidden');

            await user.click(expandButton);

            for (const item of screen.getAllByRole('listitem')) {
                expect(item).not.toHaveClass('hidden');
            }
            expect(
                screen.getByRole('button', { name: 'Mostrar menos' }),
            ).toHaveAttribute('aria-expanded', 'true');
        });

        it('sem a prop, os itens além do initialCount nem entram no HTML', () => {
            render(<CourseList entries={MANY_ENTRIES} initialCount={2} />);

            expect(
                screen.getByRole('list').querySelectorAll('li'),
            ).toHaveLength(2);
            expect(
                screen.getByRole('button', { name: /ver todos/i }),
            ).not.toHaveClass('md:hidden');
        });
    });

    it('não tem violações de acessibilidade', async () => {
        const { container } = render(<CourseList entries={ENTRIES} />);
        expect(await axe(container)).toHaveNoViolations();
    });
});
