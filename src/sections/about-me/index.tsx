import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { SkillsFlow } from '@components/molecules/general/skills-flow';

export const AboutMe = () => {
    return (
        // min-h (não h-), diferente da Home: aqui nenhum filho usa h-full/
        // inset-0 (o texto e o SkillsFlow se dimensionam pelo próprio
        // conteúdo/aspect-ratio), então não existe nada que dependa de uma
        // altura DEFINIDA neste ancestral — o motivo que obriga a Home a usar
        // h- fixo não se aplica aqui. Com h- fixo, conteúdo mais alto que a
        // tela (medido em alguns celulares) transbordava visualmente da
        // caixa (overflow:visible não corta), mas a caixa em si continuava
        // com a altura fixa pra fins de layout — o Projetos, que começa logo
        // depois no fluxo normal, podia sobrepor esse transbordo em vez de
        // ser empurrado pra baixo. min-h deixa a caixa crescer de verdade
        // quando o conteúdo precisar, então o Projetos sempre é empurrado
        // corretamente.
        //
        // .justify-safe-center (utilitário em index.css), não justify-center
        // puro nem `justify-[safe_center]` (o valor arbitrário do Tailwind
        // não gerava a regra corretamente — ver o comentário em index.css):
        // quando o conteúdo cabe (caixa = min-h), continua centralizando
        // verticalmente; quando não cabe, "safe" cai pro alinhamento no topo
        // em vez de centralizar o excesso pros DOIS lados — o que empurraria
        // o título "Sobre mim" pra CIMA da área visível (escondido atrás da
        // barra, pior que só precisar rolar pra baixo).
        <section
            id="about"
            aria-labelledby="about-title"
            className="justify-safe-center mx-auto flex min-h-[calc(100svh-var(--nav-height,4.5rem))] max-w-6xl flex-col px-6 py-4 lg:py-6"
        >
            <h2
                id="about-title"
                className="font-mono text-3xl font-bold text-foreground"
            >
                Sobre mim
            </h2>

            <div className="mt-3 grid gap-5 lg:mt-6 lg:grid-cols-2 lg:items-center lg:gap-10">
                <div className="max-w-2xl space-y-2 text-lg leading-relaxed text-muted-foreground lg:space-y-3">
                    <p>
                        Aprendi a programar no ensino médio, no técnico de
                        Informática — Visual Basic, Delphi, Access. Naquela
                        época não deu pra seguir carreira, então fui por outro
                        caminho: fiz Gestão de Negócios e toquei por quase três
                        anos uma empresa de decoração de festas infantis.
                    </p>
                    <p>
                        Voltei pra programação em 2022, pela Cubos Academy, e de
                        lá saí direto pra primeira vaga — quase dois anos como
                        desenvolvedora full-stack na Clarke Energia, entre
                        front, back, design system, testes e as primeiras
                        decisões de arquitetura de verdade. Também fui monitora
                        na Cubos, ajudando cerca de 30 pessoas em transição de
                        carreira a destravar seus projetos.
                    </p>
                    <p>
                        Hoje trabalho como freelancer, em projetos próprios e de
                        impacto social, e busco uma vaga plena e remota. O que
                        me prende em software é entender o que acontece embaixo
                        do framework: arquitetura, dados, resiliência, escala.{' '}
                        <strong className="font-semibold text-foreground">
                            Ferramenta não é engenharia.
                        </strong>
                    </p>
                </div>

                {/* Fluxo de tecnologias: à direita no desktop (lado que a
                    Leidejane escolheu), abaixo do texto no mobile. */}
                <div>
                    <BlueprintFrame grid className="p-3 sm:p-6">
                        <SkillsFlow />
                    </BlueprintFrame>

                    <p className="mt-2 text-sm text-muted-foreground lg:mt-3">
                        Também: Express, Celery, Cypress, Pytest, Git, GitHub
                        Actions, Playwright, testes E2E, CI/CD, Clean Code,
                        SOLID, acessibilidade e arquitetura.
                    </p>
                </div>
            </div>
        </section>
    );
};
