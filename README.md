# Portfolio

Site pessoal de portfólio — single-page, minimalista/Swiss style, com dark mode, navegação por
scroll-spy e diagrama animado de skills.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 3** (tokens em `src/theme`)
- **Framer Motion** para animação (respeitando `prefers-reduced-motion`)
- **Vitest** + **Testing Library** + **vitest-axe** para testes unitários/componente e a11y
- **ESLint** + **Prettier** + **Husky/lint-staged**

## Arquitetura

Atomic Design para blocos de UI reutilizáveis, e uma pasta `sections` para o conteúdo de cada
seção da página (não existe camada `templates`/`pages` separada — ver `docs/BACKLOG.md`):

```
src/
  components/
    atoms/        # blueprint-frame, code-snippet, skill-node, tech-icon
    molecules/    # dark-mode, skills-flow
    organisms/    # layout, navigation
  sections/       # home, about-me, projects, contact
  theme/          # ThemeProvider/useTheme (dark mode)
  lib/            # utilitários (ex: brand-hover-color)
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
npm run build   # tsc -b && vite build
npm run preview # serve o build de /dist localmente
```

## Qualidade

- Pre-commit (Husky): scan de segredos (`gitleaks protect --staged`) + lint + testes afetados
  via `lint-staged`.
- Pre-push (Husky): checagem de tipos + suite completa de testes.
- CI (GitHub Actions, `.github/workflows/ci.yml`): scan de segredos (`gitleaks`), lint,
  type-check, testes, build, e2e (Playwright, 3 browsers) e Lighthouse CI em todo push/PR pra
  `main`. Thresholds do Lighthouse (`lighthouserc.cjs`): a11y/SEO/best-practices ≥ 90 (falha o
  build); performance ainda só avisa (nota real ~60 hoje — otimizar é trabalho futuro, travar o
  build nisso agora só bloquearia PRs sem ninguém ter mexido em performance ainda).
- Padrão de engenharia completo (arquitetura por tier, Definition of Done, PR template,
  auditoria) segue o padrão pessoal da autora. Especificidades deste projeto (tier, stack,
  design system, pendências) estão versionadas em [`CLAUDE.md`](CLAUDE.md), na raiz.

## Backlog e decisões

Ver [`docs/BACKLOG.md`](docs/BACKLOG.md) para o histórico de decisões de produto/design e
pendências conhecidas.
