import {
    siFastify,
    siFlask,
    siMongodb,
    siPython,
    siReact,
    siSentry,
    siTailwindcss,
    siTypescript,
    siVercel,
    siVite,
    siWhatsapp,
    type SimpleIcon,
} from 'simple-icons';

import { BlueprintFrame } from '@components/atoms/blueprint-frame';
import { CodeSnippet } from '@components/atoms/code-snippet';
import { TechIcon } from '@components/atoms/tech-icon';

interface Project {
    id: string;
    title: string;
    summary: string;
    highlight: string;
    stack: SimpleIcon[];
    visibility: 'private' | 'public';
    links?: { code?: string; demo?: string };
    codeSnippet?: { filename: string; language: string; code: string };
}

const PROJECTS: readonly Project[] = [
    {
        id: 'faladoria',
        title: 'Faladoria',
        summary:
            'Plataforma de mediação entre usuários do SUS e gestores públicos de saúde, com canal de atendimento via WhatsApp.',
        highlight:
            'Backend em Fastify integrado à API do WhatsApp (Meta Cloud API), com autenticação própria e armazenamento em MongoDB.',
        stack: [siReact, siTypescript, siFastify, siMongodb, siWhatsapp],
        visibility: 'private',
        codeSnippet: {
            filename: 'requireRole.ts',
            language: 'TypeScript',
            code: `export function requireRole(
  sessionReader: SessionReader,
  ...allowedRoles: UserRole[]
) {
  return async function requireRoleHook(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const result = await sessionReader.api.getSession({
      headers: toWebHeaders(request),
    })

    if (!result) {
      return reply.code(401).send({ message: 'Não autenticado.' })
    }

    const role = result.user.role as UserRole
    if (!allowedRoles.includes(role)) {
      return reply.code(403).send({ message: 'Acesso negado.' })
    }
    // ...
  }
}`,
        },
    },
    {
        id: 'fcr-certificados',
        title: 'FCR — Sistema de Certificados',
        summary:
            'Geração e verificação de certificados para cursos e treinamentos, com QR Code para validação.',
        highlight:
            'API em Clean Architecture (Flask + MongoDB); o verificador é offline-first e acessível em WCAG 2.1 AAA.',
        stack: [siPython, siFlask, siMongodb],
        visibility: 'private',
        codeSnippet: {
            filename: 'base_repository.py',
            language: 'Python',
            code: `class BaseRepository(ABC, Generic[T]):
    """Abstract base repository for data access operations."""

    @abstractmethod
    def create(self, entity: T) -> T: ...

    @abstractmethod
    def get_by_id(self, entity_id: str) -> Optional[T]: ...

    @abstractmethod
    def get_all(self) -> List[T]: ...

    @abstractmethod
    def update(self, entity_id: str, entity: T) -> Optional[T]: ...

    @abstractmethod
    def delete(self, entity_id: str) -> bool: ...`,
        },
    },
    {
        id: 'emr-international',
        title: 'EMR International',
        summary:
            'Landing page institucional para treinamentos de atendimento pré-hospitalar tático.',
        highlight:
            'React 19 com PWA (service worker via Workbox), monitoramento de erros com Sentry e navegação por teclado com focus lock.',
        stack: [siReact, siVite, siTailwindcss, siSentry],
        visibility: 'private',
        codeSnippet: {
            filename: 'utils/sentry.tsx',
            language: 'TypeScript',
            code: `Sentry.init({
  dsn,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Privacy: masking habilitado para compliance LGPD/GDPR/HIPAA —
      // previne captura de PII (dados pessoais, médicos, contato)
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})`,
        },
    },
    {
        id: 'espaco-saude-bem-estar',
        title: 'Espaço Saúde Bem-Estar',
        summary:
            'Site institucional para apresentar serviços, valores e diferenciais de um espaço de bem-estar.',
        highlight:
            'Responsivo e acessível, do zero ao ar — o único desta lista com código aberto e demo pública.',
        stack: [siTypescript, siVite, siTailwindcss, siVercel],
        visibility: 'public',
        links: {
            code: 'https://github.com/LeidejanedaRosa/landing-espaco-saude-bemestar',
            demo: 'https://landing-espaco-saude-bemestar.vercel.app',
        },
    },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const number = String(index + 1).padStart(2, '0');

    return (
        <BlueprintFrame className="p-6">
            <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs text-accent">{number}</span>
                <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {project.visibility === 'private' ? 'Privado' : 'Público'}
                </span>
            </div>

            <h3 className="mt-3 font-mono text-lg font-bold text-foreground">
                {project.title}
            </h3>
            <p className="mt-2 text-muted-foreground">{project.summary}</p>
            <p className="mt-3 text-sm text-muted-foreground">
                {project.highlight}
            </p>

            <ul className="mt-6 flex flex-wrap gap-4">
                {project.stack.map((tech) => (
                    <TechIcon key={tech.title} icon={tech} />
                ))}
            </ul>

            {project.codeSnippet && (
                <details className="mt-6">
                    <summary className="cursor-pointer font-mono text-xs font-medium text-accent">
                        Ver trecho de código
                    </summary>
                    <div className="mt-3">
                        <CodeSnippet {...project.codeSnippet} />
                    </div>
                </details>
            )}

            {project.links && (
                <div className="mt-6 flex flex-wrap gap-3 pt-2">
                    {project.links.code && (
                        <a
                            href={project.links.code}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            Ver código
                        </a>
                    )}
                    {project.links.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                        >
                            Ver site
                        </a>
                    )}
                </div>
            )}
        </BlueprintFrame>
    );
}

export const Projects = () => {
    return (
        <section
            id="projects"
            aria-labelledby="projects-title"
            className="mx-auto max-w-6xl px-6 py-24"
        >
            <h2
                id="projects-title"
                className="font-mono text-3xl font-bold text-foreground"
            >
                Projetos
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Os quatro projetos abaixo são reais. A maioria é trabalho de
                cliente ou de impacto social, por isso o repositório é privado —
                mas cada um traz um trecho real de código, sem segredos, pra
                avaliar a decisão técnica na prática.
            </p>

            <ul className="mt-12 grid gap-8 md:grid-cols-2">
                {PROJECTS.map((project, index) => (
                    <li key={project.id}>
                        <ProjectCard project={project} index={index} />
                    </li>
                ))}
            </ul>
        </section>
    );
};
