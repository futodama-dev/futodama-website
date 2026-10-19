// script.js (site events) in a minimal fake browser: the current version against the version on main.
// For every existing page and link the payloads must be identical; new behaviour is checked separately.
// Run: node --test tests/

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const CURRENT = readFileSync(new URL("../script.js", import.meta.url), "utf8");
const MAIN = execFileSync("git", ["show", "main:script.js"], { encoding: "utf8" });

// Runs script.js on `path`, then clicks each href; returns the JSON bodies sent to the collector.
function run(source, path, { lang = "en", clicks = [], search = "" } = {}) {
  const sent = [];
  const handlers = {};
  const location = new URL(`https://futodama.app${path}${search}`);
  const document = {
    querySelector: () => null,
    getElementById: () => null,
    documentElement: { lang },
    prerendering: false,
    visibilityState: "hidden",
    addEventListener: (type, fn) => ((handlers[type] ||= []).push(fn)),
  };
  const window = { fetch: (url, init) => (sent.push(JSON.parse(init.body)), Promise.resolve()) };
  const context = {
    window,
    document,
    location,
    navigator: { webdriver: false, userAgent: "Mozilla/5.0" },
    URL,
    URLSearchParams,
    setTimeout: () => 0,
    clearTimeout: () => {},
    Date,
    JSON,
    Object,
  };
  vm.runInNewContext(source, context);
  for (const href of clicks) {
    for (const fn of handlers.click || []) fn({ target: { closest: () => ({ href }) } });
  }
  return sent;
}

const PAGES = ["/", "/ja/", "/about/", "/ja/about/", "/support/", "/privacy/", "/terms/", "/legal/", "/arrvd/", "/ja/arrvd/", "/arrvd/privacy/", "/arrvd/terms/", "/ja/arrvd/support/", "/arrvd/invite-fallback.html", "/mojitsunagi/", "/ja/mojitsunagi/", "/celestial-oracle/", "/ja/celestial-oracle/", "/404.html"];
const LINKS = [
  "https://futodama.app/", "https://futodama.app/arrvd/", "https://futodama.app/ja/arrvd/", "https://futodama.app/mojitsunagi/", "https://futodama.app/ja/mojitsunagi/",
  "https://futodama.app/celestial-oracle/", "https://futodama.app/ja/celestial-oracle/", "https://futodama.app/celestial-oracle/#legal", "https://futodama.app/arrvd/terms/",
  "https://futodama.app/about/", "https://futodama.app/ja/",
  "https://apps.apple.com/jp/app/%E3%82%82%E3%81%98%E3%81%A4%E3%81%AA%E3%81%8E/id6801533488", "https://apps.apple.com/app/id1234567890",
  "https://celestial.futodama.app/?src=futodama&med=website&cmp=celestial_oracle_launch&cnt=product_page", "https://celestial.futodama.app/",
  "https://futodama-dev.github.io/celestial-oracle-support/", "https://example.com/",
];

test("every existing page and link sends exactly what main sends", () => {
  let events = 0;
  for (const page of PAGES) {
    for (const lang of ["en", "ja"]) {
      const before = run(MAIN, page, { lang, clicks: LINKS, search: "?utm_source=x&cmp=launch" });
      const after = run(CURRENT, page, { lang, clicks: LINKS, search: "?utm_source=x&cmp=launch" });
      assert.deepEqual(after, before, page);
      events += after.length;
    }
  }
  assert.ok(events > 150, `events ${events}`);
});

test("products come from the generated registry block (no hard-coded product list left)", () => {
  assert.ok(!/arrvd\|mojitsunagi|id6801533488: "mojitsunagi"|"celestial_oracle", "web_app"/.test(CURRENT.replace(/\/\/ BEGIN GENERATED[\s\S]*?\/\/ END GENERATED SITE PRODUCTS/, "")));
  assert.match(CURRENT, /var SITE_PRODUCTS = \{.*"celestial-oracle":"celestial_oracle".*\};/);
});

test("a new product section before registration: its own token, never another product, never dropped", () => {
  const sent = run(CURRENT, "/moji-kids/", { clicks: ["https://futodama.app/moji-kids/", "https://futodama.app/ja/moji-kids/"] });
  assert.deepEqual(sent.map((e) => [e.event, e.product, e.target]), [["site_page_view", "moji_kids", ""]], "same product → no product_interest");
  const fromHome = run(CURRENT, "/", { clicks: ["https://futodama.app/moji-kids/"] });
  assert.deepEqual(fromHome.map((e) => [e.event, e.product, e.target]), [["site_page_view", "site", ""], ["product_interest", "moji_kids", "product_page"]]);
});

test("Google Play and registered web apps map through the registry; unknown store apps count for the page", () => {
  const block = CURRENT.replace(/var STORE_PRODUCTS = \{[^}]*\}/, 'var STORE_PRODUCTS = {"app_store:6801533488":"mojitsunagi","google_play:com.futodama.arrvd":"arrvd","web:celestial.futodama.app":"celestial_oracle"}');
  const sent = run(block, "/arrvd/", { clicks: [
    "https://play.google.com/store/apps/details?id=com.futodama.arrvd&hl=ja",
    "https://play.google.com/store/apps/details?id=com.unknown.app",
    "https://apps.apple.com/app/id6801533488",
    "https://celestial.futodama.app/",
  ] });
  assert.deepEqual(sent.slice(1).map((e) => [e.event, e.product, e.target]), [
    ["outbound_cta", "arrvd", "play_store"],
    ["outbound_cta", "arrvd", "play_store"], // unregistered package: the page's product, not a guess
    ["outbound_cta", "mojitsunagi", "app_store"],
    ["outbound_cta", "celestial_oracle", "web_app"],
  ]);
});
