import {
    siCypress,
    siGit,
    siGithubactions,
    siPytest,
    siStorybook,
} from 'simple-icons';

import profilePhoto from '@assets/images/profile-cutout.webp';
import {
    CourseList,
    type CourseEntry,
} from '@components/molecules/general/course-list';
import {
    EducationList,
    type EducationEntry,
} from '@components/molecules/general/education-list';
import {
    ExperienceTimeline,
    type TimelineEntry,
} from '@components/molecules/general/experience-timeline';
import {
    StoryCards,
    type StoryCardEntry,
} from '@components/molecules/general/story-cards';
import {
    BriefcaseIcon,
    CompassIcon,
    GiftIcon,
    GraduationCapIcon,
    RefreshIcon,
} from '@components/molecules/general/story-cards/icons';
import {
    TechCarousel,
    type TechCarouselItem,
} from '@components/molecules/general/tech-carousel';
import { BlueprintFrame } from '@src/components/atoms/blueprint-frame';
import { SkillsFlow } from '@src/components/molecules/general/skills-flow';

// Cards da história — mesmos fatos que estavam nos parágrafos corridos
// (nada resumido a ponto de perder detalhe: Visual Basic/Delphi/Access, os
// ~30 mentorados na Cubos, o que fez de verdade na Clarke), só reorganizados
// pra escanear mais rápido. Mais recente primeiro (mesmo critério de
// Experiência/Educação/Cursos, a pedido dela) — não é mais ordem
// cronológica de "era uma vez".
const STORY: readonly StoryCardEntry[] = [
    {
        id: 'hoje',
        title: 'Hoje',
        icon: CompassIcon,
        period: '2025–atual',
        text: 'Freelancer em projetos próprios e de impacto social — buscando uma posição plena remota.',
    },
    {
        id: 'clarke-energia',
        title: 'Clarke Energia',
        icon: BriefcaseIcon,
        period: '2023–2025',
        // Resumo de uma lista bem mais longa (a descrição real do LinkedIn
        // tem 11 bullets) — escolhidos os 3 com número associado, porque
        // impacto medido pesa mais que lista de tarefas num card pequeno.
        text: 'Quase 2 anos como full-stack: componentes React no Design System (mais entrega), testes automatizados (menos bugs em produção) e APIs em Python/Flask.',
    },
    {
        id: 'cubos-academy',
        title: 'Cubos Academy',
        icon: RefreshIcon,
        period: '2022',
        // Antes lia como "voltei pra tecnologia TRABALHANDO na Cubos" — são
        // 2 fatos distintos (voltei pelo bootcamp; à parte disso, fui
        // monitora), separados aqui com ";" pra não emendar um no outro.
        text: 'Voltei pra tecnologia pelo bootcamp da Cubos Academy; também atuei como monitora, ajudando pessoas em transição de carreira.',
    },
    {
        id: 'estacao-festas',
        title: 'Estação Festas',
        icon: GiftIcon,
        period: '2013–2020',
        text: 'Empreendedora: da captação de clientes à logística, decoração do tema, marketing e gestão financeira — tocando o negócio do início ao fim.',
    },
    {
        id: 'formacao',
        title: 'Formação',
        icon: GraduationCapIcon,
        period: '1997 e 2011',
        // "Onde tudo começou": ela pediu pra ressaltar que a história com
        // programação nasce aqui, não só listar os cursos.
        text: 'Onde tudo começou: Técnico em Informática (Visual Basic, Delphi, Access), seguido por Gestão de Negócios em 2011.',
    },
] as const;

// Mais recente primeiro (convenção de currículo/resumo profissional) —
// datas confirmadas por ela, não estimadas.
const EXPERIENCE: readonly TimelineEntry[] = [
    {
        id: 'freelancer',
        period: 'mar 2025 – atual',
        role: 'Freelancer',
        org: 'Projetos próprios e de impacto social',
    },
    {
        id: 'clarke-energia',
        period: 'abr 2023 – fev 2025',
        role: 'Desenvolvedora Full-Stack',
        org: 'Clarke Energia',
    },
    {
        id: 'cubos-academy',
        period: 'ago 2022 – mai 2023',
        role: 'Bootcamp de programação',
        org: 'Cubos Academy',
    },
    {
        id: 'estacao-festas',
        period: '2013–2020',
        role: 'Empreendedora',
        org: 'Estação Festas',
        description: 'Decoração de festas infantis — negócio próprio',
    },
] as const;

