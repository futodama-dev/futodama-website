#!/usr/bin/env node
// Content-hash versions for the site's shared stylesheet and script (cache busting).
//
//   node tools/asset-version.mjs          # check: exit 1 if any page links an outdated version
//   node tools/asset-version.mjs --write  # rewrite ?v= in every page that links style.css / script.js
//
// futodama.app serves static files with a 4-hour browser cache (Cloudflare zone setting), while HTML is
// revalidated on every visit. A page therefore links `style.css?v=<hash>` and `script.js?v=<hash>`, where
// <hash> is the first 10 hex characters of the file's SHA-256: the URL changes only when the file's content
// changes, so new HTML never picks up a stale cached file. Only the href / src of the shared
// <link rel="stylesheet"> and <script> is touched; nothing else in any page changes. No dependencies.
//
// Run `--write` after editing style.css or script.js, and after `npm run registry -- site-config --write`
// (futodama-analytics), which rewrites script.js. tests/asset-version.test.mjs fails until every page
// carries the current version.

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Not part of the published site, or not a page.
const SKIP = new Set([".git", ".claude", ".private", "node_modules", "docs", "tests", "tools", "functions"]);
export const ASSETS = ["style.css", "script.js"];
const PATTERN = {
  "style.css": /(<link rel="stylesheet" href=")((?:\.\.\/)*|\/)?style\.css(?:\?v=[0-9a-f]+)?(")/g,
  "script.js": /(<script src=")((?:\.\.\/)*|\/)?script\.js(?:\?v=[0-9a-f]+)?(")/g,
};

// Hashed as stored in Git and deployed (LF line endings), so a Windows checkout with CRLF gets the same
// version as every other machine and as Cloudflare Pages.
export const versionOf = (content) =>
  createHash("sha256").update(String(content).replace(/\r\n/g, "\n")).digest("hex").slice(0, 10);

export function currentVersions(root = ROOT) {
  return Object.fromEntries(ASSETS.map((f) => [f, versionOf(readFileSync(join(root, f)))]));
}

export function pages(root = ROOT, dir = root) {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? pages(root, p) : name.endsWith(".html") ? [p] : [];
  });
}

// The page with the shared stylesheet / script links set to `versions`; every other byte unchanged.
export function rewrite(html, versions) {
  let out = html;
  for (const asset of ASSETS) {
    out = out.replace(PATTERN[asset], (_, open, prefix = "", close) => `${open}${prefix}${asset}?v=${versions[asset]}${close}`);
  }
  return out;
}

// Pages whose links differ from `versions` (relative paths).
export function outdatedPages(root = ROOT, versions = currentVersions(root)) {
  return pages(root).filter((file) => {
    const html = readFileSync(file, "utf8");
    return rewrite(html, versions) !== html;
  }).map((file) => relative(root, file).replace(/\\/g, "/"));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const write = process.argv.includes("--write");
  const versions = currentVersions();
  const outdated = outdatedPages(ROOT, versions);
  for (const path of outdated) {
    if (write) {
      const file = join(ROOT, path);
      writeFileSync(file, rewrite(readFileSync(file, "utf8"), versions));
    }
    console.log(`${write ? "updated" : "outdated"}: ${path}`);
  }
  console.log(`style.css?v=${versions["style.css"]}  script.js?v=${versions["script.js"]}  ${outdated.length} page(s) ${write ? "updated" : outdated.length ? "outdated — run with --write" : "up to date"}`);
  process.exitCode = !write && outdated.length ? 1 : 0;
}
