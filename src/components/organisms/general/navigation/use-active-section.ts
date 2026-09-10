import { useEffect, useState } from 'react';

/**
 * Observa as seções (`<section id>`) e devolve o id daquela que está em foco
 * no viewport — para o scroll spy da navegação.
 *
 * `ids` precisa ser referência ESTÁVEL (constante de módulo), senão o efeito
 * re-executa a cada render.
 */
export function useActiveSection(ids: readonly string[]): string {
    const [active, setActive] = useState<string>(ids[0] ?? '');

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        // O IntersectionObserver só reporta as seções que MUDARAM de estado.
        // Guardamos a última razão de visibilidade de cada uma e escolhemos a
        // ativa olhando o quadro completo — senão uma seção pouco visível que
        // aparece no callback substituiria outra mais visível que não mudou.
        const visibility = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visibility.set(
                        entry.target.id,
                        entry.isIntersecting ? entry.intersectionRatio : 0,
                    );
                }

                let bestId = '';
                let bestRatio = 0;
                for (const [id, ratio] of visibility) {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = id;
                    }
                }

                if (bestId) {
                    setActive(bestId);
                }
            },
            // Banda estreita no terço superior: a seção fica "ativa" quando
            // seu conteúdo entra nessa faixa, não quando só encosta na tela.
            { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.5, 1] },
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ids]);

    return active;
}
