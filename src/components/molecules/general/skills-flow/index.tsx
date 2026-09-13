import { useEffect, useState } from 'react';
import {
    siCelery,
    siExpress,
    siFastify,
    siFlask,
    siMongodb,
    siNodedotjs,
    siPostgresql,
    siPython,
    siReact,
    siRedis,
    siStyledcomponents,
    siTailwindcss,
    siTypescript,
    siZod,
    type SimpleIcon,
} from 'simple-icons';

import { SkillNode } from '@components/atoms/skill-node';

interface FlowNode {
    id: string;
    icon: SimpleIcon;
    /** Posição no diagrama, em % (0–100) da largura/altura do container. */
    x: number;
    y: number;
}

// Coordenadas em % — front-end à esquerda, back-end no meio, dados à
// direita. Só os nós citados em COMPANY_EDGES abaixo têm linha animada; os
// demais aparecem no diagrama (ícone + tooltip) mas sem conexão, porque não
// haveria uma combinação real de projeto pra representar.
const NODES: readonly FlowNode[] = [
    // Front-end (5 nós, não 6 — Storybook saiu daqui: é ferramenta de dev,
    // nunca vai pro código de produção, mesma categoria de Git/Cypress/
    // Pytest, que já estão no carrossel de about-me. Sobrou espaço: os 5
    // usam o mesmo intervalo vertical de antes, só que com mais folga entre
    // cada um — 20% de passo em vez de 16%.
    { id: 'react', icon: siReact, x: 12, y: 10 },
    { id: 'typescript', icon: siTypescript, x: 12, y: 30 },
    { id: 'tailwind', icon: siTailwindcss, x: 12, y: 50 },
    { id: 'styled-components', icon: siStyledcomponents, x: 12, y: 70 },
    { id: 'zod', icon: siZod, x: 12, y: 90 },
    // Back-end (mesmo ritmo vertical do Front-end — 6 nós, mesmas 6 linhas —
    // pra alinhar visualmente entre colunas). Express e Celery entraram
    // aqui, e não só no texto, pelo mesmo motivo de Node.js/Python: são
    // tecnologias de pipeline de verdade (backend), mesmo sem um projeto
    // documentado conectando-as com linha.
    { id: 'nodejs', icon: siNodedotjs, x: 50, y: 10 },
    { id: 'express', icon: siExpress, x: 50, y: 26 },
    { id: 'fastify', icon: siFastify, x: 50, y: 42 },
    { id: 'python', icon: siPython, x: 50, y: 58 },
    { id: 'celery', icon: siCelery, x: 50, y: 74 },
    { id: 'flask', icon: siFlask, x: 50, y: 90 },
    // Dados
    { id: 'mongodb', icon: siMongodb, x: 88, y: 30 },
    { id: 'postgresql', icon: siPostgresql, x: 88, y: 56 },
    { id: 'redis', icon: siRedis, x: 88, y: 80 },
] as const;

const NODE_BY_ID = new Map(NODES.map((node) => [node.id, node]));

// Conexões reais, tiradas dos projetos da seção "Projetos": Faladoria usa
// React + TypeScript num backend Fastify, com dados em MongoDB; o Sistema de
// Certificados (FCR) usa Flask (Python) também com MongoDB. As linhas
// mostram esse caminho de verdade, não uma combinação hipotética.
const EDGES: readonly { from: string; to: string }[] = [
    { from: 'react', to: 'fastify' },
    { from: 'typescript', to: 'fastify' },
    { from: 'fastify', to: 'mongodb' },
    { from: 'flask', to: 'mongodb' },
] as const;

