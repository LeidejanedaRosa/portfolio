import { useId, type CSSProperties } from 'react';
import { type SimpleIcon } from 'simple-icons';

import { brandHoverColor } from '@src/lib/brand-hover-color';

interface SkillNodeProps {
    icon: SimpleIcon;
    label?: string;
    /** Posição no diagrama (left/top em %, ver <SkillsFlow />). */
    style?: CSSProperties;
}

/**
 * Nó de uma skill no fluxo de tecnologias: ícone monocromático que ganha cor
 * da marca e aumenta no hover/foco, com tooltip mostrando o nome. Posicionado
 * de forma absoluta pelo componente pai (`style` vem de fora).
 */
export const SkillNode = ({ icon, label, style }: SkillNodeProps) => {
    const name = label ?? icon.title;
    const tooltipId = useId();

    return (
        <div
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={style}
        >
            <button
                type="button"
                aria-labelledby={tooltipId}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface transition-transform duration-200 hover:scale-125 focus-visible:scale-125 motion-reduce:transition-none sm:h-11 sm:w-11"
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-muted-foreground transition-colors duration-200 group-hover:fill-[var(--skill-hover)] group-focus-within:fill-[var(--skill-hover)] sm:h-5 sm:w-5"
                    style={
                        {
                            '--skill-hover': brandHoverColor(icon.hex),
                        } as CSSProperties
                    }
                >
                    <path d={icon.path} />
                </svg>
            </button>

            <span
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 font-mono text-xs text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
            >
                {name}
            </span>
        </div>
    );
};
