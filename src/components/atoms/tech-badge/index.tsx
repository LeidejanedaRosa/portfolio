import { type CSSProperties } from 'react';
import { type SimpleIcon } from 'simple-icons';

import { brandHoverColor } from '@src/lib/brand-hover-color';

export interface TechBadgeItem {
    /** Sem ícone pra práticas/metodologias sem marca (ex.: "Clean Code"). */
    icon?: SimpleIcon;
    label: string;
}

interface TechBadgeProps {
    item: TechBadgeItem;
    /** Cópia decorativa, escondida de leitor de tela (ex.: o loop do carrossel). */
    hidden?: boolean;
}

/** Etiqueta de ferramenta (ícone + nome) — usada pelo carrossel e pela lista fixa. */
export const TechBadge = ({ item, hidden }: TechBadgeProps) => (
    <li
        aria-hidden={hidden || undefined}
        className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5"
    >
        {item.icon && (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-muted-foreground transition-colors duration-200 group-hover:fill-(--brand-hover)"
                style={
                    {
                        '--brand-hover': brandHoverColor(item.icon.hex),
                    } as CSSProperties
                }
            >
                <path d={item.icon.path} />
            </svg>
        )}
        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
            {item.label}
        </span>
    </li>
);
