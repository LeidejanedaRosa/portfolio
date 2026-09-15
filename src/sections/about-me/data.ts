import {
    siCypress,
    siGit,
    siGithubactions,
    siPytest,
    siStorybook,
} from 'simple-icons';

import { type CourseEntry } from '@components/molecules/general/course-list';
import { type EducationEntry } from '@components/molecules/general/education-list';
import { type TimelineEntry } from '@components/molecules/general/experience-timeline';
import { type StoryCardEntry } from '@components/molecules/general/story-cards';
import {
    BriefcaseIcon,
    CompassIcon,
    GiftIcon,
    GraduationCapIcon,
    RefreshIcon,
} from '@components/molecules/general/story-cards/icons';
import { type TechCarouselItem } from '@components/molecules/general/tech-carousel';

export const STORY: readonly StoryCardEntry[] = [
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
        text: 'Quase 2 anos como full-stack: componentes React no Design System (mais entrega), testes automatizados (menos bugs em produção) e APIs em Python/Flask.',
    },
    {
        id: 'cubos-academy',
        title: 'Cubos Academy',
        icon: RefreshIcon,
        period: '2022',
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
        text: 'Onde tudo começou: Técnico em Informática (Visual Basic, Delphi, Access), seguido por Gestão de Negócios em 2011.',
    },
] as const;

export const EXPERIENCE: readonly TimelineEntry[] = [
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

export const EDUCATION: readonly EducationEntry[] = [
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

export const COURSES: readonly CourseEntry[] = [
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

export const TOOLING: readonly TechCarouselItem[] = [
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
