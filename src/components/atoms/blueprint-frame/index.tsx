import { type ReactNode } from 'react';

interface BlueprintFrameProps {
    children: ReactNode;
    /** Grade de papel milimetrado atrás do conteúdo. */
    grid?: boolean;
    className?: string;
}

/**
 * Moldura de "planta técnica": borda fina + marcas de registro nos 4 cantos
 * (como um desenho de arquitetura). Puramente decorativa — o conteúdo real
 * vai em `children`.
 */
export const BlueprintFrame = ({
    children,
    grid = false,
    className = '',
}: BlueprintFrameProps) => {
    const corner = 'pointer-events-none absolute h-2.5 w-2.5 border-accent';

    return (
        <div className={`relative border border-border ${className}`}>
            <span
                aria-hidden="true"
                className={`${corner} -left-px -top-px border-l-2 border-t-2`}
            />
            <span
                aria-hidden="true"
                className={`${corner} -right-px -top-px border-r-2 border-t-2`}
            />
            <span
                aria-hidden="true"
                className={`${corner} -bottom-px -left-px border-b-2 border-l-2`}
            />
            <span
                aria-hidden="true"
                className={`${corner} -bottom-px -right-px border-b-2 border-r-2`}
            />

            {grid && (
                <div
                    aria-hidden="true"
                    className="blueprint-grid pointer-events-none absolute inset-0"
                />
            )}

            <div className="relative">{children}</div>
        </div>
    );
};
