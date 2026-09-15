import { type SVGProps } from 'react';

/**
 * Ícones de linha simples (mesmo peso visual em todos: stroke 1.5,
 * geométrico) pra cada fase da história — sem depender de biblioteca
 * externa, o `simple-icons` do projeto é só pra logos de marca.
 */

function IconBase(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        />
    );
}

export function GraduationCapIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <IconBase {...props}>
            <path d="M12 4 2 9l10 5 10-5-10-5Z" />
            <path d="M6 11.5V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" />
            <path d="M22 9v6" />
        </IconBase>
    );
}

export function GiftIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <IconBase {...props}>
            <rect x="4" y="9" width="16" height="11" rx="1" />
            <path d="M4 13h16" />
            <path d="M12 9v11" />
            <path d="M12 9c-1.5-3-4-4-4-2s2 2 4 2Z" />
            <path d="M12 9c1.5-3 4-4 4-2s-2 2-4 2Z" />
        </IconBase>
    );
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <IconBase {...props}>
            <path d="M4 12a8 8 0 0 1 14-5.3" />
            <path d="M20 12a8 8 0 0 1-14 5.3" />
            <path d="M18 4v4h-4" />
            <path d="M6 20v-4h4" />
        </IconBase>
    );
}

export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <IconBase {...props}>
            <rect x="3" y="8" width="18" height="12" rx="1.5" />
            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M3 13h18" />
        </IconBase>
    );
}

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <IconBase {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="m15 9-2 5-5 2 2-5 5-2Z" />
        </IconBase>
    );
}
