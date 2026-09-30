import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { CodeSnippet } from '@components/atoms/code-snippet';
import { TechIcon } from '@components/atoms/tech-icon';

import { type Project } from './data';

export function ProjectCard({
    project,
    index,
}: {
    project: Project;
    index: number;
}) {
    const number = String(index + 1).padStart(2, '0');

    return (
        // Fundo sólido: o fundo da seção é sticky, então todo card passa por
        // cima dos desenhos das bordas — e o accent (#0369A1) sobre o traço
        // mais escuro do fundo cai pra ~4.3:1, abaixo do AA.
        <BlueprintFrame className="h-full bg-background p-6">
            <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs text-accent">{number}</span>
                <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {project.visibility === 'private' ? 'Privado' : 'Público'}
                </span>
            </div>

            <h3 className="mt-3 font-mono text-lg font-bold text-foreground">
                {project.title}
            </h3>
            <p className="mt-2 text-muted-foreground">{project.summary}</p>
            <p className="mt-3 text-sm text-muted-foreground">
                {project.highlight}
            </p>

            <ul className="mt-6 flex flex-wrap gap-4">
                {project.stack.map((tech) => (
                    <TechIcon key={tech.title} icon={tech} />
                ))}
            </ul>

            {project.codeSnippet && (
                <details className="mt-6">
                    <summary className="cursor-pointer font-mono text-xs font-medium text-accent">
                        Ver trecho de código
                    </summary>
                    <div className="mt-3">
                        <CodeSnippet {...project.codeSnippet} />
                    </div>
                </details>
            )}

            {project.links && (
                <div className="mt-6 flex flex-wrap gap-3 pt-2">
                    {project.links.code && (
                        <a
                            href={project.links.code}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Ver código
                        </a>
                    )}
                    {project.links.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                        >
                            Ver site
                        </a>
                    )}
                </div>
            )}

            {project.demoNote && (
                <p className="mt-3 text-sm italic text-muted-foreground">
                    {project.demoNote}
                    {project.demoCode && (
                        <>
                            {' '}
                            <code className="break-all font-mono not-italic">
                                {project.demoCode}
                            </code>
                        </>
                    )}
                    {project.demoCode && ' pra testar a verificação.'}
                </p>
            )}
        </BlueprintFrame>
    );
}
