import { type CSSProperties } from 'react';
import { type SimpleIcon } from 'simple-icons';

interface TechIconProps {
    icon: SimpleIcon;
    label?: string;
}

/**
 * Marcas quase pretas ou quase brancas somem no tema oposto — nesses casos
 * o hover usa o accent em vez da cor da marca.
 */
function hoverColor(hex: string): string {
    const value = parseInt(hex, 16);
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance < 0.12 || luminance > 0.9
        ? 'rgb(var(--color-accent))'
        : `#${hex}`;
}

/** Logo de tecnologia monocromático que ganha a cor da marca no hover. */
export const TechIcon = ({ icon, label }: TechIconProps) => {
    const name = label ?? icon.title;

    return (
        <li className="group flex flex-col items-center gap-2 text-center">
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8 fill-muted-foreground transition-colors duration-200 group-hover:fill-[var(--tech-hover)]"
                style={
                    { '--tech-hover': hoverColor(icon.hex) } as CSSProperties
                }
            >
                <path d={icon.path} />
            </svg>
            <span className="text-xs text-muted-foreground">{name}</span>
        </li>
    );
};
