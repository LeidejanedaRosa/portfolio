# Portfolio — padrão específico deste projeto

Este projeto segue o padrão de engenharia global da autora (`~/.claude/CLAUDE.md`):
arquitetura por tier, Definition of Done, template de PR, audit em duas
velocidades, commits, branches. Este arquivo documenta só o que é **específico**
deste repositório — pra quem abrir o projeto sem o contexto da sessão que definiu
isso, sem depender de memória entre conversas.

## Tier: 1 (estático/simples)

Portfólio pessoal, sem backend, sem lógica de negócio real. Por isso este projeto
**não** usa DDD/FDD nem Sonar/Sentry no CI (regras do padrão global reservadas pra
Tier 2/3) — usa Atomic Design no front, e a auditoria de qualidade completa mesmo
assim (Lighthouse, Playwright, gitleaks), porque a11y/SEO/segurança valem pra
qualquer tier.

## Stack confirmada

- React 19 + TypeScript + Vite 6
- Tailwind CSS 3.4 (tokens em `src/index.css`, ver Design abaixo)
- Framer Motion — motion ~200ms, sempre respeitando `prefers-reduced-motion`
- Vitest + Testing Library + vitest-axe (unitário/componente + a11y)
- Playwright — chromium, firefox, webkit (`e2e/`)
- Lighthouse CI (`lighthouserc.cjs`) — a11y/SEO/best-practices ≥ 90 falha o build;
  performance ainda só avisa (nota real hoje ~60, otimizar bundle/fonts é trabalho
  futuro, não travado ainda)
- Husky + lint-staged + gitleaks (**binário real**, não pacote npm — precisa
  instalar à parte, ver README)
- ESLint + Prettier

## Arquitetura

Atomic Design (`src/components/{atoms,molecules,organisms}`) pros blocos de UI
reutilizáveis + `src/sections/` pro conteúdo de cada seção da página (Home, Sobre,
Projetos, Contato). Não existe camada `templates`/`pages` separada — é uma
simplificação consciente pro Tier 1, documentada em `docs/BACKLOG.md`, não um
esquecimento.

## Design system confirmado

- Estilo: Minimalismo & Swiss Style — grid rígido, geométrico, whitespace, alto
  contraste. Evoca "arquitetura de software / rigor de engenharia".
- Tipografia: JetBrains Mono (headings) + IBM Plex Sans (body), self-hosted via
  `@fontsource-variable` (sem CDN de terceiro).
- Cor: família slate + sky do Tailwind. `primary #0F172A`, `secondary #334155`,
  `accent/CTA #0369A1`, `background #F8FAFC`, `border #E2E8F0`, `error #DC2626`.
  Dark mode inverte (tokens custom properties em `src/index.css`, `@layer base`).
- Navegação: single-page com scroll suave + `IntersectionObserver` pra marcar a
  aba ativa (`use-active-section`).

## Consentimento de cookies (LGPD)

O GTM só carrega depois do aceite explícito (`src/consent`) — nunca no
carregamento da página. Google Consent Mode v2 (`gtag('consent', 'default'/
'update', ...)`) declarado em `index.html`, atualizado em aceitar/recusar/
redefinir — inclusive revoga rastreamento no meio da sessão, não só depois de um
reload.

## Deploy

Hospedado no Vercel: [leidejanedarosa.vercel.app](https://leidejanedarosa.vercel.app/).
Deploy automático a cada push em `main`, preview automático por PR. Sem domínio
próprio ainda (ver `docs/BACKLOG.md` §6.2).

## Pendências conhecidas

- **Performance do Lighthouse (~60) não otimizada ainda** — bundle JS (~365KB) e
  imagens (`desk-scene.webp`, 236KB) são os suspeitos mais prováveis.
- Histórico completo de decisões de produto/design e outras pendências:
  [`docs/BACKLOG.md`](docs/BACKLOG.md).
