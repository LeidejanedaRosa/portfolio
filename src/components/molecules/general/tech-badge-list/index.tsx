import { TechBadge, type TechBadgeItem } from '@components/atoms/tech-badge';

interface TechBadgeListProps {
    items: readonly TechBadgeItem[];
    /** Id do título visível que nomeia a lista pra leitor de tela. */
    labelledBy: string;
}

/**
 * Versão parada do <TechCarousel />: as mesmas etiquetas, quebrando linha.
 * Serve onde existe espaço pra mostrar tudo de uma vez (a 3ª coluna do Sobre,
 * no desktop) — ali a animação só esconderia itens que cabem na tela.
 */
export const TechBadgeList = ({ items, labelledBy }: TechBadgeListProps) => (
    <ul aria-labelledby={labelledBy} className="flex flex-wrap gap-3">
        {items.map((item) => (
            <TechBadge key={item.label} item={item} />
        ))}
    </ul>
);
