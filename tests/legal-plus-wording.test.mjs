// ARRVD Plus wording on the legal pages (legal-2026-11-14/80 §11): V1 is Free first and ARRVD Plus is
// added later, so no page may say Plus can be bought now; the purchase conditions for when it is
// offered (terms §9, privacy §9, support) stay.
// Run: node --test tests/*.test.mjs

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const text = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

const PAGES = {
  en: { dir: "arrvd", offered: "once it is offered", screen: "including on the purchase screen once ARRVD Plus is offered", support: "Once ARRVD Plus is offered, it is purchased through the App Store" },
  ja: { dir: "ja/arrvd", offered: "提供を開始した後", screen: "アプリ内（ARRVD Plusの提供後は購入画面を含む）に表示します", support: "ARRVD Plusは、提供を開始した後、App Storeで購入し" },
  ms: { dir: "ms/arrvd", offered: "setelah ia ditawarkan", screen: "termasuk pada skrin pembelian setelah ARRVD Plus ditawarkan", support: "Setelah ARRVD Plus ditawarkan, ia dibeli melalui App Store" },
};

// The sentences that said Plus is available now (before 2026-11-18).
const NOW_AVAILABLE = [
  /available (?:on|as) a free plan and as ARRVD Plus/,
  /including on the purchase screen\./,
  /tersedia sebagai pelan percuma dan sebagai ARRVD Plus/,
  /termasuk pada skrin pembelian\./,
  /無料のプランと、(?:有料のプラン|App Storeで購入する有料プラン)「ARRVD Plus」があります/,
  /購入画面を含め、アプリ内に表示します/,
];

test("no legal page says ARRVD Plus can be bought now", () => {
  for (const { dir } of Object.values(PAGES)) {
    for (const page of ["terms", "privacy", "support", "guardians"]) {
      const t = text(`${dir}/${page}/index.html`);
      for (const re of NOW_AVAILABLE) assert.doesNotMatch(t, re, `${dir}/${page}: ${re}`);
    }
  }
});

test("terms §8, privacy §9 and support say ARRVD Plus is bought once it is offered, in all three languages", () => {
  for (const [lang, p] of Object.entries(PAGES)) {
    const terms = text(`${p.dir}/terms/index.html`);
    const privacy = text(`${p.dir}/privacy/index.html`);
    assert.ok(terms.includes(p.offered) && terms.includes(p.screen), `${lang}: terms §8`);
    assert.ok(privacy.includes(p.offered), `${lang}: privacy §9`);
    assert.ok(text(`${p.dir}/support/index.html`).includes(p.support), `${lang}: support`);
  }
});

test("the conditions for when ARRVD Plus is offered are kept (renewal, cancel, restore, end of Plus)", () => {
  const terms = text("arrvd/terms/index.html");
  for (const s of [
    "If ARRVD Plus is offered as a subscription, it may renew automatically",
    "Deleting the app, or your ARRVD account, does not cancel a subscription",
    "ARRVD will provide a way to restore previous purchases",
    "When ARRVD Plus ends",
  ]) assert.ok(terms.includes(s), s);
  assert.ok(text("arrvd/privacy/index.html").includes("we never receive or store your card number"));
  assert.ok(text("ja/arrvd/terms/index.html").includes("ARRVD Plusがサブスクリプションとして提供される場合"));
  assert.ok(text("ms/arrvd/terms/index.html").includes("Jika ARRVD Plus ditawarkan sebagai langganan"));
});
