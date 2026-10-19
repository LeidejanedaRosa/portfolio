# Portfolio

Site pessoal de portfólio — single-page, minimalista/Swiss style, com dark mode, navegação por
scroll-spy e diagrama animado de skills.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 4** (config CSS-first via `@theme`, plugin oficial `@tailwindcss/vite`) —
  tokens de tema (dark mode) em `src/theme`
- **Framer Motion** para animação (respeitando `prefers-reduced-motion`)
- **Vitest** + **Testing Library** + **vitest-axe** para testes unitários/componente e a11y
- **ESLint** + **Prettier** + **Husky/lint-staged**

## Arquitetura

Atomic Design para blocos de UI reutilizáveis, e uma pasta `sections` para o conteúdo de cada
seção da página (não existe camada `templates`/`pages` separada — ver `docs/BACKLOG.md`):

```
src/
  components/
    atoms/        # blueprint-frame, code-snippet, dimension-line, reveal, skill-node,
                  # tech-icon
    molecules/general/ # cookie-consent, course-list, dark-mode, duotone-background-image,
                  # education-list, experience-timeline, glow-portrait, privacy-dialog,
                  # skills-flow, story-cards, tech-carousel, themed-background-image
    organisms/general/ # layout, navigation
  sections/       # home, about-me, projects, faq, contact
  theme/          # ThemeProvider/useTheme (dark mode)
  consent/        # ConsentProvider/useConsent (LGPD — ver seção de Qualidade)
  lib/            # utilitários (ex: brand-hover-color, use-resize-observer)
  entry-server.tsx # pré-renderização em build (ver seção Build abaixo)
  test/           # setup global de testes
```

Cada componente/seção tem seu teste colocado ao lado (`index.test.tsx`).

## Requisitos locais

- Node (versão em `.nvmrc`)
- [`gitleaks`](https://github.com/gitleaks/gitleaks#installing) instalado e no `PATH` — o
  pre-commit do Husky bloqueia o commit se não encontrar o binário.
- Browsers do Playwright: `npx playwright install chromium firefox webkit` (primeira vez, ou
  de novo se a versão do `@playwright/test` em `package.json` mudar).

## Como rodar

```bash
cp .env.example .env   # hoje não tem nenhuma variável de verdade — ver comentário no arquivo
npm install
npm run dev       # http://localhost:5173
```

## Como testar

```bash
npm test              # testes unitários/componente (vitest)
npm run test:watch    # modo watch
npm run test:coverage # com cobertura
npm run test:types    # checagem de tipos dos testes
npm run test:e2e      # e2e (Playwright: chromium, firefox, webkit) — builda e serve sozinho,
                       # requer os browsers instalados (ver Requisitos locais)
npm run test:lighthouse # Lighthouse CI contra o build (requer `npm run build` antes)
npm run lint           # ESLint
npm run format          # Prettier --write
```

## Build

```bash
npm run build   # tsc -b && vite build (cliente) && vite build --ssr (entry-server.tsx) &&
                 # scripts/prerender.mjs injeta o HTML já renderizado em dist/index.html
npm run preview # serve o build de /dist localmente
```

`npm run build` pré-renderiza a página em build-time (`react-dom/server`, ver
`src/entry-server.tsx` e `scripts/prerender.mjs`): o `<div id="root">` de `dist/index.html`
já chega com o HTML real, e o cliente hidrata (`hydrateRoot`) em vez de montar do zero — sem
isso, a página fica em branco sem JavaScript e o LCP espera o React montar tudo (achado da
auditoria de 2026-10). `src/index.tsx` decide `hydrateRoot` vs `createRoot` sozinho (olha se
`#root` já tem conteúdo) — funciona em dev (`vite dev`) sem esse passo também.

## Qualidade

- Pre-commit (Husky): scan de segredos (`gitleaks protect --staged`) + lint + testes afetados
  via `lint-staged`.
- Pre-push (Husky): checagem de tipos + suite completa de testes.
- Todo PR usa o template em [`.github/pull_request_template.md`](.github/pull_request_template.md)
  automaticamente — preencher, ou marcar `N/A` na seção que não se aplicar.
- CI (GitHub Actions, `.github/workflows/ci.yml`): scan de segredos (`gitleaks`), lint,
  type-check, testes, build, e2e (Playwright, 3 browsers) e Lighthouse CI em todo push/PR pra
  `main`. Thresholds do Lighthouse (`lighthouserc.cjs`): a11y/SEO/best-practices ≥ 90 e
  performance ≥ 80 — as 4 categorias travam o build (`error`). Performance passou a travar
  depois da pré-renderização + lazy-loading das imagens de fundo abaixo da dobra (achado da
  auditoria de 2026-10: nota real foi de ~60 pra ~85).
- Padrão de engenharia completo (arquitetura por tier, Definition of Done, PR template,
  auditoria) segue o padrão pessoal da autora. Especificidades deste projeto (tier, stack,
  design system, pendências) estão versionadas em [`CLAUDE.md`](CLAUDE.md), na raiz.
- `vercel.json` declara Content-Security-Policy e outros headers de segurança (defesa em
  profundidade pro GTM pós-consentimento). `script-src` trava num allowlist de hashes sha256 dos
  2 `<script>` inline de `index.html` — editou um deles? Rode `npm run build && npm run csp:hashes`
  e atualize os hashes em `vercel.json`, senão o CSP bloqueia o script em silêncio.

## Backlog e decisões

Ver [`docs/BACKLOG.md`](docs/BACKLOG.md) para o histórico de decisões de produto/design e
pendências conhecidas.
