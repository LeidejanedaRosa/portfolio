import { useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import homeHeroBg from '@assets/images/home-hero-bg.webp';
import { DuotoneBackgroundImage } from '@components/molecules/general/duotone-background-image';

export const HomePage = () => {
    const prefersReducedMotion = useReducedMotion();
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
            className="relative grid overflow-clip min-h-[calc(100svh-var(--nav-height,4.5rem))] lg:h-[calc(100svh-var(--nav-height,4.5rem))]"
        >
            <DuotoneBackgroundImage
                src={homeHeroBg}
                width={1280}
                height={720}
                parallaxY={prefersReducedMotion ? 0 : parallaxY}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl self-center px-6 py-12 md:px-10 lg:px-12 lg:py-8">
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
                        acessibilidade e boas práticas. Aqui você encontra meus
                        projetos e um pouco da minha trajetória.
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
            </div>
        </section>
    );
};
