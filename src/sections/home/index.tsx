import { useRef } from 'react';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';

import profilePhoto from '@assets/images/LeidejanedaRosaProfile.png';

/**
 * Hero da Home — padrão "Hero-Centric": domina a primeira tela, um CTA
 * primário, empilha no mobile e vira 2 colunas no desktop.
 */
export const HomePage = () => {
    const prefersReducedMotion = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);

    // Progresso do scroll enquanto a seção sai da tela (0 → 1)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    // Parallax sutil: a foto sobe ~48px. Desligado se o usuário pediu menos movimento.
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -48]);
    const y = prefersReducedMotion ? 0 : parallaxY;

    return (
        <section
            id="home"
            ref={sectionRef}
            aria-labelledby="home-title"
            className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center gap-12 px-6 py-24 md:flex-row md:items-center md:gap-16"
        >
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

                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    Construo software com foco em arquitetura, acessibilidade e
                    boas práticas. Aqui você encontra meus projetos e um pouco
                    da minha trajetória.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <a
                        href="#projects"
                        className="rounded-lg bg-accent px-5 py-3 font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
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

            <motion.div
                style={{ y }}
                className="mx-auto w-56 shrink-0 sm:w-64 md:mx-0 md:w-80"
            >
                {/* TODO(feat/about-me): foto é placeholder — Leidejane vai trocar */}
                <img
                    src={profilePhoto}
                    alt="Leidejane da Rosa"
                    width={320}
                    height={320}
                    fetchPriority="high"
                    className="aspect-square w-full rounded-2xl border border-border object-cover"
                />
            </motion.div>
        </section>
    );
};
