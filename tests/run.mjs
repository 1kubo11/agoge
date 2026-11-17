/**
 * Kontrola databázy výziev priamo z index.html.
 * Beží v GitHub Actions pred nasadením — keď niečo nesedí, nasadenie sa zastaví.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

let failed = 0;
function ok(cond, msg) {
  if (cond) {
    console.log('  ✓ ' + msg);
  } else {
    failed++;
    console.log('  ✗ ' + msg);
  }
}

// konštanty s bezpečnostnými textami, na ktoré sa výzvy odkazujú
const prelude = (html.match(/^var (?:COLD|FAST|PAIN) = "[^"]*";$/gm) || []).join('\n');

function grabArray(name) {
  const start = html.indexOf('var ' + name + ' = [');
  if (start < 0) throw new Error('Pole ' + name + ' sa v index.html nenašlo.');
  const from = html.indexOf('[', start);
  let depth = 0;
  for (let i = from; i < html.length; i++) {
    if (html[i] === '[') depth++;
    else if (html[i] === ']') {
      depth--;
      if (depth === 0) {
        // eslint-disable-next-line no-new-func
        return new Function(prelude + '\nreturn ' + html.slice(from, i + 1))();
      }
    }
  }
  throw new Error('Pole ' + name + ' sa nepodarilo prečítať.');
}

const CH = grabArray('CH');
const WEEKLY = grabArray('WEEKLY');
const QUOTES = grabArray('QUOTES');

console.log('Databáza výziev');
ok(CH.length >= 60, 'aspoň 60 denných výziev (má ' + CH.length + ')');
['A', 'B', 'C'].forEach((c) => {
  const inCat = CH.filter((x) => x.c === c);
  ok(inCat.length >= 20, 'kategória ' + c + ' má aspoň 20 výziev (má ' + inCat.length + ')');
  [1, 2, 3].forEach((l) => {
    ok(inCat.some((x) => x.l === l), 'kategória ' + c + ' má úroveň ' + l);
  });
});

console.log('Povinné polia');
const ids = new Set();
let missing = 0;
let dupes = 0;
CH.forEach((x) => {
  if (!x.id || !x.t || !x.d || !x.dur || !x.w || !x.p || !x.c || !x.l) missing++;
  if (ids.has(x.id)) dupes++;
  ids.add(x.id);
});
ok(missing === 0, 'každá výzva má názov, popis, trvanie, „prečo“, miesto, kategóriu a úroveň');
ok(dupes === 0, 'žiadne duplicitné id');
ok(CH.every((x) => ['vsade', 'ubytovna', 'doma'].indexOf(x.p) >= 0), 'miesto je vsade / ubytovna / doma');
ok(CH.every((x) => [1, 2, 3].indexOf(x.l) >= 0), 'úroveň je 1, 2 alebo 3');

console.log('Režim Nemecko');
['A', 'B', 'C'].forEach((c) => {
  [1, 2, 3].forEach((l) => {
    const n = CH.filter((x) => x.c === c && x.l === l && (x.p === 'vsade' || x.p === 'ubytovna')).length;
    ok(n > 0, 'na ubytovni sa dá robiť aspoň jedna výzva ' + c + l + ' (' + n + ')');
  });
});

console.log('Bezpečnosť');
ok(CH.filter((x) => x.f).every((x) => !!x.s), 'každá pôstna výzva má bezpečnostnú poznámku');
ok(CH.filter((x) => x.f).length > 0, 'pôstne výzvy sú označené príznakom f');
ok(CH.filter((x) => x.h).length > 0, 'fyzicky náročné výzvy sú označené príznakom h');

console.log('Týždenné výzvy a citáty');
ok(WEEKLY.length >= 5, 'aspoň 5 týždenných výziev (má ' + WEEKLY.length + ')');
ok(WEEKLY.every((x) => x.id && x.t && x.d && x.dur && x.w), 'týždenné výzvy majú všetky polia');
ok(QUOTES.length >= 15, 'aspoň 15 citátov (má ' + QUOTES.length + ')');
ok(QUOTES.every((x) => x.q && x.a && x.m), 'každý citát má text, autora a vysvetlenie');

console.log('');
if (failed > 0) {
  console.log(failed + ' kontrol neprešlo.');
  process.exit(1);
}
console.log('Všetko v poriadku.');
