// ARRVD invitation fallback (/arrvd/invite/<id>#<token>) — STEP 110-INVITE-LINK-FIX, legal-2026-11-14/75.
// Checks the rewrite (no ".html" target, so no redirect that drops the id), the page's safety headers,
// that the page sends nothing anywhere, and the copy / language behaviour of arrvd/invite-fallback.js
// in a minimal fake browser built from the real page's markup.
// Run: node --test tests/*.test.mjs

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const REDIRECTS = read("_redirects");
const HEADERS = read("_headers");
const PAGE = read("arrvd/invite-fallback.html");
const SCRIPT = read("arrvd/invite-fallback.js");
// Production before the invitation fix (4329dd7): the rules this fix started from. A fixed commit, not the
// "main" branch name, which moves (and may be stale in a local clone).
const MAIN_REDIRECTS = execFileSync("git", ["show", "4329dd7:_redirects"], { encoding: "utf8" });

const rules = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/));

// --- _redirects --------------------------------------------------------------------------------

test("invitation addresses are rewritten (200) to the extension-less fallback, never redirected", () => {
  const invite = rules(REDIRECTS).filter(([from]) => from.startsWith("/arrvd/invite"));
  assert.deepEqual(invite, [
    ["/arrvd/invite", "/arrvd/invite-fallback", "200"],
    ["/arrvd/invite/", "/arrvd/invite-fallback", "200"],
    ["/arrvd/invite/*", "/arrvd/invite-fallback", "200"],
  ]);
  for (const [, to] of invite) {
    assert.ok(!to.endsWith(".html"), "a .html target makes Pages redirect");
    assert.ok(!to.startsWith("/arrvd/invite/"), "a target under /arrvd/invite/ would loop");
  }
});

test("every other rule on main is kept unchanged", () => {
  const current = rules(REDIRECTS).map((r) => r.join(" "));
  for (const rule of rules(MAIN_REDIRECTS)) {
    if (rule[0] === "/arrvd/invite/*") continue;
    assert.ok(current.includes(rule.join(" ")), `missing rule: ${rule.join(" ")}`);
  }
  // The one old invitation rule became three; the only other additions are the guardian link rules
  // (tests/guardian-link.test.mjs checks those).
  const others = rules(REDIRECTS).filter(([from]) => !from.startsWith("/arrvd/guardian"));
  assert.equal(others.length, rules(MAIN_REDIRECTS).length + 2);
});

// --- _headers ------------------------------------------------------------------------------------

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

test("the fallback may not send anything anywhere and leaves no referrer", () => {
  const blocks = headerBlocks(HEADERS);
  for (const path of ["/arrvd/invite", "/arrvd/invite/*", "/arrvd/invite-fallback", "/arrvd/invite-fallback.html"]) {
    const h = blocks[path];
    assert.ok(h, `no headers for ${path}`);
    const csp = h["content-security-policy"];
    for (const part of ["default-src 'none'", "script-src 'self'", "connect-src 'none'", "form-action 'none'", "base-uri 'none'", "frame-ancestors 'none'"]) {
      assert.ok(csp.includes(part), `${path}: ${part}`);
    }
    assert.ok(!/unsafe-inline|unsafe-eval|https?:|\*/.test(csp), `${path}: CSP allows more than this site`);
    assert.equal(h["referrer-policy"], "no-referrer");
    assert.equal(h["x-robots-tag"], "noindex");
  }
  assert.equal(blocks["/.well-known/apple-app-site-association"]["content-type"], "application/json");
});

// --- the page --------------------------------------------------------------------------------

