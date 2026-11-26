// Home page phases (docs/home-phases.md): ARRVD comes first in every phase. The phase only switches the
// ARRVD calls to action — "Explore ARRVD" + "Preparing for release" before the App Store launch, the App
// Store button and badge after it — on the two home pages and the two ARRVD product pages together.
// Run: node --test tests/

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const ROOT = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), "utf8");
const HOME = { en: read("index.html"), ja: read("ja/index.html") };
const LP = { en: read("arrvd/index.html"), ja: read("ja/arrvd/index.html") };
const SCRIPT = read("script.js");
const PHASES = ["prelaunch", "arrvd-live"];
const MOJITSUNAGI_APP_ID = "6801533488";
const PREFIX = { en: "", ja: "/ja" };

const homePhase = (s) => (s.match(/<main id="main" data-home-phase="([a-z-]+)">/) || [])[1];
const lpPhase = (s) => (s.match(/<main id="main" data-arrvd-phase="([a-z-]+)">/) || [])[1];
const ctas = (s) => Object.fromEntries([...s.matchAll(/<!-- arrvd-cta:([a-z-]+) -->([\s\S]*?)<!-- \/arrvd-cta -->/g)].map((m) => [m[1], m[2]]));
const appStoreIds = (html) => [...html.matchAll(/https:\/\/apps\.apple\.com\/[^"]*\/id(\d+)/g)].map((m) => m[1]);
const sectionIds = (s) => [...s.replace(/[\s\S]*<main\b/, "").replace(/<\/main>[\s\S]*/, "").matchAll(/<section id="([a-z-]+)"/g)].map((m) => m[1]);
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ");

test("all four ARRVD pages are in the same, known phase with the same CTA markers", () => {
  const phase = homePhase(HOME.en);
  assert.ok(PHASES.includes(phase), `phase ${phase}`);
  for (const lang of ["en", "ja"]) {
    assert.equal(homePhase(HOME[lang]), phase, `${lang} home switches with the EN home`);
    assert.equal(lpPhase(LP[lang]), phase, `${lang} ARRVD page switches with the home pages`);
    assert.deepEqual(Object.keys(ctas(HOME[lang])).sort(), ["closing", "hero"], `${lang} home markers`);
    assert.deepEqual(Object.keys(ctas(LP[lang])).sort(), ["lp-closing", "lp-faq", "lp-hero"], `${lang} ARRVD page markers`);
  }
});

test("ARRVD leads the home page in every phase, in the same order in both languages", () => {
  const ORDER = ["arrvd", "arrvd-values", "how-it-works", "arrvd-privacy", "products", "about"];
  for (const [lang, s] of Object.entries(HOME)) {
    assert.deepEqual(sectionIds(s), ORDER, lang);
    // The header links straight to the ARRVD page, outside the collapsible menu, so it stays visible on phones.
    const nav = s.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    assert.match(nav, new RegExp(`<a href="${PREFIX[lang]}/arrvd/" class="nav-arrvd">ARRVD</a>\\s*<button class="nav-toggle"`), `${lang} header ARRVD link`);
    // The footer lists ARRVD first.
    const products = s.match(/<nav class="footer-col"[^>]*>[\s\S]*?<\/nav>/)[0];
    assert.match(products, new RegExp(`<ul>\\s*<li><a href="${PREFIX[lang]}/arrvd/">ARRVD</a></li>`), `${lang} footer`);
    // The ARRVD hero's primary button is the first primary button on the page.
    const firstPrimary = s.indexOf('class="btn btn-primary"');
    assert.ok(firstPrimary > s.indexOf('<section id="arrvd"') && firstPrimary < s.indexOf('<section id="arrvd-values"'), `${lang}: ARRVD is the main action`);
  }
});

test("the ARRVD calls to action match the phase", () => {
  const phase = homePhase(HOME.en);
  for (const lang of ["en", "ja"]) {
    const home = ctas(HOME[lang]);
    const lp = ctas(LP[lang]);
    const all = { ...home, ...lp };
    if (phase === "prelaunch") {
      assert.match(home.hero, new RegExp(`<a href="${PREFIX[lang]}/arrvd/" class="btn btn-primary">`), `${lang}: hero leads to the ARRVD page`);
      assert.match(home.closing, new RegExp(`<a href="${PREFIX[lang]}/arrvd/" class="link-arrow">`), `${lang}: closing link`);
      for (const [name, html] of Object.entries(all)) {
        assert.equal(appStoreIds(html).length, 0, `${lang} ${name}: no App Store link before the launch`);
      }
      for (const name of ["hero", "closing"]) assert.match(home[name], /class="arrvd-status"/, `${lang} ${name}: release status`);
      for (const name of ["lp-hero", "lp-closing"]) assert.match(lp[name], /class="arrvd-status/, `${lang} ${name}: release status`);
      assert.match(text(lp["lp-faq"]), lang === "en" ? /Not yet/ : /まだご利用いただけません/, `${lang}: FAQ says it isn't available yet`);
      // Before the launch the only App Store app on the ARRVD pages is Mojitsunagi (home page).
      for (const s of [HOME[lang], LP[lang]]) {
        for (const id of appStoreIds(s)) assert.equal(id, MOJITSUNAGI_APP_ID, `${lang}: unexpected App Store id ${id}`);
      }
    } else {
      const ids = new Set(Object.values(all).flatMap(appStoreIds));
      assert.equal(ids.size, 1, `${lang}: one ARRVD App Store id on all ARRVD calls to action`);
      const [id] = ids;
      assert.notEqual(id, MOJITSUNAGI_APP_ID);
      assert.match(home.hero, /class="btn btn-primary"/, `${lang}: ARRVD is the primary action`);
      for (const [name, html] of Object.entries(all)) {
        assert.equal(appStoreIds(html).length, 1, `${lang} ${name}: App Store link`);
        assert.doesNotMatch(html, /arrvd-status|Preparing for release|リリース準備中/, `${lang} ${name}: no pre-launch wording`);
      }
      for (const name of ["closing", "lp-hero", "lp-closing"]) assert.match(all[name], /class="app-store-badge"/, `${lang} ${name}: badge`);
      // ARRVD is sold only in Japan and Malaysia: the country-less URL (US storefront) is a 404, so each page
      // links to a storefront that has the app — JP on the Japanese pages, MY on the English pages.
      const storefront = lang === "ja" ? "jp" : "my";
      for (const [name, html] of Object.entries(all)) {
        for (const [href] of html.matchAll(/https:\/\/apps\.apple\.com\/[^"]*/g)) {
          assert.equal(href, `https://apps.apple.com/${storefront}/app/arrvd/id${id}`, `${lang} ${name}`);
        }
      }
      // ARRVD App Store clicks must count for arrvd: the id is in the generated registry block of script.js.
      assert.match(SCRIPT, new RegExp(`"app_store:${id}":"arrvd"`), "register ARRVD's App Store app first (docs/home-phases.md, step 1)");
    }
  }
});

test("the ARRVD screens are local, sized, described and in the page's language", () => {
  const pages = [
    ["index.html", HOME.en, "en"],
    ["ja/index.html", HOME.ja, "ja"],
    ["arrvd/index.html", LP.en, "en"],
    ["ja/arrvd/index.html", LP.ja, "ja"],
  ];
  for (const [path, s, lang] of pages) {
    const imgs = [...s.matchAll(/<img [^>]*assets\/brand\/arrvd\/screens\/[^>]*>/g)].map((m) => m[0]);
    assert.ok(imgs.length >= 1, `${path}: ARRVD screen`);
    for (const img of imgs) {
      assert.match(img, /width="\d+" height="\d+"/, `${path}: sized`);
      assert.match(img, /alt="[^"]{20,}"/, `${path}: described`);
      for (const [, file] of img.matchAll(/(assets\/brand\/arrvd\/screens\/arrvd-[a-z]+-([a-z]{2})-\d+\.webp)/g)) {
        assert.ok(file.includes(`-${lang}-`), `${path}: ${file} in ${lang}`);
        const local = new URL(file, ROOT);
        assert.ok(existsSync(local), file);
        assert.ok(readFileSync(local).length < 40000, `${file} under 40 KB`);
      }
    }
    // Example screens with sample names: say so next to the image.
    assert.match(s, lang === "en" ? /<figcaption>ARRVD app screen with example names<\/figcaption>/ : /<figcaption>ARRVDのアプリ画面（名前は例です）<\/figcaption>/, path);
  }
});

test("the home page keeps the links to ARRVD's privacy policy, terms, support and guardian page", () => {
  for (const [lang, s] of Object.entries(HOME)) {
    const links = s.match(/<nav class="trust-links"[\s\S]*?<\/nav>/)[0];
    for (const page of ["privacy", "terms", "support", "guardians"]) {
      assert.match(links, new RegExp(`href="${PREFIX[lang]}/arrvd/${page}/"`), `${lang} ${page}`);
      assert.ok(existsSync(new URL(`${PREFIX[lang].slice(1)}${lang === "ja" ? "/" : ""}arrvd/${page}/index.html`, ROOT)), `${lang} ${page} page exists`);
    }
  }
});
