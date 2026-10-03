interface DimensionLineProps {
    className?: string;
}

/**
 * Linha de cota: um traço fino com uma marca perpendicular em cada ponta
 * (como a anotação de medida de um desenho técnico). Puramente decorativa —
 * mesmo vocabulário visual das marcas de canto do `<BlueprintFrame />`.
 */
export const DimensionLine = ({ className = '' }: DimensionLineProps) => {
    return (
        <div
            aria-hidden="true"
            className={`relative h-px bg-border ${className}`}
        >
            <span className="absolute -top-1 left-0 h-2 w-px bg-border" />
            <span className="absolute -top-1 right-0 h-2 w-px bg-border" />
        </div>
    );
};
