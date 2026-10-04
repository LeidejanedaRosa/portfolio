import { expect, test } from '@playwright/test';

// Achado da auditoria de 2026-10: a URL do LinkedIn no JSON-LD tinha
// divergido da URL real usada no link visível da seção Contato, e nada
// detectou isso — `index.html` nunca é importado pelos testes unitários
// (não faz parte da árvore React), e não existia nenhum teste e2e cobrindo
// o <head>. Esses dois testes travam a identidade canônica da página (URL
// oficial + metadados que apontam pra fora, tipo o schema.org Person).
test('a página declara um canônico apontando pro domínio oficial', async ({
    page,
}) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
        'href',
        'https://leidejanedarosa.dev.br/',
    );
});

test('o JSON-LD (schema.org Person) aponta pro mesmo LinkedIn do link real na seção Contato', async ({
    page,
}) => {
    await page.goto('/');

    const jsonLd = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
    const data = JSON.parse(jsonLd ?? '{}');

    expect(data.sameAs).toContain('https://www.linkedin.com/in/leidejane/');

    // Só confere o atributo (sem clicar/precisar que esteja visível): o
    // banner de cookies fixo no rodapé não atrapalha essa leitura.
    const contactLinkedIn = page.getByRole('link', { name: /linkedin/i });
    await expect(contactLinkedIn).toHaveAttribute(
        'href',
        'https://www.linkedin.com/in/leidejane/',
    );
});
