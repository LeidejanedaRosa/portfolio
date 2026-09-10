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

        const observer = new IntersectionObserver(
            (entries) => {
                const mostVisible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) => b.intersectionRatio - a.intersectionRatio,
                    )[0];

                if (mostVisible) {
                    setActive(mostVisible.target.id);
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
