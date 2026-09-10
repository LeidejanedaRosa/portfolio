# Backlog — dívida técnica e pendências

> Tudo que foi **conscientemente adiado** durante a reconstrução do portfólio, com o
> motivo e onde deve ser resolvido. Atualizar sempre que algo for adiado ou concluído.
>
> Legenda de prioridade: 🔴 alta · 🟡 média · 🟢 baixa

Última atualização: 2026-09-10

---

## 1. Infra / tooling

| #   | Item                                                                                                            | Prio | Onde resolver                                          | Motivo do adiamento                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | `npm audit` — ~29 vulnerabilidades, **todas em devDependencies** (deps transitivas antigas do Vite)             | 🟡   | branch `chore/deps-audit`                              | Nenhuma vai para o bundle de produção; atualizar toolchain é tarefa própria                                                |
| 1.2 | Migração Tailwind v3 → v4 (config CSS-first `@theme`, melhor DX)                                                | 🟢   | branch `chore/tailwind-v4`                             | v4 muda formato de config e diretivas; checar compat do plugin `tailwindcss-textshadow`                                    |
| 1.3 | Aviso benigno nos testes: `Not implemented: HTMLCanvasElement.getContext()` (axe-core sondando canvas no jsdom) | 🟢   | `src/test/setup.ts` (stub)                             | Ruído no output, não quebra nada                                                                                           |
| 1.4 | Instalar `eslint-config-prettier`                                                                               | 🟢   | branch `chore/deps-audit`                              | Risco baixo hoje (tseslint recommended tem poucas regras de formatação); adicionar para blindar conflito ESLint × Prettier |
| 1.5 | Alias do Vite × tsconfig desalinhados (`@pages` no vite.config vs `@sections` no tsconfig)                      | 🟡   | branch `refactor/design-system` ou `feat/home-section` | Ninguém usa `@sections`/`@pages` ainda; alinhar antes do primeiro uso                                                      |
| 1.6 | `.prettierignore` referencia `contribuindo.md` e `LICENSE.md` que não existem                                   | 🟢   | qualquer branch de limpeza                             | Cosmético                                                                                                                  |

## 2. CI / CD

| #   | Item                                                                                       | Prio | Onde resolver                            | Motivo do adiamento                                  |
| --- | ------------------------------------------------------------------------------------------ | ---- | ---------------------------------------- | ---------------------------------------------------- |
| 2.1 | **Branch protection no `main`**: exigir check da CI + exigir PR antes do merge             | 🔴   | GitHub → Settings → Rules (não é código) | CI roda mas não bloqueia merge sem isso              |
| 2.2 | **CD (deploy automático)** — escolher host (GitHub Pages / Vercel / Netlify) e automatizar | 🟡   | branch `cd/deploy`                       | Decisão de produto pendente (ver §5)                 |
| 2.3 | Metas de cobertura por seção no `vitest.config.ts` (`coverage.thresholds`)                 | 🟡   | ao construir cada `feat/*`               | Sem seções construídas, medir cobertura não diz nada |
| 2.4 | Upload de cobertura (Codecov ou similar)                                                   | 🟢   | branch `cd/deploy` ou depois             | Precisa de conta/token externo                       |

## 3. Testes

| #   | Item                                                                                                                                        | Prio | Onde resolver                | Motivo do adiamento                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------- | -------------------------------------------------------------------- |
| 3.1 | **Testes e2e / regressão visual (Playwright)** — tokens de design, layout responsivo, scroll suave e dark mode não são testáveis em unidade | 🔴   | branch `test/e2e-playwright` | Precisa de navegador real; montar depois que houver telas de verdade |
| 3.2 | Teste de a11y (`axe`) em **cada** componente conforme forem (re)construídos                                                                 | 🔴   | cada `feat/*`                | A infra já existe (`vitest-axe`); falta aplicar                      |

## 4. Código existente a corrigir (durante a reconstrução de cada parte)

