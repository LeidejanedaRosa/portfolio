export interface EducationEntry {
    id: string;
    course: string;
    institution: string;
    period: string;
}

interface EducationListProps {
    entries: readonly EducationEntry[];
}

/**
 * `<dl>` (curso = termo, instituição/período = descrição) — par
 * termo/descrição é exatamente o que essa marcação existe pra representar.
 */
export const EducationList = ({ entries }: EducationListProps) => {
    return (
        <dl className="space-y-4">
            {entries.map((entry) => (
                <div key={entry.id}>
                    <dt className="font-mono text-lg font-semibold text-foreground">
                        {entry.course}
                    </dt>
                    <dd className="text-sm text-muted-foreground">
                        {entry.institution} — {entry.period}
                    </dd>
                </div>
            ))}
        </dl>
    );
};
