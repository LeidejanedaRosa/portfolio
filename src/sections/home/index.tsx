import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import deskScene from '@assets/images/desk-scene.webp';
import profilePhoto from '@assets/images/profile.webp';

// Breakpoint em que a hero vira 2 colunas lado a lado (1024px — igual ao `lg:`
// do Tailwind). Abaixo disso fica em coluna única, foto acima do texto.
// Decidir em JS qual versão da imagem renderizar evita que as duas (coluna e
// lado a lado) baixem o mesmo arquivo: um <img> com `className="lg:hidden"`
// continua sendo baixado pelo browser mesmo escondido por CSS — só não
// renderizar o elemento resolve isso de fato.
const DESKTOP_QUERY = '(min-width: 1024px)';

// A cena/foto (full-bleed, ocupa metade da tela) para de esticar acima disso
// e fica centralizada — mesmo princípio de "conteúdo com largura máxima e
// centralizado" que as outras seções já seguem (`max-w-6xl mx-auto`), só que
// com um teto bem mais largo porque aqui é a própria imagem de fundo, não um
// bloco de texto de leitura. O texto não precisa dessa faixa: ele já usa o
// mesmo `mx-auto max-w-6xl` das outras seções, que se recentraliza sozinho em
// qualquer largura — é esse o padrão "oficial" do projeto pra centralizar
// conteúdo, e a hero segue ele igual às outras.
const HERO_IMAGE_MAX_WIDTH = 'max-w-[1920px]';

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(DESKTOP_QUERY).matches,
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_QUERY);
        const handleChange = (event: MediaQueryListEvent) =>
            setIsDesktop(event.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isDesktop;
}

/**
 * Hero da Home — padrão "Hero-Centric": domina a primeira tela, um CTA
 * primário, empilha em coluna até 1024px (foto antes do texto) e vira 2
 * colunas lado a lado a partir daí.
 */
