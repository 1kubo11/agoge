/**
 * Vyrobí z index.html verziu pre Claude artifact (../agoge.html).
 * Artifact si hlavičku a <body> dopĺňa sám, takže ich tu odstraňujeme
 * a nahradíme tým, čo artifact očakáva: meta, title a odkaz na písma.
 *
 *   node scripts/build-artifact.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'index.html'), 'utf8');

const HEAD = `<meta name="claude:viewport-fit-sides" content="cover">
<title>AGOGÉ – Spartánsky denník</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap">
`;

const start = src.indexOf('<body>');
const swMark = src.indexOf('<script>\n/* registrácia service workera');
if (start < 0 || swMark < 0) {
  console.error('index.html nemá očakávanú štruktúru — build zastavený.');
  process.exit(1);
}

const body = src.slice(start + '<body>'.length, swMark).trim();
const out = HEAD + '\n' + body + '\n';

const dest = join(root, '..', 'agoge.html');
writeFileSync(dest, out, 'utf8');
console.log('Zapísané:', dest, '(' + Math.round(out.length / 1024) + ' kB)');
if (/<!doctype|<html|<\/body>|<\/html>|service worker/i.test(out)) {
  console.error('POZOR: vo výstupe zostalo niečo, čo tam nepatrí.');
  process.exit(1);
}
