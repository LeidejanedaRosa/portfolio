import { m } from 'framer-motion';
import { type ReactNode } from 'react';

import {
    REVEAL_FADE_UP,
    REVEAL_STAGGER_CONTAINER,
} from '@src/lib/reveal-variants';
import { usePrefersReducedMotion } from '@src/lib/use-prefers-reduced-motion';

interface RevealListProps {
    children: ReactNode;
    className?: string;
}

/**
 * `<ul>` que escalona a entrada dos `<RevealListItem />` filhos ao entrar na
 * viewport — mesma ideia do `<Reveal />`, mas pra um grupo (stagger), não um
 * bloco só. Continua `<ul>` de verdade (não um `<div>` genérico): a lista
 * semântica não muda, só ganha orquestração de entrada.
 */
export const RevealList = ({ children, className }: RevealListProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <ul className={className}>{children}</ul>;
    }

    return (
        <m.ul
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={REVEAL_STAGGER_CONTAINER}
        >
            {children}
        </m.ul>
    );
};

/**
 * Item de um `<RevealList />`. Sem `initial`/`whileInView` própria — herda a
 * orquestração do pai (Framer Motion propaga `variants` pra filhos sem
 * controle de animação próprio), daí o stagger.
 */
export const RevealListItem = ({ children, className }: RevealListProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <li className={className}>{children}</li>;
    }

    return (
        <m.li className={className} variants={REVEAL_FADE_UP}>
            {children}
        </m.li>
    );
};
