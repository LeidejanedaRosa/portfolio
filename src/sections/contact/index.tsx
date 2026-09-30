import { type CSSProperties } from 'react';
import { siGithub, siGmail, siWhatsapp, type SimpleIcon } from 'simple-icons';

import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { useConsent } from '@src/consent';
import { brandHoverColor } from '@src/lib/brand-hover-color';
import { SECTION_PB, SECTION_PT } from '@src/lib/section-spacing';

// simple-icons removeu o logo do LinkedIn do pacote (política de marca da
// plataforma) — mesmo formato de ícone (SimpleIcon), mantido localmente.
const linkedinIcon: SimpleIcon = {
    title: 'LinkedIn',
    hex: '0A66C2',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
} as SimpleIcon;

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

function ContactLink({ channel }: { channel: Channel }) {
    const isExternal = !channel.href.startsWith('mailto:');

    return (
        <a
            href={channel.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer noopener' : undefined}
            className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors duration-200 hover:border-accent hover:bg-muted"
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8 shrink-0 fill-muted-foreground transition-colors duration-200 group-hover:fill-[var(--brand-hover)]"
                style={
                    {
                        '--brand-hover': brandHoverColor(channel.icon.hex),
                    } as CSSProperties
                }
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
        // seções num desktop comum). Altura mínima de uma tela garante espaço
        // de rolagem de sobra; o conteúdo continua alinhado no topo (pt-16),
        // não centralizado.
        <section
            id="contact"
            aria-labelledby="contact-title"
            className={`mx-auto min-h-[calc(100svh-var(--nav-height,4.5rem))] max-w-6xl px-6 ${SECTION_PB} ${SECTION_PT}`}
        >
            <h2
                id="contact-title"
                className="font-mono text-3xl font-bold text-foreground"
            >
                Contato
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Vaga plena, projeto ou só uma ideia pra trocar sobre arquitetura
                de software — esses são os melhores caminhos pra me encontrar.
            </p>

            <BlueprintFrame grid className="mt-10 p-6">
                {/* grid-cols-1 explícito: sem ele, a coluna única implícita
                    do grid é dimensionada pelo conteúdo (min-content), não
                    pela largura disponível — o card do e-mail estourava a
                    tela em 320px mesmo com o texto já quebrando linha. */}
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {CHANNELS.map((channel) => (
                        <li key={channel.id}>
                            <ContactLink channel={channel} />
                        </li>
                    ))}
                </ul>
            </BlueprintFrame>

            <button
                type="button"
                onClick={reset}
                className="mt-6 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
                Preferências de cookies
            </button>
        </section>
    );
};
