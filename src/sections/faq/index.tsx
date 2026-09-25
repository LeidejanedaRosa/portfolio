import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FaqEntry {
    id: string;
    question: string;
    answer: string;
}

const FAQS: readonly FaqEntry[] = [
    {
        id: 'tipo-projeto',
        question: 'Que tipo de projeto você topa?',
        answer: 'Projetos com propósito real — de impacto social (como o Faladoria, mediação entre usuários do SUS e gestores públicos) a sistemas com regra de negócio de verdade. Hoje atuo como freelancer, buscando também uma posição CLT remota.',
    },
    {
        id: 'remoto',
        question: 'Trabalha remoto?',
        answer: 'Sim — hoje como freelancer 100% remoto, e estou aberta a uma posição CLT remota também.',
    },
    {
        id: 'stack',
        question: 'Qual sua stack?',
        answer: 'No frontend, React + TypeScript, com Vite e Tailwind CSS. No backend, Node (Fastify) e Python (Flask), com MongoDB. Cada projeto na seção Projetos mostra a stack específica dele.',
    },
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
        answer: 'Pelos canais diretos na seção Contato — e-mail, LinkedIn, GitHub ou WhatsApp. Sem formulário de propósito, pra evitar spam de terceiro e ir direto ao ponto.',
    },
];

export const Faq = () => {
    return (
        // min-h em toda largura (nunca h- fixo, nem em lg): 7 perguntas — ou
        // uma resposta longa aberta — podem passar da altura da viewport
        // mesmo em telas grandes. h- fixo cortaria a diferença pra fora da
        // caixa da seção, sobrepondo o Contato logo abaixo; min-h só usa a
        // viewport inteira como piso, e cresce se precisar.
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="faq-section justify-safe-center mx-auto flex min-h-[calc(100svh-var(--nav-height,4.5rem))] max-w-3xl flex-col px-6 lg:min-h-[calc(100svh-var(--nav-height,4.5rem))]"
        >
            <h2
                id="faq-title"
                className="faq-eyebrow font-mono text-sm font-medium text-muted-foreground"
            >
                Perguntas frequentes
            </h2>

            {/* .faq-list e .faq-eyebrow: as regras que escurecem as demais
                perguntas (e o título) ao abrir ou passar o mouse moram no
                index.css (:has() não tem variante pronta no Tailwind pra
                "irmã com [open]/:hover", só pra ancestral/descendente). */}
            <ul className="faq-list mt-6">
                {FAQS.map((faq, index) => {
                    const number = String(index + 1).padStart(2, '0');

                    return (
                        <li key={faq.id}>
                            <details name="faq" className="group py-5">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                                    <span className="flex items-baseline gap-4">
                                        <span className="font-mono text-sm text-accent">
                                            {number}
                                        </span>
                                        <span className="font-mono text-lg font-bold text-foreground">
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
        </section>
    );
};
