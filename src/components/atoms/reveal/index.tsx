import { m } from 'framer-motion';
import { type ReactNode } from 'react';

import { REVEAL_FADE_UP } from '@src/lib/reveal-variants';
import { usePrefersReducedMotion } from '@src/lib/use-prefers-reduced-motion';

interface RevealProps {
    children: ReactNode;
    className?: string;
}

/**
 * Revela o conteúdo com um fade + leve deslocamento pra cima, uma vez, ao
 * entrar na viewport (`whileInView`, não preso ao scroll como as timelines
 * de Projetos/Experiência — aqui é só "apareceu" ou "não apareceu").
 * Com prefers-reduced-motion, não reduz a amplitude: renderiza estático, sem
 * depender de `whileInView` disparar — conteúdo nunca fica escondido atrás
 * de uma condição de scroll.
 */
export const Reveal = ({ children, className }: RevealProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <m.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={REVEAL_FADE_UP}
        >
            {children}
        </m.div>
    );
};