test("the page loads only its own files: no site/analytics script, no inline code, nothing external", () => {
  const sources = [...PAGE.matchAll(/\s(?:src|href)="([^"]*)"/g)].map((m) => m[1]);
  for (const src of sources) assert.ok(src.startsWith("/") || src.startsWith("mailto:futodama0610@gmail.com"), src);
  assert.ok(!sources.includes("/script.js"), "the site script (analytics) must not run here");
  assert.deepEqual([...PAGE.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1].trim()), ['src="/arrvd/invite-fallback.js"']);
  assert.ok(!/\son[a-z]+=/i.test(PAGE), "no inline event handlers");
  assert.ok(!/href="#/.test(PAGE), "a #-link would replace the token in the address bar");
  assert.ok(!/<(form|iframe|img[^>]*src="http)/i.test(PAGE));
  assert.match(PAGE, /<meta name="robots" content="noindex">/);
  assert.match(PAGE, /<meta name="referrer" content="no-referrer">/);
  assert.match(PAGE, /<meta name="viewport"/);
});

test("the script sends nothing, stores nothing and never navigates or rewrites the address", () => {
  const code = SCRIPT.replace(/\/\/.*$/gm, "");
  for (const banned of ["fetch(", "XMLHttpRequest", "sendBeacon", "new Image", "WebSocket", "EventSource", "localStorage", "sessionStorage", "indexedDB", "document.cookie", "location.href =", "location.hash =", "location.assign", "location.replace", "history.", "window.open", "innerHTML", "outerHTML", "insertAdjacentHTML", "document.write", "eval(", "Function("]) {
    assert.ok(!code.includes(banned), `script uses ${banned}`);
  }
});

test("all three languages explain the steps with the app's own button names", () => {
  const sections = Object.fromEntries([...PAGE.matchAll(/data-invite-lang="(\w+)"[\s\S]*?(?=data-invite-lang="|<\/main>)/g)].map((m) => [m[1], m[0]]));
  assert.deepEqual(Object.keys(sections), ["en", "ja", "ms"]);
  const expect = {
    // lib/l10n/app_en.arb welcomeJoinWithInvitation / welcomePasteInvitationLink; app_ja.arb the same keys.
    en: ["Copy invitation link", "“Join with an invitation”", "“Paste invitation link”", "Open in Safari", "LINE", "WhatsApp", "App Store", "48 hours", "once", "computer", "incomplete"],
    ja: ["招待リンクをコピー", "「招待されて参加する」", "「招待リンクを貼り付け」", "Safari で開く", "LINE", "WhatsApp", "App Store", "48時間", "1回限り", "パソコン", "欠けている"],
    // The app has no Malay; on a Malay iPhone its buttons are in English.
    ms: ["Salin pautan jemputan", "“Join with an invitation”", "“Paste invitation link”", "Buka dalam Safari", "LINE", "WhatsApp", "App Store", "48 jam", "sekali sahaja", "komputer", "tidak lengkap"],
  };
  for (const [lang, words] of Object.entries(expect)) {
    for (const word of words) assert.ok(sections[lang].includes(word), `${lang}: ${word}`);
    for (const hook of ["data-invite-copy", "data-invite-manual-text", 'data-invite-when="ok"', 'data-invite-when="incomplete"', "data-invite-line-safari", 'data-invite-status="copied"']) {
      assert.ok(sections[lang].includes(hook), `${lang}: ${hook}`);
    }
  }
});

// --- arrvd/invite-fallback.js in a fake browser -------------------------------------------------

// Builds fake elements for every tag carrying a data-invite-* attribute, grouped by language section.
function fakePage() {
  const elements = [];
  let section = null;
  for (const m of PAGE.matchAll(/<(\w+)((?:\s[^>]*)?)>/g)) {
    const attrs = Object.fromEntries([...m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((a) => [a[1], a[2] ?? ""]));
    if (!Object.keys(attrs).some((k) => k.startsWith("data-invite"))) continue;
    const el = makeElement(m[1], attrs);
    if ("data-invite-lang" in attrs) section = el;
    else el.section = section;
    elements.push(el);
  }
  return elements;
}

function makeElement(tag, attrs) {
  const handlers = {};
  return {
    tag,
    attrs: { ...attrs },
    hidden: "hidden" in attrs,
    value: "",
    focused: false,
    selected: false,
    getAttribute(name) {
      return name in this.attrs ? this.attrs[name] : null;
    },
    setAttribute(name, value) {
      this.attrs[name] = String(value);
    },
    addEventListener(type, fn) {
      (handlers[type] ||= []).push(fn);
    },
    click() {
      for (const fn of handlers.click || []) fn({});
    },
    closest(selector) {
      return selector === "[data-invite-lang]" ? this.section : null;
    },
    querySelector(selector) {
      return elements_.find((el) => el.section === this && matches(el, selector)) || null;
    },
    focus() {
      this.focused = true;
    },
    select() {
      this.selected = true;
    },
    setSelectionRange() {},
  };
}

let elements_ = [];
function matches(el, selector) {
  const m = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
  if (!m) throw new Error(`unsupported selector ${selector}`);
  return m[1] in el.attrs && (m[2] === undefined || el.attrs[m[1]] === m[2]);
}

async function run(address, { languages = ["en-US"], userAgent = "Mozilla/5.0 (iPhone)", clipboard = "ok", execCommand = false } = {}) {
  const url = new URL(address);
  const elements = (elements_ = fakePage());
  const copied = [];
  const created = [];
  const root = makeElement("html", { lang: "en" });
  const document = {
    documentElement: root,
    body: { appendChild: (el) => created.push(el), removeChild: () => {} },
    querySelectorAll: (selector) => elements.filter((el) => matches(el, selector)),
    createElement: (tag) => makeElement(tag, {}),
    execCommand: (name) => {
      if (name === "copy" && execCommand) copied.push(created.at(-1).value);
      return execCommand;
    },
  };
  const navigator = { languages, language: languages[0], userAgent };
  if (clipboard === "ok") navigator.clipboard = { writeText: (text) => (copied.push(text), Promise.resolve()) };
  if (clipboard === "denied") navigator.clipboard = { writeText: () => Promise.reject(new Error("NotAllowedError")) };
  const location = { pathname: url.pathname, hash: url.hash, origin: url.origin, href: url.href };
  vm.runInNewContext(SCRIPT, { document, navigator, location, String, Array, Promise });
  const pick = (selector, lang) => elements.filter((el) => matches(el, selector) && (!lang || el.section?.attrs["data-invite-lang"] === lang));
  const visibleLang = elements.filter((el) => "data-invite-lang" in el.attrs && !el.hidden).map((el) => el.attrs["data-invite-lang"]);
  return {
    elements,
    pick,
    copied,
    location,
    lang: root.attrs.lang,
    visibleLang,
    async click(selector, lang) {
      pick(selector, lang)[0].click();
      await new Promise((resolve) => setImmediate(resolve));
    },
  };
}

const ID = "inv_TEST-0123456789abcdef";
const TOKEN = "tok_TEST-not_a_real_token-0123456789";
const APP_LINK = `https://futodama.app/arrvd/invite/${ID}#${TOKEN}`;

test("a complete link: steps shown, Copy puts the app's link on the clipboard, the address is untouched", async () => {
  for (const host of ["https://futodama.app", "https://fix-arrvd-invite-fallback.futodama-website.pages.dev"]) {
    const address = `${host}/arrvd/invite/${ID}#${TOKEN}`;
    const page = await run(address);
    assert.ok(page.pick('[data-invite-when="ok"]').every((el) => !el.hidden));
    assert.ok(page.pick('[data-invite-when="incomplete"]').every((el) => el.hidden));
    await page.click("[data-invite-copy]", "en");
    assert.deepEqual(page.copied, [APP_LINK]);
    assert.equal(page.pick('[data-invite-status="copied"]', "en")[0].hidden, false);
    assert.equal(page.pick("[data-invite-manual]", "en")[0].hidden, true, "the link is not shown when copying worked");
    assert.equal(page.location.href, address);
  }
});

test("a query (e.g. from LINE) or a trailing slash is not copied; the app's plain link is", async () => {
  for (const address of [`https://futodama.app/arrvd/invite/${ID}?openExternalBrowser=1#${TOKEN}`, `https://futodama.app/arrvd/invite/${ID}/#${TOKEN}`]) {
    const page = await run(address);
    await page.click("[data-invite-copy]", "en");
    assert.deepEqual(page.copied, [APP_LINK]);
  }
});

test("when the clipboard is refused, the selection copy is tried, then the link is shown to copy by hand", async () => {
  let page = await run(`https://futodama.app/arrvd/invite/${ID}#${TOKEN}`, { clipboard: "denied", execCommand: true });
  await page.click("[data-invite-copy]", "ja");
  assert.deepEqual(page.copied, [APP_LINK]);
  assert.equal(page.pick('[data-invite-status="copied"]', "ja")[0].hidden, false);

  page = await run(`https://futodama.app/arrvd/invite/${ID}#${TOKEN}`, { clipboard: "none", execCommand: false });
  await page.click("[data-invite-copy]", "ms");
  assert.deepEqual(page.copied, []);
  assert.equal(page.pick("[data-invite-manual]", "ms")[0].hidden, false);
  const text = page.pick("[data-invite-manual-text]", "ms")[0];
  assert.equal(text.value, APP_LINK);
  assert.ok(text.selected);
  assert.equal(page.pick("[data-invite-manual-text]", "en")[0].value, "", "only the section that was used shows it");
});

test("an incomplete or malformed address offers no copy and shows the safe explanation", async () => {
  const bad = [
    `https://futodama.app/arrvd/invite/${ID}`,
    `https://futodama.app/arrvd/invite/${ID}#`,
    `https://futodama.app/arrvd/invite/#${TOKEN}`,
    `https://futodama.app/arrvd/invite#${TOKEN}`,
    `https://futodama.app/arrvd/invite-fallback#${TOKEN}`,
    `https://futodama.app/arrvd/invite-fallback.html`,
    `https://futodama.app/arrvd/invite/${ID}/extra#${TOKEN}`,
    `https://futodama.app/arrvd/invite/%3Cscript%3E#${TOKEN}`,
    `https://futodama.app/arrvd/invite/${ID}#${TOKEN}%22%3E%3Cimg`,
    `https://futodama.app/arrvd/invite/${ID}#a b`,
    `https://futodama.app/arrvd/invite/${ID}#token=${TOKEN}`,
    `https://futodama.app/arrvd/invite/${"a".repeat(300)}#${TOKEN}`,
  ];
  for (const address of bad) {
    const page = await run(address, { userAgent: "Mozilla/5.0 (iPhone) Safari Line/14.0.0" });
    assert.ok(page.pick('[data-invite-when="ok"]').every((el) => el.hidden), address);
    assert.ok(page.pick('[data-invite-when="incomplete"]').every((el) => !el.hidden), address);
    assert.ok(page.pick("[data-invite-line-safari]").every((el) => el.hidden && !el.attrs.href), address);
    assert.deepEqual(page.copied, []);
  }
});

test("LINE's in-app browser gets an Open in Safari button for the same page; other browsers don't", async () => {
  const host = "https://fix-arrvd-invite-fallback.futodama-website.pages.dev";
  let page = await run(`${host}/arrvd/invite/${ID}#${TOKEN}`, { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.18.0" });
  for (const a of page.pick("[data-invite-line-safari]")) {
    assert.equal(a.hidden, false);
    assert.equal(a.attrs.href, `${host}/arrvd/invite/${ID}?openExternalBrowser=1#${TOKEN}`);
  }
  for (const ua of ["Mozilla/5.0 (iPhone) Version/18.0 Mobile Safari/604.1", "Mozilla/5.0 (iPhone) WhatsApp/2.24", "Mozilla/5.0 Online/1"]) {
    page = await run(`${host}/arrvd/invite/${ID}#${TOKEN}`, { userAgent: ua });
    assert.ok(page.pick("[data-invite-line-safari]").every((el) => el.hidden && !el.attrs.href), ua);
  }
});

test("one language at a time, from the device language; the buttons switch it without touching the address", async () => {
  const cases = [[["ja-JP"], "ja"], [["ms-MY", "en"], "ms"], [["en-MY"], "en"], [["zh-CN", "ja"], "ja"], [["fr-FR"], "en"], [[], "en"]];
  for (const [languages, lang] of cases) {
    const page = await run(`https://futodama.app/arrvd/invite/${ID}#${TOKEN}`, { languages });
    assert.deepEqual(page.visibleLang, [lang], languages.join(","));
    assert.equal(page.lang, lang);
  }
  const address = `https://futodama.app/arrvd/invite/${ID}#${TOKEN}`;
  const page = await run(address, { languages: ["en"] });
  assert.equal(page.pick("[data-invite-langs]")[0].hidden, false);
  assert.equal(page.pick("[data-invite-langs-static]")[0].hidden, true);
  await page.click('[data-invite-lang-button="ms"]');
  assert.deepEqual(
    page.elements.filter((el) => "data-invite-lang" in el.attrs && !el.hidden).map((el) => el.attrs["data-invite-lang"]),
    ["ms"],
  );
  assert.equal(page.pick('[data-invite-lang-button="ms"]')[0].attrs["aria-pressed"], "true");
  assert.equal(page.location.href, address);
});
