import { expect, test } from '@playwright/test';

// Todo teste aqui recusa cookies primeiro: sem isso, o banner fixo no rodapé
// fica sobrepondo o conteúdo e atrapalhando cliques em elementos por trás dele.
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Recusar' })
        .click();
});

test('carrega a home com o nome e navega pelas seções via navbar', async ({
    page,
}) => {
    await expect(
        page.getByRole('heading', { level: 1, name: /leidejane da rosa/i }),
    ).toBeVisible();

    const nav = page.getByRole('navigation', { name: 'Principal' });

    await nav.getByRole('link', { name: 'Sobre' }).click();
    await expect(
        page.getByRole('heading', {
            level: 2,
            name: /desenvolvedora full stack/i,
        }),
    ).toBeInViewport();

    await nav.getByRole('link', { name: 'Projetos' }).click();
    await expect(
        page.getByRole('heading', { level: 2, name: /projetos/i }),
    ).toBeInViewport();

    await nav.getByRole('link', { name: 'Contato' }).click();
    await expect(
        page.getByRole('heading', { level: 2, name: /contato/i }),
    ).toBeInViewport();
});

test('alterna o dark mode e persiste depois de recarregar', async ({
    page,
}) => {
    const toggle = page.getByRole('button', { name: 'Modo escuro' });

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload();
    // recusar persiste, mas o tema TAMBÉM precisa sobreviver ao reload —
    // é o próprio propósito do anti-flash script em index.html.
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(
        page.getByRole('button', { name: 'Modo escuro' }),
    ).toHaveAttribute('aria-pressed', 'true');
});
