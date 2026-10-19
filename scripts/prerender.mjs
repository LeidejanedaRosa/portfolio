// Gera o HTML estático do site em build, pra ele já chegar pronto no
// navegador (SEO + sem tela em branco sem JS + LCP sem esperar o React
// montar) — achado da auditoria de 2026-10.
//
// Roda DEPOIS de dois builds do Vite (ver "build" em package.json):
//   1. `vite build`              → dist/            (bundle do navegador)
//   2. `vite build --ssr ...`    → dist-ssr/         (bundle pra rodar em Node)
// Este script importa o bundle de Node, chama render() (src/entry-server.tsx)
// e cola o HTML resultante no lugar do comentário <!--app-html--> de
// dist/index.html (ver esse comentário em index.html). dist-ssr/ não serve
// pra nada depois disso — só existiu pra gerar o HTML — por isso o build
// apaga a pasta em seguida.
import { readFileSync, writeFileSync } from 'node:fs';

const { render } = await import('../dist-ssr/entry-server.js');

const appHtml = render();
const template = readFileSync('dist/index.html', 'utf-8');

if (!template.includes('<!--app-html-->')) {
    console.error(
        'dist/index.html não tem o placeholder <!--app-html--> — index.html foi editado?',
    );
    process.exit(1);
}

writeFileSync('dist/index.html', template.replace('<!--app-html-->', appHtml));
