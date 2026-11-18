// STEP 110-10AA — the ARRVD guardian link (https://futodama.app/arrvd/guardian/<requestId>#<token>)
// opened in a browser: a guidance page instead of the 404, without touching the token.
// Run: node --test tests/

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const ROOT = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, ROOT), "utf8");
const PAGE = read("arrvd/guardian-link.html");
const REDIRECTS = read("_redirects");
// The production main this branch was built on (the invitation fix 8b1090c, legal-2026-11-14/77). A fixed
// commit, not the "main" branch name, which may be stale in a local clone.
const PRODUCTION_BASE = "8b1090c";
const MAIN_REDIRECTS = execFileSync("git", ["show", `${PRODUCTION_BASE}:_redirects`], { encoding: "utf8" });
const HEADERS = read("_headers");
const SCRIPT = read("script.js");
const EMAIL = "futodama0610@gmail.com";
const TOKEN = "Tok3n_secret-VALUE";

// Cloudflare Pages _redirects, the subset this site uses: "from to status", exact paths or one
// trailing "*" (which may match nothing). The first matching rule wins.
const rules = REDIRECTS.split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))
  .map((l) => l.split(/\s+/));
function route(path) {
  for (const [from, to, status] of rules) {
    const hit = from.endsWith("*") ? path.startsWith(from.slice(0, -1)) : path === from;
    if (hit) return { to, status };
  }
  return null;
}

test("a guardian link path is rewritten (200, not a redirect) to the guidance page, with or without an id; the target has no .html (Pages would redirect it)", () => {
  for (const path of ["/arrvd/guardian/AbC123_-x", "/arrvd/guardian/", "/arrvd/guardian"]) {
    assert.deepEqual(route(path), { to: "/arrvd/guardian-link", status: "200" }, path);
  }
  assert.ok(existsSync(new URL("arrvd/guardian-link.html", ROOT)));
});

test("the other ARRVD paths are unchanged: invitations, the guardians pages, the rest", () => {
  // Invitations go to the extension-less fallback since 8b1090c (a ".html" target became a redirect that dropped the id).
  assert.deepEqual(route("/arrvd/invite/abc"), { to: "/arrvd/invite-fallback", status: "200" });
  for (const path of ["/arrvd/guardians/", "/ja/arrvd/guardians/", "/ms/arrvd/guardians/", "/arrvd/", "/arrvd/privacy/", "/ms/arrvd/privacy/"]) {
    assert.equal(route(path), null, path);
  }
  for (const line of MAIN_REDIRECTS.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"))) {
    assert.ok(REDIRECTS.includes(line), `main's rule kept as it was: ${line}`);
  }
});

test("the page explains the link in English, Japanese and Malay, with the steps, the 7 days, the guardians page and the contact", () => {
  const sections = [...PAGE.matchAll(/<section lang="(en|ja|ms)" data-guardian-lang="\1">([\s\S]*?)<\/section>/g)];
  assert.deepEqual(sections.map((m) => m[1]), ["en", "ja", "ms"]);
  const expect = {
    en: { app: "“For guardians”", days: "7 days", page: "/arrvd/guardians/" },
    ja: { app: "「保護者の方はこちら」", days: "7日間", page: "/ja/arrvd/guardians/" },
    // The app has no Malay text yet: its button reads "For guardians" on a Malay iPhone.
    ms: { app: "“For guardians”", days: "7 hari", page: "/ms/arrvd/guardians/" },
  };
  for (const [, lang, body] of sections) {
    const e = expect[lang];
    assert.ok(body.includes(e.app), `${lang}: names the app's button`);
    assert.ok(body.includes(e.days), `${lang}: one use, 7 days`);
    assert.ok(body.includes(`href="${e.page}"`) && existsSync(new URL(`${e.page.slice(1)}index.html`, ROOT)), `${lang}: links its guardians page`);
    assert.ok(body.includes(`href="mailto:${EMAIL}"`), `${lang}: the privacy contact`);
  }
  assert.match(PAGE, /<meta name="viewport" content="width=device-width, initial-scale=1.0">/);
  assert.match(PAGE, /<meta name="robots" content="noindex">/);
});

