import { type CSSProperties } from 'react';
import { type SimpleIcon } from 'simple-icons';

import { brandHoverColor } from '@src/lib/brand-hover-color';

interface TechIconProps {
    icon: SimpleIcon;
    label?: string;
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
                    {
                        '--tech-hover': brandHoverColor(icon.hex),
                    } as CSSProperties
                }
            >
                <path d={icon.path} />
            </svg>
            <span className="text-xs text-muted-foreground">{name}</span>
        </li>
    );
};
