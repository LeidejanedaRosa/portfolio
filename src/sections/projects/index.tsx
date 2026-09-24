import {
    motion,
    useScroll,
    useTransform,
    type MotionValue,
} from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
    /** Contexto curto sobre o estado da demo (ex.: ainda não é pública). */
    demoNote?: string;
    /** Código de exemplo pra testar a demo (ex.: certificado). Campo à
     * parte pra poder aplicar `break-all` só nele, não na frase toda. */
    demoCode?: string;
    codeSnippet?: { filename: string; language: string; code: string };
}

const PROJECTS: readonly Project[] = [
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

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const number = String(index + 1).padStart(2, '0');

    return (
        <BlueprintFrame className="h-full p-6">
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

            {project.demoNote && (
                <p className="mt-3 text-sm italic text-muted-foreground">
                    {project.demoNote}
                    {project.demoCode && (
                        <>
                            {' '}
                            <code className="break-all font-mono not-italic">
                                {project.demoCode}
                            </code>
                        </>
                    )}
                    {project.demoCode && ' pra testar a verificação.'}
                </p>
            )}
        </BlueprintFrame>
    );
}

function ProjectPreview({
    title,
    url,
    hugCenter,
}: {
    title: string;
    url: string;
    /** Borda da coluna voltada pro traço central — o box de 375px gruda
     * nela (em vez de `mx-auto`) pro traço de comprimento fixo sempre
     * alcançar a borda de verdade do iframe. */
    hugCenter: 'left' | 'right';
}) {
    return (
        <div className="flex h-full min-h-80 flex-col">
            <div className="flex shrink-0 items-center justify-between gap-3 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Exemplo ao vivo
                </span>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-xs text-accent hover:underline"
                >
                    Abrir em nova aba <span aria-hidden="true">↗</span>
                </a>
            </div>
            {/* min-h-0: um item flex não encolhe abaixo da altura natural
                do conteúdo por padrão — sem isso, o flex-1 do iframe nunca
                igualaria a altura do card ao lado. max-w-[375px]: largura
                de viewport mobile (ex. iPhone SE/8), pro site carregar no
                layout responsivo dele em vez de espremer o desktop. */}
            <div
                className={`min-h-0 w-full max-w-[375px] flex-1 overflow-hidden rounded-3xl border border-border ${
                    hugCenter === 'left' ? 'mr-auto' : 'ml-auto'
                }`}
            >
                {/* loading="lazy": evita carregar 4 sites externos inteiros
                    junto com a Home (impacto de performance conhecido, ver
                    docs/BACKLOG.md). */}
                <iframe
                    src={url}
                    title={`Pré-visualização ao vivo de ${title}`}
                    loading="lazy"
                    // allow-same-origin: o Verificador do FCR é
                    // offline-first via Service Worker, que exige o mesmo
                    // origin do iframe pra registrar. Sem allow-top-navigation
                    // nem allow-popups: o site embutido não pode redirecionar
                    // a aba inteira nem abrir popups. Sem allow-downloads:
                    // nenhum dos sites embutidos oferece download.
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    className="h-full w-full"
                />
            </div>
        </div>
    );
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Hook local (não o `useReducedMotion` do Framer Motion) pelo mesmo motivo
// documentado em <SkillsFlow />: a lib guarda o valor inicial numa
// referência de módulo e não reage a um `matchMedia` mockado depois que ela
// já carregou — em teste, o mock nunca "pega".
function usePrefersReducedMotion() {
    const [prefersReduced, setPrefersReduced] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia(REDUCED_MOTION_QUERY).matches,
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
        const handleChange = (event: MediaQueryListEvent) =>
            setPrefersReduced(event.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReduced;
}

// Comprimento do traço que liga a bolinha central ao card/iframe: metade do
// gap do grid (1.5rem) + o padding que afasta o card dessa borda (3rem) —
// preso aos mesmos valores em rem das classes do grid logo abaixo; mudar um
// sem o outro faz o traço parar antes da borda.
const TICK_LENGTH = 'w-[4.5rem]';

// Janela de progresso (0–1, mesma escala do `scrollYProgress`) em que a
// bolinha enche e o traço se estende, sincronizado com a luzinha cruzando
// aquele card.
const SYNC_WINDOW = 0.02;

function ConnectorTick({
    direction,
    scaleX,
}: {
    direction: 'left' | 'right';
    scaleX: MotionValue<number> | number;
}) {
    return (
        <motion.span
            aria-hidden="true"
            style={{ scaleX }}
            className={`absolute top-1/2 hidden h-0.5 ${TICK_LENGTH} -translate-y-1/2 bg-accent/50 md:block ${
                direction === 'left'
                    ? 'right-1/2 origin-right'
                    : 'left-1/2 origin-left'
            }`}
        />
    );
}

function TimelineRow({
    project,
    index,
    liRef,
    threshold,
    scrollYProgress,
    prefersReducedMotion,
}: {
    project: Project;
    index: number;
    liRef: (el: HTMLLIElement | null) => void;
    /** Posição da bolinha deste card, como fração (0–1) da altura total da
     * lista — mesmo referencial do `scrollYProgress` (ver medição em
     * `Projects`), então dá pra comparar os dois direto. */
    threshold: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    const isEven = index % 2 === 0;
    // row-start-1 explícito nos dois: sem isso, quando o card cai na
    // coluna 2, o cursor de auto-posicionamento do grid avança pra "linha
    // 2" do mini-grid deste <li>, e o preview (sem linha própria) fica
    // abaixo do card em vez de ao lado.
    const cardColumn = isEven
        ? 'md:row-start-1 md:pr-12'
        : 'md:col-start-2 md:row-start-1 md:pl-12';
    const previewColumn = isEven
        ? 'md:col-start-2 md:row-start-1 md:pl-12'
        : 'md:row-start-1 md:pr-12';

    // Bolinha enche em [threshold-SYNC_WINDOW, threshold]; traço estende
    // logo depois, em [threshold, threshold+SYNC_WINDOW] — a sequência
    // "luz chega → bolinha enche → risco sai dela" sai de graça por serem
    // janelas de progresso consecutivas, sem precisar de delay/duração.
    const fillScale = useTransform(
        scrollYProgress,
        [threshold - SYNC_WINDOW, threshold],
        [0, 1],
        { clamp: true },
    );
    const tickScale = useTransform(
        scrollYProgress,
        [threshold, threshold + SYNC_WINDOW],
        [0, 1],
        { clamp: true },
    );

    return (
        <li
            ref={liRef}
            // Sem `items-start`: o padrão do grid (`stretch`) é o que faz
            // o card e o preview terem a mesma altura na mesma linha.
            className="relative md:grid md:grid-cols-2 md:gap-x-12 [&:not(:last-child)]:mb-12 md:[&:not(:last-child)]:mb-16"
        >
            <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background md:block"
            >
                {prefersReducedMotion ? (
                    <span className="absolute inset-0.5 rounded-full bg-accent" />
                ) : (
                    <motion.span
                        style={{ scale: fillScale }}
                        className="absolute inset-0.5 rounded-full bg-accent"
                    />
                )}
            </span>

            <ConnectorTick
                direction={isEven ? 'left' : 'right'}
                scaleX={prefersReducedMotion ? 1 : tickScale}
            />

            {/* Traço até o iframe, do lado oposto ao do card — só quando
                há demo pública. */}
            {project.links?.demo && (
                <ConnectorTick
                    direction={isEven ? 'right' : 'left'}
                    scaleX={prefersReducedMotion ? 1 : tickScale}
                />
            )}

            <div className={cardColumn}>
                <ProjectCard project={project} index={index} />
            </div>

            {project.links?.demo && (
                <div className={`${previewColumn} mt-8 md:mt-0`}>
                    <ProjectPreview
                        title={project.title}
                        url={project.links.demo}
                        hugCenter={isEven ? 'left' : 'right'}
                    />
                </div>
            )}
        </li>
    );
}

export const Projects = () => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const timelineRef = useRef<HTMLUListElement>(null);
    const liRefs = useRef<(HTMLLIElement | null)[]>([]);
    // 1 (não 0): antes da primeira medição, deixa o threshold de todo card
    // fora do alcance do progresso de scroll real no primeiro paint — senão
    // as bolinhas piscariam preenchidas por um instante.
    const [thresholds, setThresholds] = useState<number[]>(() =>
        PROJECTS.map(() => 1),
    );

    // Progresso 0→1 conforme a <ul> é rolada: 0 quando o card 01 começa a
    // aparecer vindo de baixo, 1 quando o último card sai por cima.
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start end', 'end start'],
    });
    const lightTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    // Posição de cada bolinha (centro vertical do <li>) como fração 0–1 da
    // altura da lista — mesmo referencial do `scrollYProgress`, comparado
    // direto em `TimelineRow`. `useLayoutEffect`: mede antes do primeiro
    // paint, sem flash. ResizeObserver na <ul> (não só `resize` da window):
    // a altura da lista também muda quando um <details> de código abre —
    // mesmo padrão de <Layout /> pro --nav-height.
    useLayoutEffect(() => {
        const ul = timelineRef.current;
        if (!ul) return;

        function measure() {
            const ulHeight = ul.offsetHeight;
            if (!ulHeight) return;

            setThresholds(
                liRefs.current.map((li) =>
                    li ? (li.offsetTop + li.offsetHeight / 2) / ulHeight : 1,
                ),
            );
        }

        measure();

        if (typeof ResizeObserver === 'undefined') {
            // Navegador sem suporte (raro hoje): mede uma vez no mount e
            // segue sem observar — melhor que quebrar o app inteiro.
            return;
        }

        const observer = new ResizeObserver(measure);
        observer.observe(ul);
        return () => observer.disconnect();
    }, []);

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
                Os seis projetos abaixo são reais — a maioria é trabalho de
                cliente ou de impacto social. Nos que ainda são privados, você
                encontra um trecho real de código ou um link pra testar ao vivo;
                nos que já são públicos, dá pra ver o código e o site no ar.
            </p>

            <ul ref={timelineRef} className="relative mt-16">
                {/* Linha central: só existe em telas médias+ (é ela que faz
                    os cards alternarem lado a lado; em coluna única, no
                    mobile, não há "lado" pra marcar). */}
                <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 border-l-2 border-dashed border-accent/40 md:block"
                />
                <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-0 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
                />
                <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent md:block"
                />

                {!prefersReducedMotion && (
                    <motion.div
                        aria-hidden="true"
                        style={{
                            top: lightTop,
                            filter: 'drop-shadow(0 0 4px rgb(var(--color-accent) / 0.85))',
                        }}
                        className="pointer-events-none absolute left-1/2 z-20 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent md:block"
                    />
                )}

                {PROJECTS.map((project, index) => (
                    <TimelineRow
                        key={project.id}
                        project={project}
                        index={index}
                        liRef={(el) => {
                            liRefs.current[index] = el;
                        }}
                        threshold={thresholds[index] ?? 1}
                        scrollYProgress={scrollYProgress}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                ))}
            </ul>
        </section>
    );
};
