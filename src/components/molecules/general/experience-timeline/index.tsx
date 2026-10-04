import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

import { READING_LINE_OFFSET } from '@src/lib/reading-line';
import { usePrefersReducedMotion } from '@src/lib/use-prefers-reduced-motion';

export interface TimelineEntry {
    id: string;
    period: string;
    role: string;
    org: string;
    description?: string;
}

interface ExperienceTimelineProps {
    entries: readonly TimelineEntry[];
}

// Opacidade mínima das entradas fora do "foco" da luz — não mais baixo que
// isso: confirmado com axe-core num Chromium real (não a simulação do jsdom,
// que não calcula contraste de opacidade direito) que `text-muted-foreground`
// esmaecido abaixo disso quebra WCAG AA nos dois temas — mesma lição do FAQ.
const DIM_OPACITY = 0.9;

function TimelineEntryRow({
    entry,
    index,
    markerRef,
    thresholds,
    scrollYProgress,
    prefersReducedMotion,
}: Readonly<{
    entry: TimelineEntry;
    index: number;
    markerRef: (el: HTMLSpanElement | null) => void;
    /** Posição (fração 0–1 da altura da lista) do marcador de cada
     * entrada, medida em `ExperienceTimeline`. Cada linha lê a sua e a das
     * vizinhas pra montar o "pico" triangular de destaque centrado na
     * própria. */
    thresholds: readonly number[];
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}>) {
    const threshold = thresholds[index] ?? 1;
    const prevThreshold = thresholds[index - 1];
    const nextThreshold = thresholds[index + 1];

    // "Pico" triangular centrado no threshold desta entrada: sobe de 0 (nas
    // vizinhanças da entrada anterior) até 1 exatamente no seu threshold, e
    // desce de volta a 0 (nas vizinhanças da próxima) — sem entrada anterior
    // (primeira) ou seguinte (última), o platô fica em 1 até a borda da
    // lista, então elas começam/terminam já em destaque.
    const activity = useTransform(
        scrollYProgress,
        [prevThreshold ?? 0, threshold, nextThreshold ?? 1],
        [
            prevThreshold === undefined ? 1 : 0,
            1,
            nextThreshold === undefined ? 1 : 0,
        ],
        { clamp: true },
    );
    const opacity = useTransform(activity, [0, 1], [DIM_OPACITY, 1]);

    return (
        <li className="relative pb-8 last:pb-0">
            {/* Marcador sobre a linha — puramente decorativo, o conteúdo
                textual já carrega toda a informação. */}
            <span
                ref={markerRef}
                aria-hidden="true"
                className="absolute left-[-1.8rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background"
            >
                {prefersReducedMotion ? (
                    <span className="absolute inset-0.5 rounded-full bg-accent" />
                ) : (
                    <m.span
                        style={{ scale: activity }}
                        className="absolute inset-0.5 rounded-full bg-accent"
                    />
                )}
            </span>

            <m.div style={prefersReducedMotion ? undefined : { opacity }}>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {entry.period}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                    {entry.role}
                </p>
                <p className="text-sm text-muted-foreground">{entry.org}</p>
                {entry.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {entry.description}
                    </p>
                )}
            </m.div>
        </li>
    );
}

/**
 * Linha do tempo vertical — a ordem (mais recente primeiro ou mais antigo
 * primeiro) é decidida por quem monta `entries`, não por este componente.
 * `<ol>` de verdade, não uma div genérica: é uma sequência cronológica
 * real, não uma lista sem ordem.
 *
 * Uma "luz" desce a linha acompanhando o scroll real (mesmo mecanismo de
 * `<Projects />`) e a entrada mais próxima dela ganha destaque, as outras
 * esmaecem — inspirado na seção Experiências de joaofortes.dev, adaptado ao
 * visual Swiss/blueprint do resto do site em vez do skin dele.
 */
export const ExperienceTimeline = ({ entries }: ExperienceTimelineProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const listRef = useRef<HTMLOListElement>(null);
    const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
    // 1 (não 0) pra toda entrada: antes da primeira medição, deixa o pico de
    // destaque de todo mundo fora do alcance do progresso real no primeiro
    // paint — senão o marcador da última entrada piscaria preenchido.
    const [thresholds, setThresholds] = useState<number[]>(() =>
        entries.map(() => 1),
    );

    const { scrollYProgress } = useScroll({
        target: listRef,
        offset: READING_LINE_OFFSET,
    });
    // Luz presa entre o primeiro e o último marcador: sem isso ela repousaria
    // no topo/fim da <ol>, alguns pixels fora da bolinha de cada ponta.
    const firstMarker = thresholds[0] ?? 0;
    const lastMarker = thresholds.at(-1) ?? 1;
    const lightTop = useTransform(
        scrollYProgress,
        [firstMarker, lastMarker],
        [`${firstMarker * 100}%`, `${lastMarker * 100}%`],
        { clamp: true },
    );

    // Mesmo padrão de `<Projects />`: mede antes do primeiro paint
    // (`useLayoutEffect`) e reage a mudança de altura da lista via
    // `ResizeObserver`, não só ao resize da janela.
    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;

        function measure(ol: HTMLOListElement) {
            const listHeight = ol.offsetHeight;
            if (!listHeight) return;

            // Centro do marcador, não do <li>: o marcador fica no topo da
            // entrada, e é ali que a luz precisa cruzar pra acender. Os
            // `offsetTop` somados (marcador dentro do <li>, <li> dentro da
            // <ol>) ignoram transform de animação, ao contrário de
            // `getBoundingClientRect`.
            setThresholds(
                markerRefs.current.map((marker) => {
                    const li = marker?.offsetParent;
                    if (!marker || !(li instanceof HTMLElement)) return 1;
                    return (
                        (li.offsetTop +
                            marker.offsetTop +
                            marker.offsetHeight / 2) /
                        listHeight
                    );
                }),
            );
        }

        measure(list);

        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(() => measure(list));
        observer.observe(list);
        return () => observer.disconnect();
    }, []);

    return (
        <ol ref={listRef} className="relative border-l border-border pl-6">
            {!prefersReducedMotion && (
                <m.span
                    aria-hidden="true"
                    style={{
                        top: lightTop,
                        filter: 'drop-shadow(0 0 4px color-mix(in srgb, var(--color-accent) 85%, transparent))',
                    }}
                    className="pointer-events-none absolute left-0 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
                />
            )}

            {entries.map((entry, index) => (
                <TimelineEntryRow
                    key={entry.id}
                    entry={entry}
                    index={index}
                    markerRef={(el) => {
                        markerRefs.current[index] = el;
                    }}
                    thresholds={thresholds}
                    scrollYProgress={scrollYProgress}
                    prefersReducedMotion={prefersReducedMotion}
                />
            ))}
        </ol>
    );
};
