// Home page entry to the Celestial Oracle web app (PDCA action 2026-10-19-A1), EN and JA.
// Run: node --test tests/

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const ROOT = new URL("../", import.meta.url);
const PAGES = [
  { path: "index.html", lang: "en", cnt: "home_today_card_en", caption: "Example card", assets: "assets/" },
  { path: "ja/index.html", lang: "ja", cnt: "home_today_card_ja", caption: "カードの一例", assets: "../assets/" },
];
// The web app accepts a campaign value only in this form (celestial_oracle functions/api/analytics/event.js);
// qa_ campaigns are excluded from every report (futodama-analytics qa_rules).
const CAMPAIGN_VALUE = /^[A-Za-z0-9_-]{1,64}$/;

const html = (p) => readFileSync(new URL(p, ROOT), "utf8");
const section = (s) => {
  const found = s.match(/<section class="today-card"[\s\S]*?<\/section>/g) || [];
  assert.equal(found.length, 1, "exactly one today-card section");
  return found[0];
};

test("one entry per home page, right after the hero, linking to the web app with a fixed campaign", () => {
  for (const page of PAGES) {
    const s = html(page.path);
    const block = section(s);
    assert.ok(s.indexOf('<section class="hero">') < s.indexOf('<section class="today-card"'), page.path);
    assert.ok(s.indexOf('<section class="today-card"') < s.indexOf('<section id="products"'), page.path);
    const links = [...block.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
    assert.deepEqual(links, [`https://celestial.futodama.app/?src=futodama&med=website&cmp=a1_home_today_card&cnt=${page.cnt}`], page.path);
    assert.ok(!/target=|javascript:|on[a-z]+=/i.test(block), "same-tab link, no inline script");
    const params = new URL(links[0]).searchParams;
    for (const key of ["src", "med", "cmp", "cnt"]) {
      assert.match(params.get(key), CAMPAIGN_VALUE, `${page.path} ${key}`);
      assert.ok(!params.get(key).startsWith("qa_"), `${page.path} ${key}`);
    }
    assert.equal([...block.matchAll(/class="btn btn-primary"/g)].length, 1, "one primary button in the entry");
    assert.ok([...s.matchAll(/class="btn btn-primary"/g)].length <= 3, "no more than three primary buttons on the page");
  }
});

test("the card image is local, sized, decorative, light and marked as an example", () => {
  for (const page of PAGES) {
    const block = section(html(page.path));
    const img = block.match(/<img [^>]*>/)[0];
    assert.match(img, /alt=""/);
    assert.match(img, /width="96" height="144"/);
    // The fixed image is one example card, not the visitor’s card of the day.
    assert.match(block, new RegExp(String.raw`<figure class="today-card-figure">\s*<img [^>]*>\s*<figcaption>${page.caption}</figcaption>\s*</figure>`));
    for (const [, src] of img.matchAll(/(assets\/brand\/celestial-oracle\/cards\/[a-z0-9-]+\.webp)/g)) {
      const file = new URL(src, ROOT);
      assert.ok(existsSync(file), src);
      assert.ok(readFileSync(file).length < 25000, `${src} under 25 KB`);
    }
    assert.ok(img.includes(`src="${page.assets}assets/`.replace("assets/assets/", "assets/")), page.path);
  }
});

test("one language per page; reflection, not prediction", () => {
  const ja = section(html("ja/index.html")).replace(/<[^>]+>|&[a-z]+;/g, " ").replace(/Celestial Oracle|Web/g, "");
  assert.ok(!/[A-Za-z]{2,}/.test(ja), `English words in the JA entry: ${ja.match(/[A-Za-z]{2,}/g)}`);
  const en = section(html("index.html")).replace(/<[^>]+>/g, " ");
  assert.ok(!/[぀-ヿ一-鿿]/.test(en), "Japanese in the EN entry");
  assert.match(en, /not a prediction/);
  assert.match(ja, /占いではなく/);
  for (const text of [en, ja]) assert.ok(!/fortune|destiny|運勢|的中/i.test(text), "no fortune-telling claims");
});
