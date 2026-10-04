import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Mede um elemento (via `onMeasure`) antes do primeiro paint e de novo
 * sempre que ele muda de tamanho. Sem `ResizeObserver` no navegador (raro
 * hoje): mede uma vez no mount e segue sem observar, em vez de quebrar o
 * app inteiro. Compartilhado entre `<Layout />` (publica `--nav-height`),
 * `<Projects />` e `<ExperienceTimeline />` (as duas remedem a timeline
 * quando a lista muda de altura, ex.: um `<details>` de código abre/fecha)
 * — mesmo padrão duplicado quase palavra por palavra nos três antes
 * (achado da auditoria de 2026-10).
 *
 * `onMeasure` não entra no array de dependências do efeito (só `targetRef`,
 * uma referência estável entre renders — o efeito roda uma vez só, igual
 * antes da extração): guardar a versão mais recente numa ref evita exigir
 * que quem chama memoize o callback com `useCallback` pra não disparar o
 * efeito de novo a cada render.
 */
export function useResizeObserver<T extends Element>(
    targetRef: RefObject<T | null>,
    onMeasure: (element: T) => void,
) {
    const onMeasureRef = useRef(onMeasure);
    onMeasureRef.current = onMeasure;

    useLayoutEffect(() => {
        const element = targetRef.current;
        if (!element) return;

        const measure = () => onMeasureRef.current(element);
        measure();

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [targetRef]);
}
