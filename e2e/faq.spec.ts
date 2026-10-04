import { expect, test } from '@playwright/test';

// Recusa cookies primeiro: sem isso, o banner fixo no rodapé sobrepõe
// conteúdo e atrapalha cliques em elementos por trás dele (mesmo padrão de
// navigation.spec.ts/projects.spec.ts/home.spec.ts).
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Recusar' })
        .click();
    await page
        .getByRole('heading', { level: 2, name: /perguntas frequentes/i })
        .scrollIntoViewIfNeeded();
});

// Achado da auditoria de 2026-10: o único teste que existia pra isso
// (`src/sections/faq/index.test.tsx`) só conferia se todo <details> tinha
// `name="faq"` — nunca abria duas perguntas pra provar a exclusão mútua. E
// não dava pra provar isso no jsdom mesmo: ele não implementa a
// exclusividade nativa do atributo `name` em `<details>` (feature só de
// navegador real). Esse comportamento ficava sem nenhuma cobertura de
// verdade — exatamente o risco apontado na auditoria.
test('abrir uma pergunta do FAQ fecha a que estava aberta antes (accordion nativo via name="faq")', async ({
    page,
}) => {
    const first = page
        .locator('details', { hasText: 'Por que alguns projetos' })
        .first();
    const second = page
        .locator('details', { hasText: 'Quanto tempo dura um projeto' })
        .first();

    await expect(first).not.toHaveAttribute('open', '');
    await expect(second).not.toHaveAttribute('open', '');

    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await expect(second).not.toHaveAttribute('open', '');

    await second.locator('summary').click();
    await expect(second).toHaveAttribute('open', '');
    // a exclusividade de verdade: abrir a 2ª precisa fechar a 1ª sozinha,
    // sem nenhum código React cuidando disso.
    await expect(first).not.toHaveAttribute('open', '');
});
