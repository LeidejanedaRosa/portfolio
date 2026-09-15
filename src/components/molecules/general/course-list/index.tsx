import { useId, useState } from 'react';

export interface CourseEntry {
    id: string;
    course: string;
    institution: string;
    period: string;
}

interface CourseListProps {
    entries: readonly CourseEntry[];
    /** Quantos cursos aparecem antes de precisar clicar em "ver todos". */
    initialCount?: number;
}

/**
 * Lista compacta de cursos/certificados — visualmente menor que
 * <EducationList /> de propósito: são muitos itens (credenciais pontuais),
 * não as 2-3 formações longas que a Educação mostra em destaque.
 *
 * "Mostrar mais" (não scroll interno): a lista é longa (a ordem já traz os
 * cursos de mais peso primeiro — quem entra na página já vê os principais),
 * e um scroll aninhado dentro de uma coluna cria a mesma dor de cabeça em
 * mobile que a gente já descartou pro Projetos (disputa de toque entre o
 * scroll da lista e o da página) — "mostrar mais" não tem esse problema.
 */
export const CourseList = ({ entries, initialCount = 4 }: CourseListProps) => {
    const [expanded, setExpanded] = useState(false);
    const listId = useId();
    const visible = expanded ? entries : entries.slice(0, initialCount);
    const hasMore = entries.length > initialCount;

    return (
        <>
            <ul id={listId} className="space-y-3">
                {visible.map((entry) => (
                    <li key={entry.id} className="text-sm">
                        <p className="font-medium text-foreground">
                            {entry.course}
                        </p>
                        <p className="text-muted-foreground">
                            {entry.institution} — {entry.period}
                        </p>
                    </li>
                ))}
            </ul>

            {hasMore && (
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    className="mt-3 font-mono text-sm text-accent hover:underline"
                >
                    {expanded
                        ? 'Mostrar menos'
                        : `Ver todos os cursos (${entries.length})`}
                </button>
            )}
        </>
    );
};
