import { expect, test, type Page } from '@playwright/test';

// A troca entre celular e desktop no Sobre é feita só com classes do Tailwind
// (a página é pré-renderizada) — o teste unitário confere as classes, mas só
// um navegador de verdade prova que o CSS esconde/mostra o que deveria.

const courseItems = (page: Page) =>
    page
        .getByRole('list')
        .filter({ hasText: 'Curso Básico de Python' })
        .getByRole('listitem');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Recusar' })
        .click();
});

test.describe('celular', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('mostra 2 cursos e o botão revela os outros 8', async ({ page }) => {
        const items = courseItems(page);
        await expect(items.filter({ visible: true })).toHaveCount(2);

        await page
            .getByRole('button', { name: 'Ver todos os cursos (10)' })
            .click();

        await expect(items.filter({ visible: true })).toHaveCount(10);
    });

    test('mantém as ferramentas no carrossel, sem a lista parada', async ({
        page,
    }) => {
        await expect(
            page.getByRole('list', { name: 'Outras ferramentas do dia a dia' }),
        ).toBeVisible();
        await expect(
            page.getByRole('list', { name: 'Outras ferramentas', exact: true }),
        ).toBeHidden();
    });
});

test.describe('desktop', () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test('mostra os 10 cursos abertos, sem botão', async ({ page }) => {
        await expect(courseItems(page).filter({ visible: true })).toHaveCount(
            10,
        );
        await expect(
            page.getByRole('button', { name: /ver todos os cursos/i }),
        ).toBeHidden();
    });

    test('mostra as ferramentas paradas embaixo do quadro, no lugar do carrossel', async ({
        page,
    }) => {
        const tools = page.getByRole('list', {
            name: 'Outras ferramentas',
            exact: true,
        });
        await expect(tools).toBeVisible();
        await expect(tools.getByRole('listitem')).toHaveCount(11);
        await expect(
            page.getByRole('list', { name: 'Outras ferramentas do dia a dia' }),
        ).toBeHidden();
    });
});
