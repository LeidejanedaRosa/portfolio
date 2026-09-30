import {
    siFastify,
    siFlask,
    siJavascript,
    siJest,
    siMongodb,
    siPython,
    siReact,
    siReactrouter,
    siSentry,
    siTailwindcss,
    siTypescript,
    siVercel,
    siVite,
    siWhatsapp,
    type SimpleIcon,
} from 'simple-icons';

export interface Project {
    id: string;
    title: string;
    summary: string;
    highlight: string;
    stack: SimpleIcon[];
    visibility: 'private' | 'public';
    links?: { code?: string; demo?: string };
    /** Contexto curto sobre o estado da demo (ex.: ainda não é pública). */
    demoNote?: string;
    /** Código de exemplo pra testar a demo (ex.: certificado). Campo à
     * parte pra poder aplicar `break-all` só nele, não na frase toda. */
    demoCode?: string;
    codeSnippet?: { filename: string; language: string; code: string };
}

export const PROJECTS: readonly Project[] = [
    {
        id: 'faladoria-backend',
        title: 'Faladoria — Backend',
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
        id: 'faladoria-web',
        title: 'Faladoria — Frontend',
        summary:
            'Landing page institucional da Faladoria — Guia do SUS e fluxo completo de conversão pro canal de atendimento via WhatsApp.',
        highlight:
            'React 19 + React Router 7, WCAG 2.2 AA, Web Vitals reais e Sentry monitorando produção; testes unitários (Vitest), e2e (Playwright) e Lighthouse CI no pipeline.',
        stack: [
            siReact,
            siTypescript,
            siVite,
            siTailwindcss,
            siReactrouter,
            siSentry,
        ],
        visibility: 'public',
        links: {
            code: 'https://github.com/LeidejanedaRosa/faladoria-web',
            demo: 'https://faladoria-web.vercel.app/',
        },
    },
    {
        id: 'fcr-backend',
        title: 'FCR — Backend',
        summary:
            'Geração de certificados em lote (CSV) para cursos e treinamentos, com QR Code de verificação e upload automático pro Google Drive.',
        highlight:
            'API REST em Flask + MongoDB, Clean Architecture (repositórios, use cases, validação com Marshmallow) — a mesma base usada pelo CLI de geração em massa.',
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
        id: 'fcr-verificador',
        title: 'FCR — Verificador',
        summary:
            'Verificador de certificados online — lê o QR Code gerado pelo backend e confirma a validade do certificado.',
        highlight:
            'Offline-first (Service Worker), 100% testado com Jest, WCAG 2.1 AAA — JavaScript vanilla + Tailwind, sem framework.',
        stack: [siJavascript, siTailwindcss, siJest],
        visibility: 'private',
        links: {
            demo: 'https://validar-certificado.fcrcursosetreinamentos.com.br/',
        },
        demoNote: 'Ainda em desenvolvimento pra ficar público — use o código',
        demoCode:
            'b749b0f0631029f8bd426b736ee7debd9e208e0911119bb7fb13a9ea8f8ed7b2',
    },
    {
        id: 'emr-international',
        title: 'EMR International',
        summary:
            'Landing page institucional para treinamentos de atendimento pré-hospitalar tático.',
        highlight:
            'React 19 com PWA (service worker via Workbox), monitoramento de erros com Sentry e navegação por teclado com focus lock.',
        stack: [siReact, siVite, siTailwindcss, siSentry],
        visibility: 'public',
        links: {
            code: 'https://github.com/LeidejanedaRosa/landing-page-emr-international-frontend',
            demo: 'https://landing-page-emr-international.vercel.app/',
        },
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
            'Responsivo e acessível, do zero ao ar — o primeiro desta lista a ganhar repositório e demo abertos.',
        stack: [siTypescript, siVite, siTailwindcss, siVercel],
        visibility: 'public',
        links: {
            code: 'https://github.com/LeidejanedaRosa/landing-espaco-saude-bemestar',
            demo: 'https://landing-espaco-saude-bemestar.vercel.app',
        },
    },
];
