import { type Variants } from 'framer-motion';

/** Fade + leve deslocamento pra cima — usado tanto sozinho (`<Reveal />`)
 * quanto como item dentro de um grupo com stagger (`<RevealListItem />`). */
export const REVEAL_FADE_UP: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

/** Container de uma lista com `<RevealListItem />`: não anima nada sozinho,
 * só escalona (`staggerChildren`) o `visible` dos filhos quando ele mesmo
 * entra em `visible`. */
export const REVEAL_STAGGER_CONTAINER: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};
