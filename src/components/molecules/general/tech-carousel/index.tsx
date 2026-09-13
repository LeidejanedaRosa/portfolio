import { type CSSProperties } from 'react';
import { type SimpleIcon } from 'simple-icons';

import { brandHoverColor } from '@src/lib/brand-hover-color';

export interface TechCarouselItem {
    /** Sem ícone pra práticas/metodologias sem marca (ex.: "Clean Code") —
     * ver comentário em about-me/index.tsx. */
    icon?: SimpleIcon;
    label: string;
}

interface TechCarouselProps {
    items: readonly TechCarouselItem[];
    /** Nome do grupo, anunciado por leitor de tela antes da lista. */
    label: string;
}

function CarouselBadge({
    item,
    hidden,
}: {
    item: TechCarouselItem;
    /** Cópia decorativa (a segunda metade, usada só pra fechar o loop visual). */
    hidden?: boolean;
}) {
    return (
        <li
            aria-hidden={hidden || undefined}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5"
        >
            {item.icon && (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 fill-muted-foreground transition-colors duration-200 group-hover:fill-[var(--brand-hover)]"
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
}

/**
 * Faixa horizontal rolando sozinha (inspirada na vitrine de tecnologias do
 * michaelpumo.com) pras ferramentas que a Leidejane usa mas que não são uma
 * etapa do pipeline representado no <SkillsFlow /> — não fazem sentido como
 * coluna ali (não "fluem" pra lugar nenhum, atravessam o stack inteiro).
 *
 * A lista é duplicada uma vez (a 2ª cópia com `aria-hidden`) e a animação
 * translada por -50% do próprio track — truque padrão de marquee CSS: ao
 * terminar exatamente uma cópia inteira, o quadro seguinte já é idêntico ao
 * primeiro, então o corte é imperceptível.
 *
 * `.marquee-fade` (index.css) esmaece as duas pontas com `mask-image` — não
 * uma camada colorida por cima tentando imitar o fundo (quebraria no dark
 * mode, ou em cima de qualquer fundo que não seja sólido); máscara CSS
 * funciona igual em qualquer fundo, sem precisar saber a cor por trás.
 */
export const TechCarousel = ({ items, label }: TechCarouselProps) => {
    return (
        <div className="marquee-fade w-full overflow-hidden">
            {/* tabIndex={0}: nada dentro da lista é focável (as badges são
                <li> puros, sem botão/link — de propósito, não têm ação),
                então sem isso o :focus-within do index.css nunca dispara e
                quem navega só por teclado não tem NENHUM jeito de pausar a
                animação (o hover cobre só o mouse). Com o próprio <ul>
                focável, Tab chega até ele, :focus-within pausa, e o anel de
                foco visível já vem de graça do :focus-visible global
                (index.css). */}
            <ul
                aria-label={label}
                tabIndex={0}
                className="marquee-track flex w-max gap-3"
            >
                {items.map((item) => (
                    <CarouselBadge key={item.label} item={item} />
                ))}
                {items.map((item) => (
                    <CarouselBadge
                        key={`loop-${item.label}`}
                        item={item}
                        hidden
                    />
                ))}
            </ul>
        </div>
    );
};
