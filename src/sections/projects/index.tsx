import { motion, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

import projectsBgLight from '@assets/images/projects-blueprint-bg-light.webp';
import projectsBgDark from '@assets/images/projects-blueprint-bg.webp';
import { ThemedBackgroundImage } from '@components/molecules/general/themed-background-image';
import { READING_LINE_OFFSET } from '@src/lib/reading-line';
import { SECTION_PB, SECTION_PT } from '@src/lib/section-spacing';
import { usePrefersReducedMotion } from '@src/lib/use-prefers-reduced-motion';

import { PROJECTS } from './data';
import { buildLightPath, type RowBounds } from './light-path';
import { TimelineRow } from './timeline-row';

export const Projects = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const timelineRef = useRef<HTMLUListElement>(null);
    const liRefs = useRef<(HTMLLIElement | null)[]>([]);
    // 1 (não 0): antes da primeira medição, deixa todo card fora do alcance
    // do progresso de scroll real no primeiro paint — senão as bolinhas
    // piscariam preenchidas por um instante.
    const [rows, setRows] = useState<RowBounds[]>(() =>
        PROJECTS.map(() => ({ top: 1, bottom: 1 })),
    );
    const thresholds = rows.map(({ top, bottom }) => (top + bottom) / 2);
    const lightPath = buildLightPath(rows);

    // Progresso 0→1 = quanto da <ul> já passou pela linha de leitura. Com
    // 'start end'/'end start' o percurso seria altura da lista + altura da
    // tela, mas a luz só anda a altura da lista — ela ficava adiantada e
    // longe do que está visível. Assim, a luz fica presa à linha de leitura
    // (parada na bolinha do topo até a lista chegar lá).
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: READING_LINE_OFFSET,
    });
    const lightTop = useTransform(
        scrollYProgress,
        lightPath.input,
        lightPath.output.map((position) => `${position * 100}%`),
    );

    // Topo e base de cada <li> como fração 0–1 da altura da lista — mesmo
    // referencial do `scrollYProgress`, comparado direto em `TimelineRow` e
    // em `buildLightPath`. `useLayoutEffect`: mede antes do primeiro
    // paint, sem flash. ResizeObserver na <ul> (não só `resize` da window):
    // a altura da lista também muda quando um <details> de código abre —
    // mesmo padrão de <Layout /> pro --nav-height.
    useLayoutEffect(() => {
        const ul = timelineRef.current;
        if (!ul) return;

        // `list` como parâmetro (não capturar `ul` direto): TypeScript não
        // preserva o `if (!ul) return` acima dentro de uma function
        // declaration — ela é hoisted e podia, na visão do compilador, ser
        // chamada de qualquer lugar, então `ul` volta a ser
        // `HTMLUListElement | null` lá dentro.
        function measure(list: HTMLUListElement) {
            const ulHeight = list.offsetHeight;
            if (!ulHeight) return;

            setRows(
                liRefs.current.map((li) =>
                    li
                        ? {
                              top: li.offsetTop / ulHeight,
                              bottom:
                                  (li.offsetTop + li.offsetHeight) / ulHeight,
                          }
                        : { top: 1, bottom: 1 },
                ),
            );
        }

        measure(ul);

        if (typeof ResizeObserver === 'undefined') {
            // Navegador sem suporte (raro hoje): mede uma vez no mount e
            // segue sem observar — melhor que quebrar o app inteiro.
            return;
        }

        const observer = new ResizeObserver(() => measure(ul));
        observer.observe(ul);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="projects"
            aria-labelledby="projects-title"
            className={`relative px-6 ${SECTION_PB} ${SECTION_PT}`}
        >
            {/* Fundo "grudado" na tela, não esticado na seção inteira: com
                ~3000px de altura, `object-cover` ampliaria a imagem 16:9 umas
                3× (borrada, laterais cortadas). O wrapper absoluto cobre a
                seção e é o limite do sticky — o fundo só acompanha a rolagem
                enquanto Projetos está na tela. `sticky` em vez de
                `background-attachment: fixed`, que o Safari do iOS ignora. */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="sticky top-[var(--nav-height,4.5rem)] h-[calc(100svh-var(--nav-height,4.5rem))]">
                    <ThemedBackgroundImage
                        lightSrc={projectsBgLight}
                        darkSrc={projectsBgDark}
                    />
                </div>
            </div>

            <div className="mx-auto max-w-6xl">
                <h2
                    id="projects-title"
                    className="font-mono text-3xl font-bold text-foreground"
                >
                    Projetos
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Os seis projetos abaixo são reais — a maioria é trabalho de
                    cliente ou de impacto social. Nos que ainda são privados,
                    você encontra um trecho real de código ou um link pra testar
                    ao vivo; nos que já são públicos, dá pra ver o código e o
                    site no ar.
                </p>

                <ul ref={timelineRef} className="relative mt-16">
                    {/* Linha central: só existe em telas médias+ (é ela que faz
                    os cards alternarem lado a lado; em coluna única, no
                    mobile, não há "lado" pra marcar). */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 border-l-2 border-dashed border-accent/40 md:block"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-0 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent md:block"
                    />

                    {!prefersReducedMotion && (
                        <motion.div
                            aria-hidden="true"
                            style={{
                                top: lightTop,
                                filter: 'drop-shadow(0 0 4px rgb(var(--color-accent) / 0.85))',
                            }}
                            className="pointer-events-none absolute left-1/2 z-20 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
                        />
                    )}

                    {PROJECTS.map((project, index) => (
                        <TimelineRow
                            key={project.id}
                            project={project}
                            index={index}
                            liRef={(el) => {
                                liRefs.current[index] = el;
                            }}
                            thresholds={thresholds}
                            arrival={lightPath.arrivals[index] ?? 1}
                            scrollYProgress={scrollYProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />
                    ))}
                </ul>
            </div>
        </section>
    );
};
