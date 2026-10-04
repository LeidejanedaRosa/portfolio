import { m, useTransform, type MotionValue } from 'framer-motion';

import { ConnectorTick } from './connector-tick';
import { type Project } from './data';
import { ProjectCard } from './project-card';
import { ProjectPreview } from './project-preview';

// Opacidade mínima do card fora do foco da luz — não mais baixo que isso:
// confirmado com axe-core num Chromium real (não a simulação do jsdom) que
// texto esmaecido além disso quebra WCAG AA nos dois temas (mesma lição do
// FAQ e de `<ExperienceTimeline />`).
const DIM_OPACITY = 0.9;

// Janela de progresso (0–1, mesma escala do `scrollYProgress`) em que a
// bolinha enche, e logo depois o traço se estende — as duas terminam antes
// de a luz parar na bolinha, então o traço já está encostado no card quando
// ela pousa. ~0.01 ≈ 27px de scroll na altura atual da lista.
const SYNC_WINDOW = 0.01;

export function TimelineRow({
    project,
    index,
    liRef,
    thresholds,
    arrival,
    scrollYProgress,
    prefersReducedMotion,
}: {
    project: Project;
    index: number;
    liRef: (el: HTMLLIElement | null) => void;
    /** Posição (fração 0–1 da altura da lista) de cada bolinha, medida em
     * `Projects`. Cada linha lê a sua e a das vizinhas pra montar o "pico"
     * de destaque centrado nela mesma (ver `activity` abaixo). */
    thresholds: readonly number[];
    /** Progresso em que a luz chega à bolinha deste card (ver
     * `buildLightPath`). */
    arrival: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    const isEven = index % 2 === 0;
    // row-start-1 explícito nos dois: sem isso, quando o card cai na
    // coluna 2, o cursor de auto-posicionamento do grid avança pra "linha
    // 2" do mini-grid deste <li>, e o preview (sem linha própria) fica
    // abaixo do card em vez de ao lado.
    const cardColumn = isEven
        ? 'md:row-start-1 md:pr-12'
        : 'md:col-start-2 md:row-start-1 md:pl-12';
    const previewColumn = isEven
        ? 'md:col-start-2 md:row-start-1 md:pl-12'
        : 'md:row-start-1 md:pr-12';

    const threshold = thresholds[index] ?? 1;
    const prevThreshold = thresholds[index - 1];
    const nextThreshold = thresholds[index + 1];

    // "Pico" triangular centrado no threshold deste card: sobe de 0 (perto
    // do card anterior) até 1 no próprio threshold, desce de volta a 0
    // (perto do próximo) — mesmo mecanismo de `<ExperienceTimeline />`.
    // Sem card anterior (o primeiro) ou seguinte (o último), o platô fica em
    // 1 até a borda da lista: card 01 já entra em destaque assim que a
    // seção aparece, sem precisar rolar mais pra "ativar".
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
    const cardOpacity = useTransform(activity, [0, 1], [DIM_OPACITY, 1]);
    const cardScale = useTransform(activity, [0, 1], [0.97, 1]);

    // Bolinha e traço seguem a luz, não o `activity`: o platô do primeiro
    // card deixaria o traço aberto antes de a luz chegar nele. Janelas
    // consecutivas dão a sequência "luz chega → bolinha enche → traço sai
    // dela" sem precisar de delay/duração.
    const fillScale = useTransform(
        scrollYProgress,
        [arrival - 2 * SYNC_WINDOW, arrival - SYNC_WINDOW],
        [0, 1],
        { clamp: true },
    );
    const tickScale = useTransform(
        scrollYProgress,
        [arrival - SYNC_WINDOW, arrival],
        [0, 1],
        { clamp: true },
    );

    const cardMotionStyle = prefersReducedMotion
        ? undefined
        : { opacity: cardOpacity, scale: cardScale };

    return (
        <li
            ref={liRef}
            // Sem `items-start`: o padrão do grid (`stretch`) é o que faz
            // o card e o preview terem a mesma altura na mesma linha.
            className="relative md:grid md:grid-cols-2 md:gap-x-12 not-last:mb-12 md:not-last:mb-16"
        >
            <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background md:block"
            >
                {prefersReducedMotion ? (
                    <span className="absolute inset-0.5 rounded-full bg-accent" />
                ) : (
                    <m.span
                        style={{ scale: fillScale }}
                        className="absolute inset-0.5 rounded-full bg-accent"
                    />
                )}
            </span>

            <ConnectorTick
                direction={isEven ? 'left' : 'right'}
                scaleX={prefersReducedMotion ? 1 : tickScale}
            />

            {/* Traço até o iframe, do lado oposto ao do card — só quando
                há demo pública. */}
            {project.links?.demo && (
                <ConnectorTick
                    direction={isEven ? 'right' : 'left'}
                    scaleX={prefersReducedMotion ? 1 : tickScale}
                />
            )}

            <m.div style={cardMotionStyle} className={cardColumn}>
                <ProjectCard project={project} index={index} />
            </m.div>

            {project.links?.demo && (
                <m.div
                    style={cardMotionStyle}
                    className={`${previewColumn} mt-8 md:mt-0`}
                >
                    <ProjectPreview
                        title={project.title}
                        url={project.links.demo}
                        hugCenter={isEven ? 'left' : 'right'}
                    />
                </m.div>
            )}
        </li>
    );
}
