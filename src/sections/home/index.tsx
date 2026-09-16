import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useRef } from 'react';

import homeBgDark from '@assets/images/home-blueprint-bg-dark.webp';
import homeBgLight from '@assets/images/home-blueprint-bg-light.webp';
import notebooksPhoto from '@assets/images/home-notebooks.webp';
import { ThemedBackgroundImage } from '@components/molecules/general/themed-background-image';

import { useIsDesktop } from './use-is-desktop';

const NOTEBOOKS_FADE_STYLE = {
    maskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 88%, transparent 100%)',
};

export const HomePage = () => {
    const prefersReducedMotion = useReducedMotion();
    const isDesktop = useIsDesktop();
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -24]);
    const y = prefersReducedMotion ? 0 : parallaxY;

    return (
        <section
            id="home"
            ref={sectionRef}
            aria-labelledby="home-title"
            className="relative grid min-h-[calc(100svh-var(--nav-height,4.5rem))] lg:h-[calc(100svh-var(--nav-height,4.5rem))]"
        >
            <ThemedBackgroundImage
                lightSrc={homeBgLight}
                darkSrc={homeBgDark}
                lightScrim="rgba(248, 250, 252, 0.15)"
                darkScrim="rgba(15, 23, 42, 0.15)"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-background via-background/80 to-transparent dark:hidden"
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl self-center px-6 py-12 md:px-10 lg:px-12 lg:py-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center">
                    <div className="max-w-xl">
                        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
                            Portfólio
                        </p>

                        <h1
                            id="home-title"
                            className="mt-3 font-mono text-4xl font-bold leading-tight text-foreground sm:text-5xl"
                        >
                            Leidejane da Rosa
                        </h1>
                        <p className="mt-2 text-xl font-medium text-muted-foreground sm:text-2xl">
                            Engenheira de Software
                        </p>

                        <p className="mt-3 text-lg leading-relaxed text-muted-foreground lg:mt-6">
                            Construo software com foco em arquitetura,
                            acessibilidade e boas práticas. Aqui você encontra
                            meus projetos e um pouco da minha trajetória.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 lg:mt-8">
                            <a
                                href="#projects"
                                className="rounded-lg bg-accent px-5 py-3 font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/50"
                            >
                                Ver projetos
                            </a>
                            <a
                                href="#contact"
                                className="rounded-lg border border-border px-5 py-3 font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                            >
                                Entrar em contato
                            </a>
                        </div>
                    </div>

                    {isDesktop && (
                        <motion.img
                            src={notebooksPhoto}
                            alt="Cadernos com anotações de arquitetura de software: fluxo de dados, escalabilidade, microsserviços, princípios de clean code e testes"
                            width={1264}
                            height={842}
                            fetchPriority="high"
                            style={{ y, ...NOTEBOOKS_FADE_STYLE }}
                            className="mx-auto w-full object-contain [filter:drop-shadow(0_8px_16px_rgba(0,0,0,0.18))]"
                        />
                    )}
                </div>
            </div>
        </section>
    );
};
