import { expect, test } from '@playwright/test';

// Bloqueia a rede real do GTM: sem isso, todo push no CI bateria no Google de
// verdade (lento, instável, e polui a conta real dela com tráfego de teste).
// O que testamos é o CONTRATO da nossa app (a tag aparece no DOM só depois do
// aceite) — não se o Google Tag Manager em si funciona.
test.beforeEach(async ({ page }) => {
    await page.route('**/googletagmanager.com/**', (route) => route.abort());
});

test('banner aparece na primeira visita e some ao aceitar; GTM só entra depois', async ({
    page,
}) => {
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Aviso de cookies' });
    await expect(banner).toBeVisible();
    await expect(
        page.locator('script[src*="googletagmanager.com"]'),
    ).toHaveCount(0);

    await banner.getByRole('button', { name: 'Aceitar' }).click();

    await expect(banner).toBeHidden();
    await expect(
        page.locator('script[src*="googletagmanager.com"]'),
    ).toHaveCount(1);
});

test('recusar esconde o banner e nunca injeta o GTM', async ({ page }) => {
    await page.goto('/');

    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Recusar' })
        .click();

    await expect(
        page.getByRole('region', { name: 'Aviso de cookies' }),
    ).toBeHidden();
    await expect(
        page.locator('script[src*="googletagmanager.com"]'),
    ).toHaveCount(0);
});

test('escolha sobrevive a recarregar a página (localStorage)', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Aceitar' })
        .click();

    await page.reload();

    await expect(
        page.getByRole('region', { name: 'Aviso de cookies' }),
    ).toBeHidden();
});

test('"Preferências de cookies" reabre o banner depois de decidir', async ({
    page,
}) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Aceitar' })
        .click();

    await page
        .getByRole('navigation', { name: 'Principal' })
        .getByRole('link', { name: 'Contato' })
        .click();
    await page.getByRole('button', { name: 'Preferências de cookies' }).click();

    await expect(
        page.getByRole('region', { name: 'Aviso de cookies' }),
    ).toBeVisible();
});

test.describe('diálogo de privacidade — trava o foco de verdade (regressão do finding do PR)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page
            .getByRole('region', { name: 'Aviso de cookies' })
            .getByRole('button', { name: 'Saiba mais' })
            .click();
    });

    test('Tab repetido nunca alcança os botões do banner atrás do diálogo', async ({
        page,
    }) => {
        const dialog = page.getByRole('dialog', { name: 'Privacidade' });
        await expect(dialog).toBeVisible();

        const aceitar = page.getByRole('button', { name: 'Aceitar' });
        const recusar = page.getByRole('button', { name: 'Recusar' });

        // A v1 deste componente (sem <dialog> nativo) deixava o Tab cair nos
        // botões Aceitar/Recusar do banner, que continuam no DOM por trás.
        // Com só 1 elemento focável dentro do diálogo (Fechar), o navegador
        // pode "descansar" o foco no <body> entre um ciclo e outro — isso é
        // esperado e ainda está contido (body não tem nada clicável); o que
        // não pode acontecer nunca é o foco pousar num controle real de fora.
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press('Tab');
            await expect(aceitar).not.toBeFocused();
            await expect(recusar).not.toBeFocused();
        }
    });

    test('ESC fecha e devolve o foco pro botão "Saiba mais"', async ({
        page,
    }) => {
        const trigger = page.getByRole('button', { name: 'Saiba mais' });

        await page.keyboard.press('Escape');

        await expect(
            page.getByRole('dialog', { name: 'Privacidade' }),
        ).toBeHidden();
        await expect(trigger).toBeFocused();
    });
});