// Mais recente primeiro (mesmo critério da Experiência e dos Cursos).
const EDUCATION: readonly EducationEntry[] = [
    {
        id: 'gestao-negocios',
        course: 'Gestão de Negócios',
        institution: 'Universidade Braz Cubas',
        period: '2011–2013',
    },
    {
        id: 'tecnico-informatica',
        course: 'Técnico em Informática',
        institution: 'Colégio Instituto Batista Americano',
        period: '1997–2000',
    },
] as const;

// Peso (substância/carga horária) primeiro, não data — os 4 primeiros são
// os que aparecem sem precisar expandir (<CourseList initialCount={4} />),
// por isso são os mais robustos: um bootcamp de 960h pesa mais que um quiz
// de 20 perguntas. Dentro de cada "peso", mais recente primeiro. Alguns
// testes técnicos do Coodesh foram refeitos em datas diferentes (Node,
// GitHub, Git) — mostrando só a data mais recente de cada, a pedido dela.
const COURSES: readonly CourseEntry[] = [
    {
        id: 'cubos-academy-fullstack',
        course: 'Desenvolvimento de Software - Full Stack (960h)',
        institution: 'Cubos Academy',
        period: 'ago 2022 – mai 2023',
    },
    {
        id: 'mmt-bootcamp-python-django',
        course: 'Bootcamp Back-End Python e Django - Turma 2',
        institution: 'Mais Mulheres em Tech',
        period: 'mai 2024',
    },
    {
        id: 'rocketseat-clean-code',
        course: 'Clean Code',
        institution: 'Rocketseat',
        period: 'fev 2024',
    },
    {
        id: 'semrush-seo',
        course: 'Curso intensivo de SEO com Brian Dean',
        institution: 'Semrush Academy',
        period: 'out 2025',
    },
    {
        id: 'mmt-html-css',
        course: 'HTML 5 & CSS 3',
        institution: 'Mais Mulheres em Tech',
        period: 'jan 2024',
    },
    {
        id: 'mmt-github',
        course: 'Desvendando o GitHub',
        institution: 'Mais Mulheres em Tech',
        period: 'jan 2024',
    },
    {
        id: 'udemy-devtools',
        course: 'Depurando sites com Chrome DevTools',
        institution: 'Udemy',
        period: 'jan 2024',
    },
    {
        id: 'bradesco-poo',
        course: 'Introdução à Programação Orientada a Objetos',
        institution: 'Fundação Bradesco',
        period: 'out 2023',
    },
    {
        id: 'solyd-python',
        course: 'Curso Básico de Python',
        institution: 'Solyd Offensive Security',
        period: 'mai 2023',
    },
    {
        id: 'coodesh-node',
        course: 'Teste técnico: Node',
        institution: 'Coodesh',
        period: 'fev 2024',
    },
    {
        id: 'coodesh-javascript',
        course: 'Teste técnico: JavaScript',
        institution: 'Coodesh',
        period: 'fev 2024',
    },
    {
        id: 'coodesh-github',
        course: 'Teste técnico: GitHub',
        institution: 'Coodesh',
        period: 'fev 2024',
    },
    {
        id: 'coodesh-git',
        course: 'Teste técnico: Git',
        institution: 'Coodesh',
        period: 'fev 2024',
    },
    {
        id: 'coodesh-react',
        course: 'Teste técnico: React',
        institution: 'Coodesh',
        period: 'mar 2023',
    },
] as const;

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
        <section
            id="about"
            aria-labelledby="about-title"
            className="mx-auto max-w-6xl overflow-x-clip px-6 xl:overflow-x-visible"
        >
            <div className="py-12 lg:py-16">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Conteúdo */}
                    <div>
                        <p className="font-mono text-xs font-bold uppercase text-accent">
                            Sobre mim
                        </p>

                        <h2
                            id="about-title"
                            className="
                                    mt-3
                                    max-w-[40rem]
                                    font-mono
                                    text-3xl
                                    font-bold
                                    leading-relaxed
                                    text-foreground
                                    sm:text-4xl
                                "
                        >
                            <span className="block">Eu sou a Leidejane,</span>

                            <span className="block text-accent">
                                desenvolvedora Full Stack.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                            Transformo ideias em soluções digitais, unindo
                            tecnologia, lógica e um olhar atento às pessoas.
                            Gosto de entender o que acontece por baixo do
                            framework — e construir soluções que fazem sentido.
                        </p>
                    </div>

                    {/* Foto */}
                    <div className="relative flex h-[22rem] items-end justify-center sm:h-[26rem] lg:h-[30rem]">
                        {/* Glow */}
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                -inset-8
                                rounded-full
                                bg-accent/20
                                blur-3xl
                            "
                        />

                        {/* Gradiente */}
                        <div
                            aria-hidden="true"
                            className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    bg-[radial-gradient(ellipse_at_50%_70%,rgb(var(--color-accent)/0.3),transparent_65%)]
                                "
                        />
                        <div
                            aria-hidden="true"
                            className="
                                    pointer-events-none
                                    absolute
                                    left-1/2
                                    top-1/2
                                    aspect-square
                                    h-[75%]
                                    w-auto
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    rounded-full
                                    border
                                    border-accent/25
                                "
                        />

                        {/* Decoração */}
                        <span
                            aria-hidden="true"
                            className="
                                    absolute
                                    right-[5%]
                                    top-[20%]
                                    z-20
                                    h-4
                                    w-4
                                    rotate-6
                                    bg-accent/50
                                "
                        />

                        <span
                            aria-hidden="true"
                            className="
                                    absolute
                                    right-[2%]
                                    top-[32%]
                                    z-20
                                    h-3
                                    w-3
                                    -rotate-12
                                    bg-accent/30
                                "
                        />

                        {/* Foto */}
                        <img
                            src={profilePhoto}
                            alt="Retrato de Leidejane da Rosa"
                            width={427}
                            height={585}
                            className="
                                    relative
                                    z-10
                                    h-full
                                    w-auto
                                    max-w-full
                                    object-contain
                                    object-bottom
                                "
                        />
                    </div>
                </div>

                <StoryCards entries={STORY} />

                <div className="mt-8 border-y border-border py-4 text-center">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
                        <span aria-hidden="true">—</span> Ferramenta não é
                        engenharia <span aria-hidden="true">—</span>
                    </p>
                </div>
            </div>

            <div className="pb-24 pt-8 lg:pt-4">
                <div className="grid gap-10 md:grid-cols-2 lg:gap-12 xl:grid-cols-3">
                    <div className="col-span-1">
                        <h3 className="font-mono text-xl font-bold text-foreground">
                            Experiência
                        </h3>
                        <div className="mt-5">
                            <ExperienceTimeline entries={EXPERIENCE} />
                        </div>
                    </div>

                    <div className="col-span-1 space-y-10">
                        <div>
                            <h3 className="font-mono text-xl font-bold text-foreground">
                                Educação
                            </h3>
                            <div className="mt-5">
                                <EducationList entries={EDUCATION} />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-mono text-xl font-bold text-foreground">
                                Cursos
                            </h3>
                            <div className="mt-5">
                                <CourseList
                                    entries={COURSES}
                                    initialCount={4}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="min-w-0 md:col-span-2 xl:col-span-1 xl:min-w-96">
                        <BlueprintFrame grid className="p-3 sm:p-6">
                            <SkillsFlow />
                        </BlueprintFrame>
                    </div>
                </div>
                <div className="mt-4 min-w-0 lg:mt-5">
                    <TechCarousel
                        items={TOOLING}
                        label="Outras ferramentas do dia a dia"
                    />
                </div>
            </div>
        </section>
    );
};
