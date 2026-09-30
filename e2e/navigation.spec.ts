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

    await nav.getByRole('link', { name: 'FAQ' }).click();
    await expect(
        page.getByRole('heading', { level: 2, name: /perguntas frequentes/i }),
    ).toBeInViewport();

    await nav.getByRole('link', { name: 'Contato' }).click();
    await expect(
        page.getByRole('heading', { level: 2, name: /contato/i }),
    ).toBeInViewport();
});

test('mobile 320px: nenhuma seção gera scroll horizontal (regressão — e-mail no Contato e iframe em Projetos já causaram isso)', async ({
    page,
}) => {
    await page.setViewportSize({ width: 320, height: 800 });

    const nav = page.getByRole('navigation', { name: 'Principal' });
    const sections = [
        { navLabel: 'Sobre', heading: /desenvolvedora full stack/i },
        { navLabel: 'Projetos', heading: /projetos/i },
        { navLabel: 'FAQ', heading: /perguntas frequentes/i },
        { navLabel: 'Contato', heading: /contato/i },
    ];

    for (const { navLabel, heading } of sections) {
        // abaixo de md o menu é o hambúrguer — os links do <ul> desktop
        // ficam `hidden`, e cada clique num link do painel mobile já fecha
        // o menu sozinho (`onNavigate`), então reabre a cada volta.
        await nav.getByRole('button', { name: 'Menu' }).click();
        await nav.getByRole('link', { name: navLabel }).click();
        await expect(
            page.getByRole('heading', { level: 2, name: heading }),
        ).toBeInViewport();

        const hasHorizontalScroll = await page.evaluate(
            () =>
                document.documentElement.scrollWidth >
                document.documentElement.clientWidth,
        );
        expect(
            hasHorizontalScroll,
            `overflow horizontal em "${navLabel}"`,
        ).toBe(false);
    }
});

test('mobile: seção escolhida pelo menu hambúrguer encosta no topo, sem vão da barra "inflada" pelo painel aberto', async ({
    page,
}) => {
    // Achado real (bug): --nav-height é publicado a partir da barra fixa,
    // não do <header> inteiro — o header também contém o painel do menu
    // mobile, e medi-lo junto "inflava" a altura publicada enquanto o menu
    // estava aberto. Um link clicado dentro do painel aberto rolava a
    // página usando essa altura inflada como `scroll-padding-top`, mas o
    // painel já tinha fechado quando o salto terminava — sobrava um vão
    // (conteúdo da seção anterior) acima do título da seção de destino.
    await page.setViewportSize({ width: 375, height: 700 });

    const nav = page.getByRole('navigation', { name: 'Principal' });
    await nav.getByRole('button', { name: 'Menu' }).click();
    await nav.getByRole('link', { name: 'Projetos' }).click();

    const heading = page.getByRole('heading', { level: 2, name: /projetos/i });
    await expect(heading).toBeInViewport();

    // toBeInViewport só garante que o alvo já apareceu na tela — o
    // scroll-behavior: smooth (CSS) ainda pode estar terminando de
    // assentar (achado real: Firefox às vezes mede ~100px a mais nesse
    // meio-tempo, dando falso positivo de regressão). Um único par de
    // leituras iguais não basta: numa animação que desacelera perto do
    // fim, duas leituras espaçadas podem coincidir por arredondamento sem
    // o scroll ter terminado de verdade. Exige STABLE_READS leituras
    // seguidas iguais, com intervalo curto e fixo (não o backoff crescente
    // padrão do Playwright), pra não deixar uma pausa momentânea da
    // animação passar por "estável".
    const STABLE_READS = 3;
    let lastScrollTop = -1;
    let stableReads = 0;
    await expect
        .poll(
            async () => {
                const scrollTop = await page.evaluate(
                    () => document.documentElement.scrollTop,
                );
                stableReads = scrollTop === lastScrollTop ? stableReads + 1 : 0;
                lastScrollTop = scrollTop;
                return stableReads;
            },
            { intervals: [50] },
        )
        .toBeGreaterThanOrEqual(STABLE_READS);

    const [headingTop, headerBottom] = await Promise.all([
        heading.evaluate((el) => el.getBoundingClientRect().top),
        page
            .locator('header')
            .evaluate((el) => el.getBoundingClientRect().bottom),
    ]);

    // Folga generosa (padding da seção + espaço do parágrafo de intro antes
    // do título) — o que este teste trava é o vão GRANDE (centenas de px)
    // do bug, não uma margem normal de layout.
    expect(headingTop - headerBottom).toBeLessThan(150);
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
