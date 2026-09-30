import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Hook próprio em vez do `useReducedMotion` do Framer Motion: a lib guarda o
// valor inicial numa referência de módulo, então um `matchMedia` mockado
// *depois* que ela já carregou não é reconsultado — em teste, o mock nunca
// "pega". Este hook lê `matchMedia` a cada montagem, então responde de
// verdade. Compartilhado entre `SkillsFlow`, `Projects` e
// `ExperienceTimeline` — os três animam algo sincronizado ao scroll/tempo e
// precisam desligar isso do mesmo jeito.
export function usePrefersReducedMotion() {
    const [prefersReduced, setPrefersReduced] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(REDUCED_MOTION_QUERY).matches,
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
        const handleChange = (event: MediaQueryListEvent) =>
            setPrefersReduced(event.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReduced;
}
