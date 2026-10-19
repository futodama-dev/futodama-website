// futodama — anonymous, aggregate site events → Cloudflare Workers Analytics Engine
//
// POST /api/analytics/event  (same-origin, JSON, max 4 KB)
// Binding: SITE_ANALYTICS (dataset: futodama_site_events), configured in the
// Cloudflare Pages project settings — never in code.
//
// Only allowlisted events and dimensions are stored. Nothing that identifies a
// person or device is read or written: no user/session IDs, no IP address, no
// User-Agent, no cookies, no full query strings, no free-form input.
// Data point layout (fixed — see docs/analytics/marketing-measurement.md):
//   index1 = event
//   blob1 = event, blob2 = page_path, blob3 = lang, blob4 = product,
//   blob5 = target, blob6 = source, blob7 = medium, blob8 = campaign,
//   blob9 = content

const PRODUCTION_HOST = "futodama.app";
const PRODUCTION_ORIGIN = "https://futodama.app";
const MAX_BODY_BYTES = 4096;

const EVENTS = new Set([
  "site_page_view",
  "product_interest",
  "outbound_cta",
  "engagement_15s",
  "engagement_60s",
  "engagement_180s",
]);
// "site" (brand pages) or a product_id-shaped token. The product registry (futodama-analytics) decides
// downstream whether a product is registered; an unregistered product is kept and reported, never
// dropped here. The format check keeps out free text and over-long values.
const PRODUCT = /^(?:site|[a-z][a-z0-9_]{1,31})$/;
const OUTBOUND_TARGETS = new Set(["app_store", "play_store", "web_app"]);
const LANGS = new Set(["en", "ja"]);

// Canonical site paths — the top page, a section ("/about/", "/arrvd/") and a section's privacy /
// terms / support page, with an optional "/ja/" prefix; anything else (404s, invitation links,
// files, …) is stored as "other".
const PAGE_PATH = /^\/(?:ja\/)?(?:[a-z0-9][a-z0-9-]{0,39}\/(?:privacy\/|terms\/|support\/)?)?$/;
// Campaign values (utm_* / src·med·cmp·cnt): short, URL-safe tokens only — no "@", spaces or free text.
const CAMPAIGN_VALUE = /^[A-Za-z0-9._~-]{1,64}$/;

// X-Analytics-Status tells whether the event was handed to Analytics Engine
// (stored), not recorded on purpose (skipped), the binding is missing
// (unavailable) or the write threw (error). It carries no request data.
function noContent(status = 204, analyticsStatus = "rejected") {
  return new Response(null, {
    status,
    headers: { "Cache-Control": "no-store", "X-Analytics-Status": analyticsStatus },
  });
}

// Reads at most MAX_BODY_BYTES; returns null when the body is larger.
async function readBody(request) {
  if (!request.body) {
    return new Uint8Array(0);
  }
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function clean(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim().slice(0, maxLength);
}

// Over-long or non-token values are dropped, not truncated.
function campaignValue(value) {
  const v = clean(value, 256);
  return CAMPAIGN_VALUE.test(v) ? v : "";
}

// Returns the blobs to store, or null when the payload is not acceptable.
function toDataPoint(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const event = clean(payload.event, 32);
  const product = clean(payload.product, 64); // the format check rejects more than 32 characters (no truncation)
  const target = clean(payload.target, 32);
  if (!EVENTS.has(event) || !PRODUCT.test(product)) {
    return null;
  }

  if (event === "outbound_cta") {
    if (!OUTBOUND_TARGETS.has(target)) {
      return null;
    }
  } else if (event === "product_interest") {
    if (product === "site" || target !== "product_page") {
      return null;
    }
  } else if (target !== "") {
    return null;
  }

  const rawPath = clean(payload.page_path, 128);
  const pagePath = PAGE_PATH.test(rawPath) ? rawPath : "other";
  const lang = LANGS.has(clean(payload.lang, 8)) ? clean(payload.lang, 8) : "";

  return [
    event,
    pagePath,
    lang,
    product,
    target,
    campaignValue(payload.source),
    campaignValue(payload.medium),
    campaignValue(payload.campaign),
    campaignValue(payload.content),
  ];
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { Allow: "POST", "Cache-Control": "no-store", "X-Analytics-Status": "rejected" },
    });
  }

  // Record production traffic only; preview deployments and local runs are accepted but not stored.
  const url = new URL(request.url);
  if (url.hostname !== PRODUCTION_HOST) {
    return noContent(204, "skipped");
  }

  // Browsers always send Origin on a POST from the site itself. This only keeps
  // out casual cross-site and header-less requests; it is not authentication.
  if (request.headers.get("Origin") !== PRODUCTION_ORIGIN) {
    return noContent(403);
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return noContent(413);
  }

  let body;
  try {
    body = await readBody(request);
  } catch {
    return noContent(400);
  }
  if (body === null) {
    return noContent(413);
  }

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return noContent(400);
  }

  const blobs = toDataPoint(payload);
  if (!blobs) {
    return noContent(400);
  }

  // Analytics must never get in the way of the site: a missing binding or a
  // failed write is answered with 204 as well.
  if (!env || !env.SITE_ANALYTICS) {
    return noContent(204, "unavailable");
  }
  try {
    env.SITE_ANALYTICS.writeDataPoint({ indexes: [blobs[0]], blobs });
  } catch {
    return noContent(204, "error");
  }
  return noContent(204, "stored");
}
