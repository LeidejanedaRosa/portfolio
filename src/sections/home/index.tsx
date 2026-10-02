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
