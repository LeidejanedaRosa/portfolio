import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { type CSSProperties } from 'react';
import { siGithub, siGmail, siWhatsapp, type SimpleIcon } from 'simple-icons';

import contactBgLight from '@assets/images/contact-blueprint-bg-light.webp';
import contactBgDark from '@assets/images/contact-blueprint-bg.webp';
import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { ThemedBackgroundImage } from '@components/molecules/general/themed-background-image';
import { useConsent } from '@src/consent';
import { brandHoverColor } from '@src/lib/brand-hover-color';

// simple-icons removeu o logo do LinkedIn do pacote (política de marca da
// plataforma) — mesmo formato de ícone (SimpleIcon), mantido localmente.
const linkedinIcon: SimpleIcon = {
    title: 'LinkedIn',
    hex: '0A66C2',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
} as SimpleIcon;

// Arquivo estático em `public/` (não importado como módulo): só precisa
// estar no caminho certo pra funcionar, sem passar pelo bundler.
const RESUME_HREF = '/leidejane-da-rosa-curriculo.pdf';

interface Channel {
    id: string;
    label: string;
    handle: string;
    href: string;
    icon: SimpleIcon;
}

const CHANNELS: readonly Channel[] = [
    {
        id: 'email',
        label: 'E-mail',
        handle: 'leidejanedarosa.81@gmail.com',
        href: 'mailto:leidejanedarosa.81@gmail.com',
        icon: siGmail,
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        handle: '/in/leidejane',
        href: 'https://www.linkedin.com/in/leidejane/',
        icon: linkedinIcon,
    },
    {
        id: 'github',
        label: 'GitHub',
        handle: '@LeidejanedaRosa',
        href: 'https://github.com/LeidejanedaRosa',
        icon: siGithub,
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        handle: '+55 35 99141-4032',
        href: 'https://wa.me/5535991414032',
        icon: siWhatsapp,
    },
];

