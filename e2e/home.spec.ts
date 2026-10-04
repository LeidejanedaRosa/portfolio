import { expect, test } from '@playwright/test';

// Recusa cookies primeiro: sem isso, o banner fixo no rodapé sobrepõe
// conteúdo e atrapalha cliques em elementos por trás dele (mesmo padrão de
// navigation.spec.ts/projects.spec.ts).
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Recusar' })
        .click();
});

// Regressão: a Home usava o `useReducedMotion` do framer-motion (não o hook
// compartilhado do projeto), que cacheia o valor numa referência de módulo —
// um teste unitário com `matchMedia` mockado DEPOIS da 1ª renderização nunca
// pegava o mock de verdade, então o parallax continuava ligado em teste
// mesmo "testando" o caso contrário. jsdom também não consegue simular
// scroll real pra essa verificação (o valor de `useTransform` só diverge do
// fixo depois que a página rola de verdade) — por isso esse teste vive aqui,
// num navegador real, e não como unitário.
test('rolar a Home move o fundo (parallax) — e para de mover com prefers-reduced-motion', async ({
    page,
}) => {
    const bg = page.locator('#home img[aria-hidden="true"]');

    const beforeTransform = await bg.evaluate(
        (el) => getComputedStyle(el).transform,
    );

    await page.mouse.wheel(0, 400);

    // poll em vez de waitForTimeout fixo: espera o `transform` de verdade
    // mudar (o scroll-linked `useTransform` recalcula via rAF do navegador,
    // não é instantâneo), em vez de um tempo fixo adivinhado.
    await expect
        .poll(() => bg.evaluate((el) => getComputedStyle(el).transform))
        .not.toBe(beforeTransform);
});

test('com prefers-reduced-motion, o fundo da Home não se move ao rolar', async ({
    page,
}) => {
    // Sem novo clique em "Recusar" depois do reload: a escolha já ficou
    // salva no localStorage no `beforeEach`, o banner não volta a aparecer.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    const bg = page.locator('#home img[aria-hidden="true"]');

    const beforeTransform = await bg.evaluate(
        (el) => getComputedStyle(el).transform,
    );

    await page.mouse.wheel(0, 400);

    // Provar "nunca mudou" não dá pra fazer com `expect.poll` do jeito
    // comum (que espera uma condição ficar VERDADEIRA, não permanecer
    // falsa) — em vez de um `waitForTimeout` único e arbitrário, usa o
    // mesmo mecanismo de "N leituras seguidas iguais" de
    // navigation.spec.ts: só passa depois de READS_TO_CONFIRM leituras
    // consecutivas batendo com o valor original (uma mudança que
    // acontecesse OU uma leitura que mudasse e voltasse derrubaria o
    // contador de volta a zero).
    const READS_TO_CONFIRM = 3;
    let matchingReads = 0;
    await expect
        .poll(
            async () => {
                const transform = await bg.evaluate(
                    (el) => getComputedStyle(el).transform,
                );
                matchingReads =
                    transform === beforeTransform ? matchingReads + 1 : 0;
                return matchingReads;
            },
            { intervals: [50] },
        )
        .toBeGreaterThanOrEqual(READS_TO_CONFIRM);
});