| #   | Item                                                                                                                                                                                              | Prio | Onde resolver                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------ |
| 4.1 | `src/app.tsx` — resquício `<div className="App">` (CRA); só monta `<HomePage/>`, as outras seções nem entram na árvore                                                                            | 🔴   | `feat/home-section`                              |
| 4.2 | **Home** — `w-screen` gera scroll horizontal; `position: fixed` em tudo; `<h1>` solto em `<div>` (sem `<section>`/`<main>`); foto de perfil é `background-image` (sem `<img alt>`); sem landmarks | 🔴   | `feat/home-section`                              |
| 4.3 | `DarkModeButton` — botão só com ícone, **sem `aria-label`** (axe reprova) + estado local não aplica `.dark` no `<html>` nem persiste                                                              | 🔴   | `feat/dark-mode`                                 |
| 4.4 | `NavBar` — `activeTab` não é lido por ninguém; não é navegação real; tooltip só em `group-hover` (sem foco de teclado)                                                                            | 🔴   | `feat/navbar-scroll`                             |
| 4.5 | `HamburgerMenu` — verificar focus trap, fechar no `ESC`, `aria-expanded`, ordem de foco                                                                                                           | 🟡   | `feat/navbar-scroll` ou branch própria           |
| 4.6 | ~~`font-sacramento` em `home/index.tsx`~~ ✅ trocado por `font-mono` e removido do config em `refactor/design-system`. Falta a Home consumir os tokens de verdade                                 | 🟡   | `feat/home-section`                              |
| 4.7 | Seções `about-me`, `projects`, `contact` são stubs (`<div>Texto</div>`)                                                                                                                           | 🔴   | `feat/about-me`, `feat/projects`, `feat/contact` |

## 5. SEO / conteúdo / privacidade

| #   | Item                                                                                                                                                   | Prio | Onde resolver                             | Motivo do adiamento                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | ----------------------------------------- | ---------------------------------------------------------------------- |
| 5.1 | `index.html` — `og:url` aparece **duas vezes** (GitHub + LinkedIn) → OG inválido (`theme-color` ✅ já casado com a paleta em `refactor/design-system`) | 🟡   | branch SEO                                | Correções de SEO agrupadas numa branch única                           |
| 5.2 | Google Tag Manager (`GTM-KLCNXQQ`) presente — confirmar se é desejado + banner de consentimento (LGPD/GDPR)                                            | 🟡   | decisão + branch `feat/analytics-consent` | Depende da decisão 6.3 (manter ou não analytics)                       |
| 5.3 | Sem `robots.txt` nem `sitemap.xml`                                                                                                                     | 🟡   | branch SEO                                | Só faz sentido quando a URL pública de produção estiver definida (6.1) |
| 5.4 | Structured data JSON-LD (`Person` / `WebSite`) para rich results                                                                                       | 🟢   | branch SEO                                | Ganho pequeno antes do conteúdo real das seções existir                |
| 5.5 | Estratégia de `<h1>` único + meta description coerente numa SPA                                                                                        | 🟡   | branch SEO                                | Depende da estrutura final das seções                                  |
| 5.6 | README ainda é o template do Vite — reescrever (o que é, stack, scripts, arquitetura, como rodar)                                                      | 🟡   | branch `docs/readme`                      | Reescrever só quando a arquitetura estabilizar                         |
| 5.7 | Rodar a skill com `--persist` para gerar `design-system/MASTER.md` (retrieval entre sessões)                                                           | 🟢   | `refactor/design-system`                  | Opcional — ajuda sessões futuras, não bloqueia nada                    |

## 6. Decisões pendentes (precisam da Leidejane)

| #   | Decisão                                                                                                           | Impacto                                   |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 6.1 | Onde hospedar (GitHub Pages / Vercel / Netlify)                                                                   | Define a branch de CD e config de build   |
| 6.2 | Domínio próprio?                                                                                                  | DNS + config do host + `og:url`           |
| 6.3 | Manter o Google Tag Manager / analytics?                                                                          | Precisa de banner de consentimento se sim |
| 6.4 | Seção Contato: formulário real (precisa de backend/serviço tipo Formspree/EmailJS) **ou** links `mailto:` + redes | Escopo da branch `feat/contact`           |
| 6.5 | Migrar para Tailwind v4 agora ou depois?                                                                          | Ver §1.2                                  |

---

## Concluído (histórico)

- ✅ `chore/testing-setup` — Vitest 3 + Testing Library + vitest-axe (PR #3, merge em `main`)
- ✅ `chore/husky` — hooks pre-commit / pre-push + lint-staged (PR #2 → dev-tooling → PR #3)
- ✅ `ci/github-actions` — pipeline lint · types · test · build (PR #4, merge em `main`)
