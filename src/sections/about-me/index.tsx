import {
    siCypress,
    siGit,
    siGithubactions,
    siPytest,
    siStorybook,
} from 'simple-icons';

import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { SkillsFlow } from '@components/molecules/general/skills-flow';
import {
    TechCarousel,
    type TechCarouselItem,
} from '@components/molecules/general/tech-carousel';

// Ferramentas que atravessam o stack inteiro (não são uma etapa do pipeline
// representado no <SkillsFlow />, por isso não têm nó lá — ver comentário no
// componente do carrossel). Storybook entrou aqui pelo mesmo motivo: é
// ferramenta de desenvolvimento (nunca vai pro código de produção), mesma
// categoria de Git/GitHub Actions/Cypress/Pytest — não é uma etapa do
// pipeline como Tailwind/Styled Components/Zod, que ficam no diagrama.
// CI/CD, Clean Code, SOLID, acessibilidade e arquitetura não têm `icon`:
// são práticas/metodologias, não marcas — não existe logo pra "Clean Code"
// (o componente já lida com item sem ícone). Playwright tem logo de
// verdade, mas o pacote simple-icons não o inclui (mesmo caso do LinkedIn
// em Contato — ver comentário lá).
const TOOLING: readonly TechCarouselItem[] = [
    { icon: siCypress, label: 'Cypress' },
    { icon: siPytest, label: 'Pytest' },
    { icon: siGit, label: 'Git' },
    { icon: siGithubactions, label: 'GitHub Actions' },
    { icon: siStorybook, label: 'Storybook' },
    { label: 'Playwright' },
    { label: 'CI/CD' },
    { label: 'Clean Code' },
    { label: 'SOLID' },
    { label: 'Acessibilidade' },
    { label: 'Arquitetura' },
] as const;

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

            {/* Sem `items-center`: ele centralizava cada coluna na altura da
                MAIOR (o diagrama, mais alto que o texto), empurrando o texto
                pra baixo e abrindo um vão vazio entre o título e o primeiro
                parágrafo (reportado com print). Sem alinhamento explícito
                (padrão `stretch`), o texto começa colado no topo. */}
            <div className="mt-3 grid gap-5 lg:mt-4 lg:grid-cols-2 lg:gap-10">
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
                    Leidejane escolheu), abaixo do texto no mobile.

                    min-w-0: por padrão, um item de grid tem `min-width: auto`
                    — ou seja, ele nunca encolhe menos que o CONTEÚDO mais
                    largo lá dentro, mesmo que esse conteúdo tenha
                    `overflow-hidden` (a faixa do <TechCarousel />, que é
                    naturalmente mais larga que a tela pra caber a lista
                    duplicada). Sem `min-w-0`, essa largura "vazava" pro grid
                    inteiro e estourava a seção pro lado no mobile — a página
                    inteira ganhava scroll horizontal. */}
                <div className="min-w-0">
                    <BlueprintFrame grid className="p-3 sm:p-6">
                        <SkillsFlow />
                    </BlueprintFrame>
                </div>
            </div>

            {/* Carrossel em linha própria, largura cheia da seção — não
                preso à metade direita da grade (onde ficava restrito antes).
                min-w-0 pelo mesmo motivo do <div> do diagrama acima: o
                conteúdo do carrossel (lista duplicada) é mais largo que a
                tela de propósito, e sem isso essa largura vazava pro flex
                container da seção. */}
            <div className="mt-4 min-w-0 lg:mt-5">
                <TechCarousel
                    items={TOOLING}
                    label="Outras ferramentas do dia a dia"
                />
            </div>
        </section>
    );
};
