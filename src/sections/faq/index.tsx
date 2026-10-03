import { ChevronDownIcon } from '@heroicons/react/24/outline';

import faqBgLight from '@assets/images/faq-blueprint-bg-light.webp';
import faqBgDark from '@assets/images/faq-blueprint-bg.webp';
import { DimensionLine } from '@components/atoms/dimension-line';
import { ThemedBackgroundImage } from '@components/molecules/general/themed-background-image';

interface FaqEntry {
    id: string;
    question: string;
    answer: string;
}

const FAQS: readonly FaqEntry[] = [
    {
        id: 'privado',
        question: 'Por que alguns projetos são privados?',
        answer: 'A maioria é trabalho de cliente ou de impacto social, com código sob confidencialidade. Nesses casos deixo um trecho real (sem segredos) ou um link pra testar ao vivo, em vez do repositório inteiro.',
    },
    {
        id: 'duracao',
        question: 'Quanto tempo dura um projeto?',
        answer: 'Varia com o escopo — uma landing page institucional fica pronta em poucas semanas; um sistema com regra de negócio própria (autenticação, integração com API externa, banco de dados) leva mais tempo. No início de cada projeto eu dou um prazo real, não uma estimativa genérica.',
    },
    {
        id: 'design',
        question: 'Você também faz o design, ou só o desenvolvimento?',
        answer: 'Só o desenvolvimento — não sou designer. As decisões visuais eu tomo com apoio de ferramentas de IA (incluindo o Claude) e referências reais de outros produtos, sempre dentro de um sistema de design consistente. Minha força é a engenharia por trás: arquitetura, acessibilidade, performance.',
    },
    {
        id: 'contato',
        question: 'Como entro em contato?',
        answer: 'Pelos canais diretos na seção Contato — e-mail, LinkedIn, GitHub ou WhatsApp.',
    },
];

export const Faq = () => {
    return (
        // min-h + flex + justify-safe-center: conteúdo centralizado na tela
        // (a pedido da Leidejane), não encostado no topo como as outras
        // seções — FAQ é a única com esse tratamento, de propósito. "safe"
        // em vez de só "center": se um dia não couber (zoom de fonte, mais
        // perguntas), cai pro alinhamento no topo sozinho, em vez de
        // centralizar o excesso pros dois lados e esconder o título atrás
        // da barra (mesmo raciocínio do Contato, ver `.justify-safe-center`
        // em index.css).
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="faq-section justify-safe-center relative flex min-h-[calc(100svh-var(--nav-height,4.5rem))] flex-col overflow-x-clip px-6"
        >
            <ThemedBackgroundImage lightSrc={faqBgLight} darkSrc={faqBgDark} />

            {/* O fundo acima cobre a seção inteira (largura cheia); o bloco
                de conteúdo continua estreito e centralizado por dentro. */}
            <div className="mx-auto max-w-2xl">
                <h2
                    id="faq-title"
                    className="faq-eyebrow font-mono text-sm font-medium text-muted-foreground"
                >
                    03 — Perguntas frequentes
                </h2>
                <DimensionLine className="mt-2 w-16" />

                {/* .faq-list e .faq-eyebrow: as regras que escurecem as
                    demais perguntas (e o título) ao abrir ou passar o mouse
                    moram no index.css (:has() não tem variante pronta no
                    Tailwind pra "irmã com [open]/:hover", só pra
                    ancestral/descendente). */}
                <ul className="faq-list mt-6">
                    {FAQS.map((faq, index) => {
                        const number = String(index + 1).padStart(2, '0');

                        return (
                            <li key={faq.id}>
                                <details name="faq" className="group py-5">
                                    {/* Sem justify-between: a seta fica logo
                                        depois da pergunta, não esticada até a
                                        borda do bloco. */}
                                    <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                                        <span className="flex items-baseline gap-4">
                                            <span className="font-mono text-sm text-accent">
                                                {number}
                                            </span>
                                            <span className="faq-question font-mono text-lg font-bold text-foreground">
                                                {faq.question}
                                            </span>
                                        </span>
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                                        />
                                    </summary>
                                    <p className="mt-3 max-w-2xl pl-[3.25rem] text-muted-foreground">
                                        {faq.answer}
                                    </p>
                                </details>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};
