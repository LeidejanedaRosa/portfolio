export interface TimelineEntry {
    id: string;
    period: string;
    role: string;
    org: string;
    description?: string;
}

interface ExperienceTimelineProps {
    entries: readonly TimelineEntry[];
}

/**
 * Linha do tempo vertical — a ordem (mais recente primeiro ou mais antigo
 * primeiro) é decidida por quem monta `entries`, não por este componente.
 * `<ol>` de verdade, não uma div genérica: é uma sequência cronológica
 * real, não uma lista sem ordem.
 */
export const ExperienceTimeline = ({ entries }: ExperienceTimelineProps) => {
    return (
        <ol className="relative border-l border-border pl-6">
            {entries.map((entry) => (
                <li key={entry.id} className="relative pb-8 last:pb-0">
                    {/* Marcador sobre a linha — puramente decorativo, o
                        conteúdo textual já carrega toda a informação. */}
                    <span
                        aria-hidden="true"
                        className="absolute -left-[1.80rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background"
                    />
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {entry.period}
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                        {entry.role}
                    </p>
                    <p className="text-sm text-muted-foreground">{entry.org}</p>
                    {entry.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {entry.description}
                        </p>
                    )}
                </li>
            ))}
        </ol>
    );
};