function curvePath(x1: number, y1: number, x2: number, y2: number): string {
    const midX = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

const COLUMN_LABELS = [
    { label: 'Front-end', x: 12 },
    { label: 'Back-end', x: 50 },
    { label: 'Dados', x: 88 },
] as const;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Hook próprio (mesmo padrão do `useIsDesktop` da Home) em vez do
// `useReducedMotion` do Framer Motion: o hook da lib guarda o valor inicial
// numa referência de módulo, então um `matchMedia` mockado *depois* que a
// lib já carregou não é reconsultado — em teste, o mock nunca "pega". Um
// hook local, que lê `matchMedia` a cada montagem, responde de verdade.
function usePrefersReducedMotion() {
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

/**
 * Fluxo visual das principais tecnologias: front-end → back-end → dados, com
 * as conexões realmente usadas em projetos animadas (uma "luz" percorrendo a
 * linha). Substitui a antiga grade estática de logos.
 */
export const SkillsFlow = () => {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <div>
            <h3 className="sr-only">Fluxo de tecnologias</h3>
            <p className="sr-only">
                Front-end em React e TypeScript conectado a um back-end em
                Fastify, que armazena dados em MongoDB — a stack da Faladoria.
                Um segundo caminho, o back-end em Flask (Python), também
                armazena em MongoDB — a stack do Sistema de Certificados (FCR).
            </p>

            {/* max-w-xs (não max-w-sm, como antes): diagrama menor pra
                sobrar espaço na seção pro carrossel — a seção inteira
                precisa caber numa tela só, sem scroll. */}
            <div className="mx-auto w-full max-w-xs">
                {/* Rótulos das colunas: linha própria, em fluxo normal — NÃO
                    flutuando acima do diagrama via `-translate-y-full` (como
                    era antes). Aquela versão "pedia emprestado" o padding do
                    BlueprintFrame ao redor pra ter espaço, e se o padding do
                    frame fosse menor que o rótulo + respiro precisava, o
                    texto ficava colado (ou por cima) da borda do frame —
                    exatamente o bug reportado. Uma altura própria (h-4/h-5)
                    reserva o espaço de verdade, sem depender de quem estiver
                    por fora. */}
                <div className="relative mb-2 h-4 sm:h-5">
                    {COLUMN_LABELS.map((col) => (
                        <span
                            key={col.label}
                            className="absolute -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs"
                            style={{ left: `${col.x}%` }}
                        >
                            {col.label}
                        </span>
                    ))}
                </div>

                {/* Sem aria-hidden aqui: os nós dentro são botões reais e
                    focáveis (SkillNode) — escondê-los do wrapper inteiro os
                    tiraria da árvore de acessibilidade. Só o SVG dos
                    conectores (puramente decorativo) leva aria-hidden,
                    abaixo. */}
                <div className="relative aspect-[9/10] w-full sm:aspect-[3/4]">
                    {/* Conectores: linha fixa (hairline) + "luz" animada por cima */}
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full overflow-visible"
                    >
                        {EDGES.map((edge) => {
                            const from = NODE_BY_ID.get(edge.from)!;
                            const to = NODE_BY_ID.get(edge.to)!;
                            const d = curvePath(from.x, from.y, to.x, to.y);
                            const pathId = `skills-flow-edge-${edge.from}-${edge.to}`;

                            return (
                                <g key={pathId}>
                                    <path
                                        id={pathId}
                                        d={d}
                                        fill="none"
                                        className="stroke-border"
                                        strokeWidth={0.4}
                                    />
                                    {!prefersReducedMotion && (
                                        <circle
                                            r={0.9}
                                            className="fill-accent"
                                            style={{
                                                filter: 'drop-shadow(0 0 2px rgb(var(--color-accent) / 0.9))',
                                            }}
                                        >
                                            <animateMotion
                                                dur="2.4s"
                                                repeatCount="indefinite"
                                                keyPoints="0;1"
                                                keyTimes="0;1"
                                                calcMode="linear"
                                            >
                                                <mpath href={`#${pathId}`} />
                                            </animateMotion>
                                        </circle>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Nós (ícone + tooltip), por cima dos conectores */}
                    {NODES.map((node) => (
                        <SkillNode
                            key={node.id}
                            icon={node.icon}
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