test("the page never reads, shows, sends or replaces the token, and says it checks nothing", () => {
  assert.match(PAGE, /<meta name="referrer" content="no-referrer">/, "no part of the address goes to the next page or site");
  const scripts = [...PAGE.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  assert.deepEqual(scripts, [], "no script at all, not even the site script (_headers: script-src 'none')");
  assert.doesNotMatch(PAGE, /location|\.hash|href="#|<form|<input|<iframe/i);
  for (const m of PAGE.matchAll(/(?:href|src)="([^"]+)"/g)) {
    assert.ok(m[1].startsWith("/") || m[1].startsWith(`mailto:${EMAIL}`), `same-site or the contact only: ${m[1]}`);
  }
  assert.ok(PAGE.includes("does not check the link and does not record any consent"));
  assert.ok(PAGE.includes("リンクの確認も、同意の記録もしません"));
  assert.ok(PAGE.includes("tidak menyemak pautan dan tidak merekodkan sebarang persetujuan"));
});

test("the guardians pages name the app's button as the app shows it (the app has no Malay text yet)", () => {
  assert.ok(read("arrvd/guardians/index.html").includes("tap “For guardians”"));
  assert.ok(read("ja/arrvd/guardians/index.html").includes("「保護者の方はこちら」をタップ"));
  const ms = read("ms/arrvd/guardians/index.html");
  assert.ok(ms.includes("ketik “For guardians”"));
  assert.ok(!ms.includes("ketik “Untuk penjaga”"));
});

// script.js in a minimal fake browser (as tests/script.test.mjs): the JSON bodies sent to the collector.
function run(href, lang = "en") {
  const sent = [];
  const location = new URL(href);
  const document = {
    querySelector: () => null, getElementById: () => null, documentElement: { lang },
    prerendering: false, visibilityState: "hidden", addEventListener: () => {},
  };
  const window = { fetch: (url, init) => (sent.push(init.body), Promise.resolve()) };
  vm.runInNewContext(SCRIPT, {
    window, document, location, navigator: { webdriver: false, userAgent: "Mozilla/5.0" },
    URL, URLSearchParams, setTimeout: () => 0, clearTimeout: () => {}, Date, JSON, Object,
  });
  return sent;
}

test("analytics: a guardian link is never counted; nothing sent anywhere carries the token or the request id", () => {
  assert.deepEqual(run(`https://futodama.app/arrvd/guardian/Req123#${TOKEN}`), []);
  assert.deepEqual(run(`https://futodama.app/arrvd/guardian/#${TOKEN}`), []);
  // Opened by its own name (no id, no token in the address): an ordinary page view of that name.
  const direct = run("https://futodama.app/arrvd/guardian-link.html");
  assert.equal(direct.length, 1);
  assert.equal(JSON.parse(direct[0]).page_path, "/arrvd/guardian-link.html");
  for (const body of direct) assert.ok(!body.includes("#") && !body.includes(TOKEN));
});

// _headers in the format Cloudflare Pages reads: a path line, then indented "Name: value" lines.
function headerBlocks(text) {
  const blocks = {};
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) blocks[(current = line.trim())] = {};
    else {
      const i = line.indexOf(":");
      blocks[current][line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
  }
  return blocks;
}

test("headers: on every guardian link address no script may run and nothing may be sent; no referrer, not indexed", () => {
  const blocks = headerBlocks(HEADERS);
  for (const path of ["/arrvd/guardian", "/arrvd/guardian/*", "/arrvd/guardian-link", "/arrvd/guardian-link.html"]) {
    const h = blocks[path];
    assert.ok(h, `no headers for ${path}`);
    const csp = h["content-security-policy"].split(";").map((s) => s.trim());
    for (const part of ["default-src 'none'", "script-src 'none'", "connect-src 'none'", "form-action 'none'", "base-uri 'none'", "frame-ancestors 'none'", "style-src 'self'", "img-src 'self'"]) {
      assert.ok(csp.includes(part), `${path}: ${part}`);
    }
    assert.ok(!/unsafe-|https?:|\*/.test(h["content-security-policy"]), `${path}: CSP allows more than this site`);
    assert.equal(h["referrer-policy"], "no-referrer");
    assert.equal(h["x-robots-tag"], "noindex");
  }
  // The guardians pages (/arrvd/guardians/) are ordinary pages: not caught by the guardian link rules.
  for (const path of Object.keys(blocks)) assert.ok(!path.startsWith("/arrvd/guardians"), path);
  // The invitation headers and the AASA type are still there.
  assert.ok(blocks["/arrvd/invite/*"]["content-security-policy"].includes("connect-src 'none'"));
  assert.equal(blocks["/.well-known/apple-app-site-association"]["content-type"], "application/json");
});

test("the contact address is kept out of Cloudflare's email obfuscation, whose decoder script could not run here", () => {
  const mailto = [...PAGE.matchAll(/<a href="mailto:[^"]+">[^<]*<\/a>/g)];
  assert.equal(mailto.length, 3);
  for (const m of mailto) {
    const before = PAGE.slice(0, m.index);
    assert.ok(before.endsWith("<!--email_off-->") && PAGE.slice(m.index + m[0].length).startsWith("<!--/email_off-->"), m[0]);
  }
});
