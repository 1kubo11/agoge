# AGOGÉ – Spartánsky denník

Denný tréner psychickej odolnosti. Jedna výzva na deň, 15–20 minút, stoická myšlienka
a večerná reflexia. Offline PWA, žiadny server, žiadne účty.

## Na čom to stojí

1. **Dobrovoľný diskomfort** – kto si nepohodlie vyberie sám, zvládne lepšie aj to, ktoré si nevybral.
2. **Postupné otužovanie stresom** – malé dávky, ktoré rastú. Tri úrovne, postup až po piatich splnených za sebou.
3. **Konanie, nie čítanie** – krátky rozkaz, činnosť, tri vety večer.

## Čo appka vie

- **60 denných výziev** v troch oblastiach (telo a chlad, disciplína a pôst, myseľ a zvyky), každá v troch úrovniach.
- **8 týždenných AGOGÉ výziev** – väčšia výzva na víkend doma.
- **Režim Nemecko / Doma** – v Nemecku len to, čo sa dá na ubytovni popri pracovnom dni.
- **Bezpečnosť v kóde, nie len v texte** – pôst ani fyzicky náročné výzvy nikdy v deň silového alebo tvrdého behu.
- **Tlačidlo „Nechce sa mi“** – pravidlo dvoch minút, stoická myšlienka, odpočet.
- **Hodnosti** Rekrút → Nosič štítu → Hoplita → Veterán → Spartiat → Strážca Termopýl.
- **Denník, série, kalendár** a export/import zálohy v JSON.

## Ako to beží

Všetko je v `index.html` – jeden súbor, žiadny build. `sw.js` sa stará o offline,
`manifest.webmanifest` o inštaláciu na plochu.

Dáta sú v `localStorage` daného prehliadača. Neprenášajú sa nikam a nikam sa neposielajú.
Pri výmene telefónu alebo vymazaní dát prehliadača pomôže len **Export zálohy**
v sekcii Prečo → Nastavenia.

## Vývoj

```
# ľubovoľný statický server, napr.
python3 -m http.server 8000
```

Service worker drží súbory v cache. Po každej zmene zvýš `CACHE` v `sw.js`,
inak telefón drží starú verziu.

## Testy

```
node tests/run.mjs
```

Kontroluje databázu výziev priamo z `index.html`: počty, úrovne, povinné polia,
či sa v režime Nemecko dá robiť aspoň jedna výzva z každej kategórie a úrovne,
a či má každá pôstna výzva bezpečnostnú poznámku. Beží aj v GitHub Actions
pred nasadením – keď niečo nesedí, nasadenie sa zastaví.

## Kópia pre Claude artifact

```
node scripts/build-artifact.mjs
```

Vyrobí `../agoge.html` — tú istú appku bez hlavičky a service workera,
v tvare, aký očakáva Claude artifact. Zdrojom pravdy zostáva `index.html`.

## Nasadenie

GitHub Actions, workflow `.github/workflows/pages.yml`.
V Settings → Pages musí byť **Source: GitHub Actions**.

## Bezpečnosť

Appka nie je lekár. Chlad postupne, nikdy zadržaný dych, nikdy otužovanie samého
v otvorenej vode. Pôst nie v dňoch ťažkého tréningu. Diskomfort áno, bolesť nie –
keď niečo ostro bolí, prestať.
