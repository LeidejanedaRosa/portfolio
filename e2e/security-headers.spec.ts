import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

interface Header {
    key: string;
    value: string;
}

// Os cabeçalhos são aplicados pela Vercel, a partir do vercel.json; o
// servidor local de preview não os envia. O teste lê o arquivo e aplica os
// headers de verdade à resposta da página — é a única forma de provar que
// o hash dos scripts inline no CSP bate com o HTML real (achado de
// 2026-10-20: o hash ficou desatualizado depois de uma reformatação do
// index.html, e nada detectava isso automaticamente).
const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    headers: { source: string; headers: Header[] }[];
};

// Falha alto e cedo (não um `?? []` silencioso) se alguém reestruturar o
// vercel.json e a regra sumir: sem isso, o teste passaria a aplicar ZERO
// headers, nenhuma violação de CSP jamais dispararia, e as asserções de
// `violations` abaixo passariam sempre — exatamente o mesmo tipo de falha
// silenciosa que este arquivo existe pra pegar.
const rule = config.headers.find((r) => r.source === '/(.*)');
if (!rule) {
    throw new Error(
        "vercel.json não tem mais a regra de headers '/(.*)' — teste desatualizado.",
    );
}
const HEADERS = rule.headers;
const cspHeader = HEADERS.find(
    (header) => header.key === 'Content-Security-Policy',
);
if (!cspHeader) {
    throw new Error(
        "vercel.json não tem mais 'Content-Security-Policy' na regra '/(.*)' — teste desatualizado.",
    );
}

// Confere o `script-src` em si, não só "existe um CSP": `'unsafe-inline'`
// junto dos hashes não muda o comportamento em navegador moderno (CSP2+
// ignora unsafe-inline quando há hash-source — é assim que o fallback pra
// navegador antigo funciona), mas os testes de comportamento abaixo não
// pegariam alguém adicionando unsafe-inline por engano, já que o resultado
// observável seria o mesmo. Essa checagem garante que a política escrita
// continua correta, não só o comportamento nos browsers que o Playwright usa.
const scriptSrc =
    cspHeader.value
        .split(';')
        .map((directive) => directive.trim())
        .find((directive) => directive.startsWith('script-src '))
        ?.split(/\s+/)
        .slice(1) ?? [];
const scriptHashes = scriptSrc.filter((source) =>
    source.startsWith("'sha256-"),
);
if (scriptHashes.length < 2) {
    throw new Error(
        `script-src deveria ter os 2 hashes dos scripts inline, achei ${scriptHashes.length} — teste desatualizado.`,
    );
}
if (scriptSrc.includes("'unsafe-inline'")) {
    throw new Error(
        "script-src tem 'unsafe-inline' — isso bypassa a proteção por hash.",
    );
}

let lastDocumentHtml = '';

async function openWithProductionHeaders(page: Page) {
    await page.addInitScript(() => {
        const violations: string[] = [];
        Object.assign(window, { __cspViolations: violations });
        document.addEventListener('securitypolicyviolation', (event) => {
            violations.push(
                `${event.violatedDirective}: ${event.blockedURI || 'inline'}`,
            );
        });
    });
    await page.route('**/*', async (route) => {
        const request = route.request();
        // frame() !== mainFrame(): a página embute iframes de outros sites
        // (cards da seção Projetos) — sem esse filtro, o doc capturado em
        // `lastDocumentHtml` podia ser de QUALQUER um deles, não da própria
        // página (achado real: a primeira versão pegou o HTML de um
        // projeto embutido por engano).
        if (
            request.resourceType() !== 'document' ||
            request.frame() !== page.mainFrame()
        ) {
            return route.continue();
        }

        const response = await route.fetch();
        // Guardado ANTES do fulfill: é o HTML exatamente como o servidor
        // mandou, antes do navegador rodar qualquer script — prova real de
        // pré-renderização, diferente de ler o DOM depois que a página
        // carrega (aí já rodou o React, e não prova mais nada sobre o HTML
        // que chegou do servidor).
        lastDocumentHtml = await response.text();
        const extra = Object.fromEntries(
            HEADERS.map((header) => [header.key, header.value]),
        );
        await route.fulfill({
            response,
            headers: { ...response.headers(), ...extra },
        });
    });
    await page.goto('/');
}

const violations = (page: Page) =>
    page.evaluate(
        () =>
            (window as unknown as { __cspViolations: string[] })
                .__cspViolations,
    );

test('com os cabeçalhos de produção, os dois scripts inline (consent default + anti-flash de tema) rodam sem bloqueio do CSP', async ({
    page,
}) => {
    await openWithProductionHeaders(page);

    // O anti-flash só faz algo visível em tema escuro — em tema claro (padrão
    // do browser do Playwright) ele roda, mas não muda nada na tela. O que
    // prova que ele RODOU é não ter violação de CSP nenhuma: se o hash do
    // script não bater com o `script-src`, o CSP bloqueia a execução em
    // silêncio (sem erro visível pra quem usa o site, só no console).
    expect(await violations(page)).toEqual([]);

    // window.dataLayer só existe se o script de Consent Mode rodou de verdade
    // (não só "não deu erro") — prova mais direta que o hash bate.
    expect(
        await page.evaluate(() =>
            Array.isArray(
                (window as unknown as { dataLayer?: unknown }).dataLayer,
            ),
        ),
    ).toBe(true);
});

test('o root já chega com o HTML pré-renderizado (sem depender do React montar)', async ({
    page,
}) => {
    await openWithProductionHeaders(page);

    // Direto na resposta crua do servidor (gravada em `openWithProductionHeaders`
    // antes do `fulfill`) — não em `page.getByRole` depois do `goto`, que já
    // rodou o React e provaria só que a hidratação funcionou, não que o HTML
    // chegou pré-renderizado (achado real: era exatamente isso que o teste
    // antigo fazia, sem perceber).
    expect(lastDocumentHtml).toMatch(/<h1[^>]*>Leidejane da Rosa<\/h1>/);
});
