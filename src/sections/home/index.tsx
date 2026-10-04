import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import homeHeroBg from '@assets/images/home-hero-bg.webp';
import { DuotoneBackgroundImage } from '@components/molecules/general/duotone-background-image';
import { usePrefersReducedMotion } from '@src/lib/use-prefers-reduced-motion';

export const HomePage = () => {
    // Hook próprio do projeto, não o `useReducedMotion` do framer-motion:
    // a lib cacheia o valor numa referência de módulo (só lê `matchMedia`
    // uma vez por processo) — um `matchMedia` mockado DEPOIS desse
    // primeiro mount não é reconsultado, então em teste o mock nunca
    // "pega". Mesma razão documentada em `usePrefersReducedMotion`, já
    // usado por SkillsFlow/Projects/ExperienceTimeline.
    const prefersReducedMotion = usePrefersReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -24]);

    return (
        <section
            id="home"
            ref={sectionRef}
            aria-labelledby="home-title"
            // min-h: sem isso, a altura da seção vinha só do conteúdo + padding
            // fixo — por coincidência quase fecha a tela num notebook
            // (~768-900px de altura), mas sobra vão num monitor mais alto, com
            // o início do Sobre Mim aparecendo por baixo antes de rolar
            // (achado real da Leidejane, visível só fora do notebook). O
            // fundo (`object-cover`, h-full) acompanha a altura nova sozinho.
            // justify-safe-center: conteúdo centralizado verticalmente (a
            // pedido da Leidejane) — sem SECTION_PT/PB aqui, porque padding
            // assimétrico (pt-16/pb-24) desloca o centro do flex pro lado com
            // menos padding; mesmo ajuste já feito no FAQ.
            className="relative flex min-h-[calc(100svh-var(--nav-height,4.5rem))] flex-col justify-safe-center overflow-clip px-6 md:px-10 lg:px-12"
        >
            <DuotoneBackgroundImage
                src={homeHeroBg}
                width={1280}
                height={720}
                parallaxY={prefersReducedMotion ? 0 : parallaxY}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl">
                <div className="max-w-xl">
                    <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
                        Portfólio
                    </p>

                    {/* text-balance: sem isso, o navegador quebra a linha
                        de forma "gananciosa" (enche a primeira linha até
                        onde cabe) — em ~390px isso deixava só "Rosa" sozinho
                        na segunda linha. text-wrap: balance pondera as
                        larguras das linhas antes de escolher onde quebrar. */}
                    <h1
                        id="home-title"
                        className="mt-3 text-balance font-mono text-4xl font-bold leading-tight text-foreground sm:text-5xl"
                    >
                        Leidejane da Rosa
                    </h1>
                    <p className="mt-2 text-xl font-medium text-muted-foreground sm:text-2xl">
                        Engenheira de Software
                    </p>

                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground lg:mt-6">
                        Construo software com foco em arquitetura,
                        acessibilidade e boas práticas. Aqui você encontra meus
                        projetos e um pouco da minha trajetória.
                    </p>

                    {/* hover:scale + active:scale: feedback de "clicável"
                        além da cor (já existia) — motion-reduce neutraliza
                        só o scale, a cor continua mudando normalmente. */}
                    <div className="mt-4 flex flex-wrap gap-4 lg:mt-8">
                        <a
                            href="#projects"
                            className="rounded-lg bg-accent px-5 py-3 font-medium text-accent-foreground transition-[color,background-color,transform] duration-200 hover:scale-[1.02] hover:bg-accent/50 active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                        >
                            Ver projetos
                        </a>
                        <a
                            href="#contact"
                            className="rounded-lg border border-border px-5 py-3 font-medium text-foreground transition-[color,background-color,transform] duration-200 hover:scale-[1.02] hover:bg-muted active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
                        >
                            Entrar em contato
                        </a>
                    </div>
                </div>
            </div>

            {/* Pista de scroll: só em lg+ (não responde por breakpoint
                menor — testado com screenshot real em 320×568 e 375×667, e
                em telas baixas o texto do hero já usa quase toda a altura:
                um offset alto o bastante pra escapar do banner de cookies
                (fixed, bottom-0, medido com Playwright — 147px de altura em
                320px de largura, 127px em 375px, caindo pra ~88px só a
                partir de 640px, onde os botões do banner saem de baixo do
                texto e vão pro lado) ficava sobrepondo o parágrafo/CTA do
                hero. Em lg+ sobra espaço de verdade, então os dois
                problemas somem junto — também combina com a "pista de
                scroll" ser convenção mais de desktop (no touch, rolar já é
                o gesto óbvio, sem precisar de dica). Puramente decorativa
                (redundante pra leitor de tela, que já navega por
                landmark/heading, daí aria-hidden) — some sozinha ao rolar,
                por estar dentro desta <section> (`overflow-clip`), sem
                precisar de lógica extra pra escondê-la. Quique via CSS
                puro (`@keyframes scroll-cue-bounce`, index.css) por um
                utilitário arbitrário do Tailwind, não `animate` do
                framer-motion — ver comentário do `@keyframes` pro motivo
                (resumo: `animate` com keyframes não roda de forma síncrona
                em jsdom, então nenhum teste conseguia provar que desligava
                com prefers-reduced-motion). `motion-reduce:animate-none`
                desliga sozinho, sem precisar ler `prefersReducedMotion` em
                JS pra isso — mesmo padrão do hover dos CTAs acima. Dois
                níveis ainda: o de fora cuida do posicionamento estático
                (Tailwind `-translate-x-1/2`); o de dentro só da animação —
                um `@keyframes` que anima `transform` substituiria o
                transform inteiro do elemento se estivesse no mesmo nó,
                apagando o -translate-x-1/2. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
            >
                <div className="flex animate-[scroll-cue-bounce_1.6s_ease-in-out_infinite] flex-col items-center gap-1 text-muted-foreground motion-reduce:animate-none">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]">
                        Role
                    </span>
                    <ChevronDownIcon className="h-4 w-4" />
                </div>
            </div>
        </section>
    );
};
