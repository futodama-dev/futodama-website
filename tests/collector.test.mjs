// Collector (functions/api/analytics/event.js): the current version against the version on main.
// Everything main accepted must be stored identically; the only additions are product tokens that are
// not registered yet (kept, classified downstream), the play_store target and generic section paths.
// Run: node --test tests/

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const load = (source) => import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Math.random()}`);
const current = await load(readFileSync(new URL("../functions/api/analytics/event.js", import.meta.url), "utf8"));
const main = await load(execFileSync("git", ["show", "main:functions/api/analytics/event.js"], { encoding: "utf8" }));

async function send(mod, payload) {
  const points = [];
  const env = { SITE_ANALYTICS: { writeDataPoint: (p) => points.push(p) } };
  const request = new Request("https://futodama.app/api/analytics/event", {
    method: "POST",
    headers: { Origin: "https://futodama.app", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const res = await mod.onRequest({ request, env });
  return { status: res.status, analytics: res.headers.get("X-Analytics-Status"), point: points[0] || null };
}

const base = { lang: "ja", source: "", medium: "", campaign: "", content: "" };
const PATHS = ["/", "/ja/", "/about/", "/ja/about/", "/support/", "/privacy/", "/terms/", "/legal/", "/arrvd/", "/ja/arrvd/", "/arrvd/privacy/", "/arrvd/terms/", "/ja/arrvd/support/", "/mojitsunagi/", "/ja/mojitsunagi/", "/celestial-oracle/", "/ja/celestial-oracle/", "/404.html", "/arrvd/invite-fallback.html", "/x/y/z/"];
const PRODUCTS = ["site", "arrvd", "mojitsunagi", "celestial_oracle"];
const CASES = [];
for (const page_path of PATHS) {
  for (const product of PRODUCTS) {
    for (const event of ["site_page_view", "engagement_15s", "engagement_60s", "engagement_180s"]) CASES.push({ ...base, event, page_path, product, target: "" });
    CASES.push({ ...base, event: "product_interest", page_path, product, target: "product_page" });
    for (const target of ["app_store", "web_app"]) CASES.push({ ...base, event: "outbound_cta", page_path, product, target });
  }
}
CASES.push({ ...base, event: "site_page_view", page_path: "/", product: "site", target: "", source: "x", medium: "social", campaign: "launch_2026", content: "post-1" });

test("every event main accepted is stored identically (blobs, index, status)", async () => {
  let accepted = 0;
  for (const payload of CASES) {
    const before = await send(main, payload);
    const after = await send(current, payload);
    if (before.status === 204 && before.analytics === "stored") {
      accepted += 1;
      assert.deepEqual(after, before, JSON.stringify(payload));
    }
  }
  assert.ok(accepted > 300, `accepted ${accepted}`);
});

test("events main rejected stay rejected, except the documented additions", async () => {
  for (const payload of CASES) {
    const before = await send(main, payload);
    if (before.status !== 204) assert.equal((await send(current, payload)).status, before.status, JSON.stringify(payload));
  }
  // malformed / free-text products and unknown events or targets are still refused
  for (const product of ["", "Arrvd", "a", "arrvd-2", "x".repeat(33), "moji tsunagi", "1app"]) {
    assert.equal((await send(current, { ...base, event: "site_page_view", page_path: "/", product, target: "" })).status, 400, product);
  }
  assert.equal((await send(current, { ...base, event: "purchase", page_path: "/", product: "site", target: "" })).status, 400);
  assert.equal((await send(current, { ...base, event: "outbound_cta", page_path: "/", product: "arrvd", target: "steam" })).status, 400);
  assert.equal((await send(current, { ...base, event: "product_interest", page_path: "/", product: "site", target: "product_page" })).status, 400);
});

test("a new product page is kept (not dropped): unregistered token and its section path are stored", async () => {
  const r = await send(current, { ...base, event: "site_page_view", page_path: "/moji-kids/", product: "moji_kids", target: "" });
  assert.deepEqual([r.status, r.analytics], [204, "stored"]);
  assert.deepEqual(r.point.blobs.slice(0, 5), ["site_page_view", "/moji-kids/", "ja", "moji_kids", ""]);
  assert.equal((await send(main, { ...base, event: "site_page_view", page_path: "/moji-kids/", product: "moji_kids", target: "" })).status, 400, "main dropped it");
  const sub = await send(current, { ...base, event: "site_page_view", page_path: "/ja/moji-kids/privacy/", product: "moji_kids", target: "" });
  assert.equal(sub.point.blobs[1], "/ja/moji-kids/privacy/");
  const odd = await send(current, { ...base, event: "site_page_view", page_path: "/Moji_Kids/../", product: "moji_kids", target: "" });
  assert.equal(odd.point.blobs[1], "other");
});

test("Google Play outbound clicks: play_store target for a product", async () => {
  const r = await send(current, { ...base, event: "outbound_cta", page_path: "/arrvd/", product: "arrvd", target: "play_store" });
  assert.deepEqual([r.status, r.point.blobs[3], r.point.blobs[4]], [204, "arrvd", "play_store"]);
});
