// Calcula os hashes sha256 (formato CSP) dos scripts inline de index.html,
// a partir do HTML de produção já buildado (dist/index.html) — não do
// index.html fonte, porque é o que o navegador recebe de verdade que
// precisa bater com o hash.
//
// O Content-Security-Policy em vercel.json trava `script-src` num allowlist
// de hashes (não usa `unsafe-inline`) — editou um dos dois scripts inline de
// index.html (Consent Mode default ou anti-flash do tema)? Rode:
//
//   npm run build && npm run csp:hashes
//
// E cole os hashes impressos em `script-src` no vercel.json. Sem isso, o CSP
// bloqueia o script em silêncio (sem erro visível pra quem usa o site, só um
// aviso no console do navegador) — tema/consentimento param de funcionar.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync('dist/index.html', 'utf8');

// Remove comentários HTML antes de procurar <script>: sem isso, um
// comentário que mencionasse "<script>" como exemplo de texto seria lido
// como um script de verdade.
const htmlWithoutComments = html.replace(/<!--[\s\S]*?-->/g, '');

const scriptPattern =
    /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g;

let match;
let count = 0;
while ((match = scriptPattern.exec(htmlWithoutComments))) {
    count += 1;
    const hash = createHash('sha256').update(match[1], 'utf8').digest('base64');
    console.log(`script #${count}: 'sha256-${hash}'`);
}

if (count === 0) {
    console.error(
        'Nenhum <script> inline encontrado em dist/index.html — rodou `npm run build` antes?',
    );
    process.exit(1);
}