function ContactLink({ channel }: { readonly channel: Channel }) {
    const isExternal = !channel.href.startsWith('mailto:');

    // GitHub é exceção deliberada: a Leidejane quer o preto real da marca
    // nos dois temas, mesmo sabendo que o contraste fica baixo no escuro
    // (preto quase sobre fundo quase preto) — `brandHoverColor(hex, theme)`
    // continua resolvendo os outros canais por tema (cai pro accent quando a
    // cor real sumiria), só o GitHub ignora esse fallback.
    const hoverLight =
        channel.id === 'github'
            ? `#${channel.icon.hex}`
            : brandHoverColor(channel.icon.hex, 'light');
    const hoverDark =
        channel.id === 'github'
            ? `#${channel.icon.hex}`
            : brandHoverColor(channel.icon.hex, 'dark');

    // Halo sutil só pro GitHub no escuro: a borda continua preta (pedido da
    // Leidejane), mas preto sobre o fundo quase-preto do tema escuro quase
    // some — nenhuma opacidade resolve "preto sobre preto", então em vez de
    // mudar a cor da borda, um contorno claro e discreto por fora ajuda o
    // olho a separar o card do fundo.
    const githubDarkHalo =
        channel.id === 'github'
            ? 'dark:hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-foreground)_25%,transparent),0_0_12px_1px_color-mix(in_srgb,var(--color-foreground)_12%,transparent)]'
            : '';

    return (
        <a
            href={channel.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer noopener' : undefined}
            // bg-background sólido: sem isso, a grade "blueprint" do fundo da
            // seção passava por trás do card e ficava confusa de ler (mesmo
            // motivo do ProjectCard em Projetos). Borda e ícone usam a MESMA
            // cor de marca no hover (--brand-hover-*, aqui no <a> pra
            // cascatear pro <svg> filho) — já existia só no ícone. No hover,
            // a cor de fundo precisa continuar OPACA (color-mix, não um
            // `/20` translúcido) — opacidade deixa o quadriculado do fundo da
            // seção vazar por trás do card (o `bg-background` da base é
            // sólido só na base; o hover TROCA essa cor, não soma por cima).
            className={`group flex items-center gap-4 rounded-lg border border-border bg-background p-4 transition-colors duration-200 hover:border-(--brand-hover-light) hover:bg-[color-mix(in_srgb,var(--color-muted)_20%,var(--color-background))] dark:hover:border-(--brand-hover-dark) ${githubDarkHalo}`}
            style={
                {
                    '--brand-hover-light': hoverLight,
                    '--brand-hover-dark': hoverDark,
                } as CSSProperties
            }
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8 shrink-0 fill-muted-foreground transition-colors duration-200 group-hover:fill-(--brand-hover-light) dark:group-hover:fill-(--brand-hover-dark)"
            >
                <path d={channel.icon.path} />
            </svg>
            {/* min-w-0: sem isso, o e-mail (uma string sem espaço) força esta
                coluna flex a crescer no tamanho do texto inteiro, estourando
                a largura do card em telas estreitas (320px). */}
            <span className="flex min-w-0 flex-col">
                <span className="font-mono text-sm font-medium text-foreground">
                    {channel.label}
                </span>
                <span className="break-words text-sm text-muted-foreground">
                    {channel.handle}
                </span>
            </span>
        </a>
    );
}

export const Contact = () => {
    const { reset } = useConsent();

    return (
        // min-h: como é a última seção, sem conteúdo depois pra "dar corda" à
        // rolagem, a página não teria como rolar o suficiente pra encostar o
        // título dela no topo se o conteúdo for mais baixo que a tela
        // (sobraria um vão — medido de verdade, 331px a mais que as outras
        // seções num desktop comum). justify-safe-center: conteúdo
        // centralizado verticalmente (a pedido da Leidejane) — sem
        // SECTION_PT/PB aqui, porque padding assimétrico (pt-16/pb-24)
        // desloca o centro do flex pro lado com menos padding; mesmo ajuste
        // já feito no FAQ e na Home.
        <section
            id="contact"
            aria-labelledby="contact-title"
            className="relative flex min-h-[calc(100svh-var(--nav-height,4.5rem))] flex-col justify-safe-center overflow-x-clip px-6"
        >
            <ThemedBackgroundImage
                lightSrc={contactBgLight}
                darkSrc={contactBgDark}
            />

            {/* O fundo acima cobre a seção inteira (largura cheia); o
                conteúdo continua restrito e centralizado por dentro.
                w-full explícito: sem isso, dentro do flex-col da <section>
                (precisa do flex pro justify-safe-center vertical), esse
                `<div>` encolhia pro tamanho do conteúdo (grid de 2 colunas
                vira `1fr` sem largura definida pra resolver, cai pro
                min-content) em vez de esticar até o max-w-6xl — mesmo bug
                que não aparecia na Home porque lá o `w-full` já existia. */}
            <div className="mx-auto w-full max-w-6xl">
                <h2
                    id="contact-title"
                    className="font-mono text-3xl font-bold text-foreground"
                >
                    Contato
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                    Esses são os melhores caminhos pra me encontrar.
                </p>

                <BlueprintFrame grid className="mt-10 p-6">
                    {/* grid-cols-1 explícito: sem ele, a coluna única
                        implícita do grid é dimensionada pelo conteúdo
                        (min-content), não pela largura disponível — o card
                        do e-mail estourava a tela em 320px mesmo com o
                        texto já quebrando linha. */}
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {CHANNELS.map((channel) => (
                            <li key={channel.id}>
                                <ContactLink channel={channel} />
                            </li>
                        ))}
                    </ul>
                </BlueprintFrame>

                {/* flex (não inline-flex): a seção não é mais flex-col (ver
                    comentário acima), então um link sem isso ficaria na
                    mesma linha do botão "Preferências de cookies" logo
                    abaixo — dois pesos de ação diferentes (CTA principal
                    vs. link secundário) não deviam disputar a mesma
                    linha. */}
                <a
                    href={RESUME_HREF}
                    download
                    className="mt-6 flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-3 font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
                >
                    <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                    Baixar currículo
                </a>

                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                >
                    Preferências de cookies
                </button>
            </div>
        </section>
    );
};
