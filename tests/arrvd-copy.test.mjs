// ARRVD marketing copy on the home and ARRVD product pages (EN and JA): no promise the product can't keep,
// no misleading claim about location, and the same facts in both languages as the published ARRVD
// Privacy Policy, Terms of Use and Support pages (iPhone; Malaysia and Japan; Organizers 18+, Members 13+;
// guardian consent for 13–17; records deleted after 7 days; detection not guaranteed; not an emergency service).
// Run: node --test tests/

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const visible = (html) =>
  html
    .replace(/<head>[\s\S]*?<\/head>/, (head) =>
      [/<title>([^<]*)<\/title>/, /<meta name="description" content="([^"]*)">/].map((re) => (head.match(re) || [])[1] || "").join(" ")
    )
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ");

const PAGES = {
  "index.html": "en",
  "arrvd/index.html": "en",
  "ja/index.html": "ja",
  "ja/arrvd/index.html": "ja",
};

// Promises ARRVD can't keep, and wording that would hide that ARRVD uses location.
const BANNED = {
  en: [
    /\bnever miss/i,
    /\balways (?:detect|know|notif)/i,
    /\bevery arrival (?:is|will be) detected/i,
    /\bguarantee[sd]? (?:that |your |their |the )?(?:safety|arrival|detection)/i,
    /\b100 ?%/,
    /\bcompletely safe\b/i,
    /\bkeeps? (?:your )?(?:family|child|kids?) safe\b/i,
    /\bdoes(?:n’t|n't| not) (?:use|collect|access) (?:your |any )?location/i,
    /\bno location (?:data|tracking at all)\b/i,
    /\breal-time tracking\b(?! of)/i,
  ],
  ja: [/必ず/, /絶対(?!的な安全性を保証することはできません)/, /確実に(?:検知|通知|お知らせ)/, /見逃さない/, /100[%％]/, /安全を(?:守|保証)/, /位置情報を(?:取得|使用|利用|使わ|収集)(?:し)?(?:ない|ません)/, /位置情報なし/],
};

test("no promise ARRVD can't keep and no claim that ARRVD doesn't use location", () => {
  for (const [path, lang] of Object.entries(PAGES)) {
    const t = visible(read(path));
    for (const pattern of BANNED[lang]) assert.doesNotMatch(t, pattern, `${path}: ${pattern}`);
  }
});

test("the home and ARRVD pages state the published facts in both languages", () => {
  const FACTS = {
    en: [/does use location|Does ARRVD use location at all\? Yes/, /iPhone/, /Malaysia and Japan/, /18 or over/, /13 or over/, /13 to 17/, /7 days/, /(?:detected late or not at all)/, /isn’t an emergency service/],
    ja: [/位置情報を使います|位置情報を使いますか？ はい/, /iPhone/, /マレーシアと日本/, /18歳以上/, /13歳以上/, /13〜17歳/, /7日/, /検知が遅れたり、検知できなかったり/, /緊急サービスではありません/],
  };
  for (const [path, lang] of Object.entries(PAGES)) {
    const t = visible(read(path));
    for (const fact of FACTS[lang]) assert.match(t, fact, `${path}: ${fact}`);
  }
});

test("the main copy matches the approved headlines", () => {
  assert.match(visible(read("index.html")), /Know they arrived\. Not everywhere they went\./);
  assert.match(visible(read("arrvd/index.html")), /Know they arrived\. Not everywhere they went\./);
  for (const path of ["ja/index.html", "ja/arrvd/index.html"]) {
    const t = visible(read(path)).replace(/ /g, "");
    assert.match(t, /大切な人の『着いた』がわかる安心を。/, path);
    assert.match(t, /ずっと居場所を追い続けることなく。/, path);
  }
});