export const HomePage = () => {
    const prefersReducedMotion = useReducedMotion();
    const isDesktop = useIsDesktop();
    const sectionRef = useRef<HTMLElement>(null);

    // Progresso do scroll enquanto a seção sai da tela (0 → 1)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    // Parallax sutil: a cena sobe ~48px. Desligado se o usuário pediu menos movimento.
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -48]);
    const y = prefersReducedMotion ? 0 : parallaxY;

    return (
        <section
            id="home"
            ref={sectionRef}
            aria-labelledby="home-title"
            className="relative h-[calc(100svh-var(--nav-height,4.5rem))] overflow-hidden"
        >
            {/* Texto: o MESMO padrão `mx-auto max-w-6xl px-6` que Sobre,
                Projetos e Contato usam — por isso alinha com elas em
                qualquer largura de tela, inclusive extra-grande, sem precisar
                de nenhum teto especial aqui.

                O `flex`/`pr-[52%]` fica num <div> DE DENTRO do max-w-6xl (não
                nele mesmo): padding em porcentagem sempre resolve contra a
                largura do elemento PAI, nunca contra a própria — colocar o
                pr-52% direto no max-w-6xl faria ele calcular 52% da tela
                inteira (não dos 1152px do container), quebrando em telas
                largas. Com essa div extra, o pai passa a ser o max-w-6xl já
                travado em 1152px, e a conta fica estável em qualquer tela. */}
            <div className="relative z-10 mx-auto h-full max-w-6xl px-6">
                <div className="flex h-full flex-col justify-center gap-4 py-3 lg:gap-16 lg:py-8 lg:pr-[52%]">
                    {/* `order-2`: visualmente depois da foto em coluna única —
                        mas continua primeiro no DOM (o <h1> antes do conteúdo
                        decorativo é o que faz sentido pra quem lê com leitor
                        de tela ou navega por teclado). A partir de 1024px a
                        foto sai do fluxo (fica em `absolute`), então a ordem
                        deixa de fazer diferença. */}
                    <div className="order-2 max-w-xl">
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

                    {/* Coluna única (< 1024px): cena reta (sem tilt), foto
                        centralizada por cima, antes do texto (`order-1`). Só
                        existe no DOM quando NÃO é desktop — se existisse
                        sempre e só ficasse escondida por CSS, o browser
                        baixaria o arquivo mesmo assim, duplicando o request
                        da versão lado a lado abaixo. */}
                    {!isDesktop && (
                        <div className="relative order-1 mx-auto w-fit">
                            {/* max-width = a coluna inteira (tela menos o
                                px-6 de cada lado). max-height = a tela menos
                                nav e um orçamento fixo pro bloco de texto
                                abaixo (~24rem — cabeçalho + parágrafo +
                                botões), não uma % fixa da tela: uma % (ex.:
                                "33vh") dá o mesmo tanto de espaço numa tela de
                                667px e numa de 1024px, mas sobra MUITO mais
                                altura de verdade na de 1024 — a conta abaixo
                                usa essa sobra de verdade, em vez de um teto
                                achatado igual pras duas. O `max(380px, …)` é
                                só uma rede de segurança pra celular deitado
                                (bem baixo) não zerar a imagem. Largura/altura
                                em `auto`: o navegador usa o que for mais
                                apertado dos dois e encolhe mantendo a
                                proporção. */}
                            <img
                                src={deskScene}
                                alt="Anotações e esboços manuscritos de decisões de arquitetura de software: opções, trade-offs, custos estimados e princípios, com régua e esquadro ao lado"
                                width={1300}
                                height={1758}
                                className="h-auto w-auto max-h-[max(380px,calc(100svh-var(--nav-height,4.5rem)-24rem))] max-w-[calc(100vw-3rem)]"
                            />
                            <div className="absolute inset-x-0 top-1/2 mx-auto w-[54%] -translate-y-1/2 bg-background p-1.5 shadow-xl">
                                <img
                                    src={profilePhoto}
                                    alt="Retrato de Leidejane da Rosa"
                                    width={800}
                                    height={1096}
                                    className="w-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Imagem: full-bleed (ocupa metade da TELA, não do container de
                texto) — por isso fica fora do max-w-6xl, num wrapper próprio
                que só entra em ação em telas extra-grandes (acima de
                1920px), pra parar de esticar e ficar centralizada, em vez de
                virar uma faixa enorme e vazia num monitor ultrawide/4K. */}
            {isDesktop && (
                <div
                    className={`absolute inset-0 mx-auto ${HERO_IMAGE_MAX_WIDTH}`}
                >
                    {/* Cena reta, de frente, ocupando os 50% da largura e
                        100% da altura (topo a rodapé, sem gaps —
                        `object-cover` preenche o retângulo todo, cortando o
                        que sobra em vez de deixar vazio). Só renderiza quando
                        é desktop, pra não duplicar o download da imagem. */}
                    <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                        {/* h-[calc(100%+48px)], não h-full: o parallax sobe a
                            imagem até 48px (mesmo valor do `useTransform`
                            acima). Se a caixa da imagem fosse do tamanho exato
                            do container, subir 48px abriria um vão de 48px no
                            rodapé (o `overflow-hidden` do container recorta o
                            topo, mas nada preenche o que sobrou embaixo). Uma
                            caixa 48px mais alta garante que sempre sobra
                            imagem pra cobrir o rodapé, e o `object-cover`
                            continua cortando o excesso normalmente. */}
                        <motion.img
                            src={deskScene}
                            alt="Anotações e esboços manuscritos de decisões de arquitetura de software: opções, trade-offs, custos estimados e princípios, com régua e esquadro ao lado"
                            width={1300}
                            height={1758}
                            fetchPriority="high"
                            style={{ y }}
                            className="h-[calc(100%+48px)] w-full object-cover"
                        />
                    </div>

                    {/* A foto fica centralizada por cima da cena, em destaque
                        — moldura (fundo + padding) pra ler como uma foto de
                        verdade pousada em cima da mesa, não um recorte
                        flutuando sem borda.

                        Dois elementos, não um só: o Framer Motion escreve a
                        própria `transform` (para animar `y`) direto no
                        `style` inline, que tem mais especificidade que
                        qualquer classe Tailwind e SUBSTITUI (não soma) o
                        `transform` que as classes `-translate-x-1/2
                        -translate-y-1/2` gerariam — a centralização seria
                        descartada em silêncio. Por isso a centralização (CSS
                        puro, no elemento de fora) e o parallax do scroll
                        (Framer Motion, no elemento de dentro) ficam em
                        elementos separados, sem disputar a mesma
                        propriedade. */}
                    <div className="absolute left-3/4 top-1/2 z-[5] h-[58%] -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            style={{ y }}
                            className="h-full bg-background p-3 shadow-2xl"
                        >
                            <img
                                src={profilePhoto}
                                alt="Retrato de Leidejane da Rosa"
                                width={800}
                                height={1096}
                                className="h-full w-auto object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            )}
        </section>
    );
};
