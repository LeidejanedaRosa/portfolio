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
        text: 'Desenvolvedora full stack autônoma e voluntária na Faladoria, estudando computação em nuvem (AWS) na Escola da Nuvem — buscando uma posição plena remota.',
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
        period: '2022–2024',
        text: 'Voltei para a tecnologia pelo bootcamp da Cubos Academy e, em 2024, atuei como monitora, ajudando pessoas em transição de carreira.',
    },
    {
        id: 'estacao-festas',
        title: 'Estação Festas Infantis',
        icon: GiftIcon,
        period: '2013–2020',
        text: 'Proprietária e gestora: da captação de clientes à logística, decoração do tema, marketing e gestão financeira — tocando o negócio do início ao fim.',
    },
    {
        id: 'formacao',
        title: 'Formação',
        icon: GraduationCapIcon,
        period: '1997–2026',
        text: 'Onde tudo começou: Técnico em Informática (Visual Basic, Delphi, Access), Gestão de Negócios em 2011 — e agora, Bacharelado em Engenharia de Software, em andamento.',
    },
] as const;

export const EXPERIENCE: readonly TimelineEntry[] = [
    {
        id: 'faladoria',
        period: 'set 2025 – atual',
        role: 'Desenvolvedora Full Stack voluntária',
        org: 'Faladoria',
        description:
            'Plataforma de mediação entre usuários do SUS e a gestão pública',
    },
    {
        id: 'autonoma',
        period: 'mar 2025 – atual',
        role: 'Desenvolvedora Full Stack',
        org: 'Autônoma',
        description: 'Clientes: EMR International e FCR Cursos e Treinamentos',
    },
    {
        id: 'soujunior',
        period: 'mar 2025 – nov 2025',
        role: 'Desenvolvedora Full Stack voluntária',
        org: 'SouJunior',
        description: 'Portal de Vagas, projeto social open source',
    },
    {
        id: 'cubos-academy-monitoria',
        period: 'mar 2024 – ago 2024',
        role: 'Monitora de Desenvolvimento',
        org: 'Cubos Academy',
    },
    {
        id: 'clarke-energia',
        period: 'abr 2023 – fev 2025',
        role: 'Desenvolvedora Full Stack',
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
        period: 'mai 2013 – jan 2020',
        role: 'Proprietária e gestora',
        org: 'Estação Festas Infantis',
        description: 'Decoração de festas infantis — negócio próprio',
    },
] as const;

export const EDUCATION: readonly EducationEntry[] = [
    {
        id: 'engenharia-software',
        course: 'Bacharelado em Engenharia de Software',
        institution: 'Centro Universitário Cidade Verde — UNICIVE',
        period: '2026–2030 (cursando)',
    },
    {
        id: 'gestao-negocios',
        course: 'Gestão de Negócios',
        institution: 'Universidade Braz Cubas',
        period: '2011–2013',
    },
    {
        id: 'tecnico-informatica',
        course: 'Técnico em Informática',
        institution: 'Colégio do Instituto Batista Americano',
        period: '1997–2000',
    },
] as const;

export const COURSES: readonly CourseEntry[] = [
    {
        id: 'escola-da-nuvem-computacao-nuvem',
        course: 'Computação em Nuvem — AWS re/Start (300h)',
        institution: 'Escola da Nuvem',
        period: 'out 2026 – mar 2027 (cursando)',
    },
    {
        id: 'cubos-academy-fullstack',
        course: 'Desenvolvimento de Software - Full Stack (960h)',
        institution: 'Cubos Academy',
        period: 'ago 2022 – mai 2023',
    },
    {
        id: 'womakerscode-bootcamp-python-django',
        course: 'Bootcamp Back-End Python e Django (130h)',
        institution: 'WoMakersCode',
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
        id: 'womakerscode-html-css',
        course: 'HTML 5 & CSS 3',
        institution: 'WoMakersCode',
        period: 'jan 2024',
    },
    {
        id: 'womakerscode-github',
        course: 'Desvendando o GitHub',
        institution: 'WoMakersCode',
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
