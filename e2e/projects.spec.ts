import { expect, test } from '@playwright/test';

// Recusa cookies primeiro: sem isso, o banner fixo no rodapé sobrepõe o
// conteúdo e atrapalha cliques/scroll na seção. Sem #projects na URL: a
// âncora rola a página antes mesmo do teste começar, e o teste de scroll
// (mais abaixo) precisa controlar essa posição sozinho pra medir um
// "antes" de verdade.
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
        .getByRole('region', { name: 'Aviso de cookies' })
        .getByRole('button', { name: 'Recusar' })
        .click();
});

// Card = o <li> da timeline que contém esse título — não depende de quantos
// níveis de div existem entre o <h3> e o <li> (detalhe de layout que pode
// mudar sem quebrar o teste).
function cardFor(page: import('@playwright/test').Page, title: string) {
    return page
        .locator('li')
        .filter({ has: page.getByRole('heading', { level: 3, name: title }) });
}

test('lista os seis projetos', async ({ page }) => {
    const section = page.locator('#projects');

    for (const title of [
        'Faladoria — Backend',
        'Faladoria — Frontend',
        'FCR — Backend',
        'FCR — Verificador',
        'EMR International',
        'Espaço Saúde Bem-Estar',
    ]) {
        await expect(
            section.getByRole('heading', { level: 3, name: title }),
        ).toBeVisible();
    }
});

test('projeto privado sem demo (Faladoria — Backend) expande o trecho de código real ao clicar', async ({
    page,
}) => {
    const card = cardFor(page, 'Faladoria — Backend');

    await expect(card.getByText('requireRole.ts')).toBeHidden();

    await card.getByText('Ver trecho de código').click();

    await expect(card.getByText('requireRole.ts')).toBeVisible();
    await expect(
        card.getByRole('link', { name: /ver código|ver site/i }),
    ).toHaveCount(0);
});

test('projeto público (EMR International) tem links reais pro código e pro site no ar', async ({
    page,
}) => {
    const card = cardFor(page, 'EMR International');

    await expect(
        card.getByRole('link', { name: /ver código/i }),
    ).toHaveAttribute(
        'href',
        'https://github.com/LeidejanedaRosa/landing-page-emr-international-frontend',
    );
    await expect(card.getByRole('link', { name: /ver site/i })).toHaveAttribute(
        'target',
        '_blank',
    );
});

test('projeto com demo pública mostra um preview ao vivo sandboxed', async ({
    page,
}) => {
    const iframeEl = page.locator(
        'iframe[title="Pré-visualização ao vivo de Faladoria — Frontend"]',
    );

    // Não afirmamos sobre o CONTEÚDO do site externo (dependência de rede
    // de terceiro no CI seria frágil) — só que o nosso lado (o elemento
    // iframe, com sandbox restrito) está correto.
    await expect(iframeEl).toHaveAttribute(
        'src',
        'https://faladoria-web.vercel.app/',
    );
    await expect(iframeEl).toHaveAttribute('loading', 'lazy');

    const sandbox = await iframeEl.getAttribute('sandbox');
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-same-origin');
    expect(sandbox).not.toContain('allow-top-navigation');
    expect(sandbox).not.toContain('allow-popups');
});

test('rolar a timeline estende o traço que liga a bolinha ao card (sincronizado ao scroll, não só "apareceu na tela")', async ({
    page,
}) => {
    // .bg-accent\/50 é a classe só dos traços (ConnectorTick) — a bolinha
    // usa .bg-accent, sem opacidade, então não colide com esse seletor.
    const tick = page
        .locator('#projects li')
        .first()
        .locator('.bg-accent\\/50')
        .first();

    const beforeTransform = await tick.evaluate(
        (el) => getComputedStyle(el).transform,
    );

    // Rola até um card bem mais adiante (não o primeiro) de propósito: a
    // sincronização é uma janela estreita de progresso (2%) ao redor da
    // posição de cada bolinha, e a altura exata de cada linha varia um
    // pouco entre motores (renderização de fonte). Rolar bem além do
    // primeiro card garante folga de sobra pra cruzar a janela dele em
    // qualquer motor, em vez de tentar acertar por pouco.
    await page
        .getByRole('heading', { level: 3, name: 'EMR International' })
        .scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const afterTransform = await tick.evaluate(
        (el) => getComputedStyle(el).transform,
    );

    expect(afterTransform).not.toBe(beforeTransform);
});

test('mobile: a seção inteira cabe sem gerar scroll horizontal (regressão — o código de teste do FCR já causou isso)', async ({
    page,
}) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page
        .getByRole('heading', { level: 2, name: 'Projetos' })
        .scrollIntoViewIfNeeded();

    const hasHorizontalScroll = await page.evaluate(
        () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
    );
    expect(hasHorizontalScroll).toBe(false);
});
