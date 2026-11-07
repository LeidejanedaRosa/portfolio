interface GlowPortraitProps {
    src: string;
    alt: string;
}

export const GlowPortrait = ({ src, alt }: GlowPortraitProps) => {
    return (
        <div className="relative mx-auto aspect-square h-64 sm:h-72 lg:h-80">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 rounded-full bg-accent/20 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,color-mix(in_srgb,var(--color-accent)_30%,transparent),transparent_65%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-full border-2 border-accent/60"
            />
            <span
                aria-hidden="true"
                className="absolute right-[5%] top-[20%] z-20 h-4 w-4 rotate-6 bg-accent/50"
            />
            <span
                aria-hidden="true"
                className="absolute right-[2%] top-[32%] z-20 h-3 w-3 -rotate-12 bg-accent/30"
            />
            {/* rounded-full na própria imagem, não só no anel decorativo
                acima: sem isso, a foto preenche o quadrado inteiro e os
                ombros "vazam" pelos cantos, por fora do círculo do anel —
                a imagem precisa ser recortada em círculo também, não só
                emoldurada por um. -inset-3, igual ao anel (não inset-0):
                sem isso a foto fica um círculo menor, sobrando um vão
                visível até o anel — aqui ela encosta nele. Altura/largura
                em calc(), não h-auto/w-auto: `<img>` tem width/height
                intrínsecos (os atributos abaixo) — "auto" usa esse
                tamanho intrínseco em vez de esticar conforme o inset,
                e a foto "vazava" pra fora do cartão seguinte. max-w-none:
                o preflight do Tailwind trava todo `<img>` em
                `max-width: 100%` do container — sem isso, a largura
                calculada (100%+1.5rem, maior que o container) é cortada de
                volta pros 100%, e só a altura (sem max-height equivalente)
                respeita o calc(), deixando a foto mais estreita que o
                anel e descentralizada. */}
            <img
                src={src}
                alt={alt}
                width={640}
                height={794}
                className="absolute -inset-3 z-10 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] max-w-none rounded-full object-cover object-top"
            />
        </div>
    );
};
