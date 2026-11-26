// Cache busting (tools/asset-version.mjs): every page links the shared stylesheet and script with the
// content hash of the file, so a changed file always gets a new URL and new HTML never runs against a
// stale cached copy (futodama.app caches static files in the browser for 4 hours).
// Run: node --test tests/

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { ASSETS, ROOT, currentVersions, outdatedPages, pages, rewrite, versionOf } from "../tools/asset-version.mjs";

const versions = currentVersions();

test("every page links style.css and script.js with the current content hash (run: node tools/asset-version.mjs --write)", () => {
  assert.deepEqual(outdatedPages(), []);
  let links = 0;
  for (const file of pages()) {
    const html = readFileSync(file, "utf8");
    for (const asset of ASSETS) {
      for (const [, v] of html.matchAll(new RegExp(String.raw`(?:href|src)="(?:\.\.\/)*\/?${asset.replace(".", "\\.")}(?:\?v=([0-9a-f]+))?"`, "g"))) {
        assert.equal(v, versions[asset], `${file}: ${asset} without the current ?v=`);
        links += 1;
      }
    }
  }
  assert.ok(links >= 60, `links ${links}`); // 33 pages × stylesheet (+ script on most)
});

test("the version is the file's content hash: stable on re-run, new only when the content changes", () => {
  for (const asset of ASSETS) {
    const content = readFileSync(join(ROOT, asset));
    assert.match(versions[asset], /^[0-9a-f]{10}$/);
    assert.equal(versionOf(content), versions[asset], "same content → same version");
    assert.notEqual(versionOf(Buffer.concat([content, Buffer.from("\n")])), versions[asset], "changed content → new version");
    // A CRLF checkout (Windows) and the LF file in Git / on Cloudflare Pages get the same version.
    const lf = String(content).replace(/\r\n/g, "\n");
    assert.equal(versionOf(lf.replace(/\n/g, "\r\n")), versionOf(lf), "line endings don't change the version");
  }
  // Re-running the rewrite on an up-to-date page changes nothing.
  for (const file of pages()) {
    const html = readFileSync(file, "utf8");
    assert.equal(rewrite(html, versions), html, file);
  }
});

test("a forgotten update is detected: a page still on an older version is reported", () => {
  const stale = { ...versions, "style.css": "0000000000" };
  assert.ok(outdatedPages(ROOT, stale).length >= 33, "every page is outdated against another version");
  const page = '<link rel="stylesheet" href="../style.css?v=0000000000">\n<script src="../script.js"></script>\n<p>style.css script.js</p>';
  assert.equal(
    rewrite(page, versions),
    `<link rel="stylesheet" href="../style.css?v=${versions["style.css"]}">\n<script src="../script.js?v=${versions["script.js"]}"></script>\n<p>style.css script.js</p>`,
    "only the two attributes change; text and other links stay as they are"
  );
});

test("only the shared stylesheet and script are versioned (page-specific files keep their URLs)", () => {
  for (const file of pages()) {
    const html = readFileSync(file, "utf8");
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+\?v=[^"]*)"/g)) {
      assert.match(url, /^(?:\.\.\/)*\/?(?:style\.css|script\.js)\?v=[0-9a-f]{10}$/, `${file}: ${url}`);
    }
  }
  const invite = readFileSync(join(ROOT, "arrvd/invite-fallback.html"), "utf8");
  assert.match(invite, /href="\/arrvd\/invite-fallback\.css"/, "the invitation page keeps its own CSS (strict CSP)");
  assert.match(invite, /src="\/arrvd\/invite-fallback\.js"/);
});
