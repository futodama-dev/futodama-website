// Home page phases (docs/home-phases.md): before the ARRVD launch the "Available now" block comes first,
// after it ARRVD does. Both languages must be in the same phase with the same structure.
// Run: node --test tests/

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const PAGES = { en: read("index.html"), ja: read("ja/index.html") };
const SCRIPT = read("script.js");
const PHASES = ["prelaunch", "arrvd-live"];

const phaseOf = (s) => (s.match(/<main data-home-phase="([a-z-]+)">/) || [])[1];
const blocks = (s) => [...s.matchAll(/<!-- home-block:([a-z-]+)\b/g)].map((m) => m[1]);
const block = (s, name) => {
  const m = s.match(new RegExp(String.raw`<!-- home-block:${name}\b[^>]*-->([\s\S]*?)<!-- /home-block -->`));
  assert.ok(m, `home-block:${name}`);
  return m[1];
};
const ctas = (s) => Object.fromEntries([...s.matchAll(/<!-- arrvd-cta:([a-z]+) -->([\s\S]*?)<!-- \/arrvd-cta -->/g)].map((m) => [m[1], m[2]]));
const appStoreIds = (html) => [...html.matchAll(/https:\/\/apps\.apple\.com\/[^"]*\/id(\d+)/g)].map((m) => m[1]);

test("both home pages are in the same, known phase with the same blocks and CTA markers", () => {
  assert.ok(PHASES.includes(phaseOf(PAGES.en)), `phase ${phaseOf(PAGES.en)}`);
  assert.equal(phaseOf(PAGES.ja), phaseOf(PAGES.en), "EN and JA switch together");
  assert.deepEqual(blocks(PAGES.ja), blocks(PAGES.en));
  for (const s of Object.values(PAGES)) {
    assert.deepEqual(blocks(s).sort(), ["arrvd", "available-now"]);
    assert.deepEqual(Object.keys(ctas(s)).sort(), ["band", "featured", "hero"]);
    assert.ok(s.indexOf('<section class="hero">') < s.indexOf("<!-- home-block:"), "blocks follow the hero");
  }
});

test("the block order and the ARRVD calls to action match the phase", () => {
  const phase = phaseOf(PAGES.en);
  for (const [lang, s] of Object.entries(PAGES)) {
    const c = ctas(s);
    if (phase === "prelaunch") {
      assert.deepEqual(blocks(s), ["available-now", "arrvd"], lang);
      assert.match(c.hero, /class="btn btn-outline"/, `${lang}: ARRVD is not the primary action before the launch`);
      for (const [name, html] of Object.entries(c)) assert.equal(appStoreIds(html).length, 0, `${lang} ${name}: no App Store link before the launch`);
      for (const name of ["featured", "band"]) assert.match(c[name], /class="badge-coming-soon"/, `${lang} ${name}`);
    } else {
      assert.deepEqual(blocks(s), ["arrvd", "available-now"], lang);
      assert.match(c.hero, /class="btn btn-primary"/, `${lang}: ARRVD is the primary action after the launch`);
      const ids = new Set(Object.values(c).flatMap(appStoreIds));
      assert.equal(ids.size, 1, `${lang}: one ARRVD App Store id in hero, featured and band`);
      for (const [name, html] of Object.entries(c)) {
        assert.equal(appStoreIds(html).length, 1, `${lang} ${name}: App Store link`);
        assert.doesNotMatch(html, /badge-coming-soon/, `${lang} ${name}`);
      }
      // ARRVD App Store clicks must count for arrvd: the id is in the generated registry block of script.js.
      const [id] = ids;
      assert.match(SCRIPT, new RegExp(`"app_store:${id}":"arrvd"`), "register ARRVD's App Store app first (docs/home-phases.md, step 1)");
    }
  }
});

test("Available now keeps Celestial Oracle (A1) and the Mojitsunagi row in every phase", () => {
  for (const [lang, s] of Object.entries(PAGES)) {
    const now = block(s, "available-now");
    assert.match(now, /<article class="today-card"/, lang);
    assert.match(now, /href="https:\/\/celestial\.futodama\.app\/\?src=futodama&amp;med=website&amp;cmp=a1_home_today_card&amp;cnt=home_today_card_(en|ja)"/, lang);
    assert.match(now, new RegExp(`<p class="available-more">[\\s\\S]*href="${lang === "ja" ? "/ja" : ""}/mojitsunagi/"[\\s\\S]*</p>`), `${lang}: Mojitsunagi product page link (A3)`);
    assert.equal([...now.matchAll(/class="btn btn-primary"/g)].length, 1, `${lang}: one primary button in the block`);
  }
});
