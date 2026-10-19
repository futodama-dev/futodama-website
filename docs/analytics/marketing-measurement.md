# futodama.app — Marketing Measurement

## Purpose

This measurement exists to understand, in aggregate, how the website moves people along:

**Acquisition → Interest → Engagement → CTA → Acquisition of users (in the stores / web app)**

It answers questions such as "Which campaign brings visitors who go on to look at a product?", "Which product pages hold attention for a minute?" and "How often does a product page lead to the App Store or the web app?" — per product, per language and per campaign.

It does **not** identify, profile or follow individual people. See [Privacy model](#privacy-model).

Cloudflare Web Analytics (injected by Cloudflare, not part of this repository) stays in place for visits, referrers and performance. The events below add product-level interest, engagement and CTA signals on top of it.

## Architecture

| Part | Where |
|---|---|
| Browser events | `script.js` (second IIFE, after the mobile navigation) |
| Collector | Cloudflare Pages Function `functions/api/analytics/event.js` → `POST /api/analytics/event` |
| Storage | Cloudflare Workers Analytics Engine, binding **`SITE_ANALYTICS`**, dataset **`futodama_site_events`** |

The binding is configured in the Cloudflare Pages project (Settings → Bindings), not in code; there is no `wrangler.toml`. If the binding is missing, the collector still answers `204` (`X-Analytics-Status: unavailable`) and writes nothing.

Only the production host `futodama.app` records events. The browser script does nothing on any other host (preview `*.pages.dev`, `localhost`, `127.0.0.1`), and the Function stores nothing for requests whose hostname is not `futodama.app`.

`_routes.json` limits Pages Functions to `/api/analytics/event`. Every other request (all pages and assets) is served as a static asset without invoking a Function, so the site keeps working even if the Function fails or the daily Functions allowance is used up.

The browser script also stays silent for automated browsers and crawlers that execute JavaScript (`navigator.webdriver`, or a User-Agent matching `bot|crawl|spider|slurp|headless|lighthouse` — tested in the browser only, never sent), and a prerendered page sends its page view only when the visitor actually opens it.

## Event dictionary

| Event | When | `product` | `target` |
|---|---|---|---|
| `site_page_view` | Once per page load | Product of the current page | *(empty)* |
| `product_interest` | Click on an internal link to another product's main page (`/<slug>/` or `/ja/<slug>/`, without a `#fragment`) | Product of the **destination** | `product_page` |
| `outbound_cta` | Click on an App Store link (`apps.apple.com/…/id<n>`) | Product registered for that Apple ID; otherwise the current page's product | `app_store` |
| `outbound_cta` | Click on a Google Play link (`play.google.com/store/apps/details?id=<package>`) | Product registered for that package; otherwise the current page's product | `play_store` |
| `outbound_cta` | Click on a registered web app host (e.g. `celestial.futodama.app`) | Product registered for that host | `web_app` |
| `engagement_15s` | The page has been **visible** for 15 s in total | Product of the current page | *(empty)* |
| `engagement_60s` | … 60 s in total | Product of the current page | *(empty)* |
| `engagement_180s` | … 180 s in total | Product of the current page | *(empty)* |

Notes:

- Engagement counts only time with `document.visibilityState === "visible"`; time in a background tab does not count. Each threshold is sent at most once per page load.
- `product_interest` is not sent when the destination is the same product as the current page (for example the language switch or ARRVD's own legal pages), nor for links to a product's `#legal` section.
- Invitation pages (`/arrvd/invite/…`) send no events at all.
- Clicks are sent with `fetch(…, { keepalive: true, credentials: "omit" })`, so they never delay or block navigation and never carry cookies.

### Product values

Products come from the **product registry** in futodama-analytics (D1 `products` / `product_platforms`), never from a list in this repository:

- `script.js` contains a generated block (`// BEGIN GENERATED SITE PRODUCTS` … `// END …`) with the registry's site slugs (`/arrvd/` → `arrvd`, `/celestial-oracle/` → `celestial_oracle`, …), brand sections and store IDs. It is written by `npm run registry -- site-config --site <this repo> --write` in futodama-analytics and checked by `npm run registry -- check-site --site <this repo>` — never edit it by hand. The site does not read D1 at runtime (no D1 binding on the Pages project).
- `site` = the top page and brand sections (About, Support, Privacy, Terms, Legal).
- A section the registry does not know yet (a new product page published before its registration) sends its slug as a product token (`/moji-kids/` → `moji_kids`). The event is **kept**: the collector accepts product_id-shaped tokens, the rollup stores them, and D1 reports them in `v_site_unregistered_daily` until the product is registered — registering it then counts the kept events with no code change. Nothing is guessed onto another product.
- iOS / Android / web are platforms of one product: store links resolve to the product registered for that Apple ID, Google Play package or web host (`target` tells the store).

### Campaign values

Read from the address of the page the event is sent from:

| Dimension | Value |
|---|---|
| `source` | `utm_source` ‖ `src` |
| `medium` | `utm_medium` ‖ `med` |
| `campaign` | `utm_campaign` ‖ `cmp` |
| `content` | `utm_content` ‖ `cnt` |

Campaign values are never stored in cookies, `localStorage` or `sessionStorage`. They are therefore attached only to events sent from the landing page that carried them (its page view, clicks and engagement); after an internal navigation the next page has no campaign. This is intentional.

## Stored fields and data point layout

Every accepted event is written as one data point. **This layout is fixed; queries depend on it. Never reorder — only append new blobs at the end.**

| Analytics Engine column | Field | Allowed values |
|---|---|---|
| `index1` | `event` | the six events above |
| `blob1` | `event` | the six events above |
| `blob2` | `page_path` | a canonical site path — the top page, `/<section>/` or `/<section>/privacy/`, `terms/`, `support/`, optionally after `/ja/` (`/`, `/ja/`, `/arrvd/`, `/ja/arrvd/terms/`, …); anything else is stored as `other` |
| `blob3` | `lang` | `en`, `ja` or empty |
| `blob4` | `product` | `site` or a product_id-shaped token (lower-case letter, then up to 31 lower-case letters, digits or `_`): registered products (`arrvd`, `mojitsunagi`, `celestial_oracle`, …) or a not-yet-registered section |
| `blob5` | `target` | `product_page`, `app_store`, `play_store`, `web_app` or empty |
| `blob6` | `source` | campaign token or empty |
| `blob7` | `medium` | campaign token or empty |
| `blob8` | `campaign` | campaign token or empty |
| `blob9` | `content` | campaign token or empty |

No `doubles` are written; every data point represents one event.

### Collector validation

- `POST` only (`405` otherwise); request body at most 4 KB (`413`), enforced while reading the stream, so an oversized body without `Content-Length` is cut off too.
- The `Origin` header must be exactly `https://futodama.app`; requests without it or with another origin are refused (`403`). Browsers always send `Origin` on these POSTs. This keeps out casual cross-site and header-less requests, but it is **not** authentication — see [Abuse and limits](#abuse-and-limits).
- Body must be a JSON object. Only the nine fields above are read; any other field is ignored and can never be stored.
- `event` and `target` must be in their allowlists and `product` must be `site` or a product_id-shaped token of at most 32 characters (longer values are refused, not truncated); `target` must match the event (`product_interest` → `product_page` with a non-`site` product; `outbound_cta` → `app_store`, `play_store` or `web_app`; all other events → empty). Otherwise `400` and nothing is written. Whether a product is registered is decided downstream (D1 views), so a new product page is never dropped here.
- All strings have control characters removed and are length-limited. `page_path` must match the canonical path pattern (else `other`); campaign values must be URL-safe tokens of at most 64 characters (`A–Z a–z 0–9 . _ ~ -`), otherwise they are stored empty — so values containing `@`, spaces or free text are dropped.
- The collector does not log requests.
- Every response carries `X-Analytics-Status` (no request data in it):

  | Value | Meaning |
  |---|---|
  | `stored` | Data point handed to Analytics Engine (`204`) |
  | `skipped` | Not the production host — intentionally not recorded (`204`) |
  | `unavailable` | `SITE_ANALYTICS` binding missing in this deployment (`204`) |
  | `error` | `writeDataPoint` threw (`204`) |
  | `rejected` | Request refused (`400` / `403` / `405` / `413`) |

  `writeDataPoint` does not wait for storage, so `stored` means "accepted by the runtime"; confirm arrival with the SQL checks below.

## Abuse and limits

There is no way to authenticate an anonymous browser without identifiers, so anyone can send well-formed events to the endpoint (any client can set an `Origin` header). Consequences and mitigations:

- **Data quality, not safety, is at stake.** Forged events can only contain allowlisted values and short tokens (product, campaign); forged product tokens appear in `v_site_unregistered_daily`, never in the registered products' numbers; they cannot inject personal data, HTML or arbitrary strings, and they cannot affect the website (static assets do not go through the Function).
- **No de-duplication by design.** Each page load sends one page view and at most one of each engagement event; reloads count again, like a normal page view. Without IDs, repeated or scripted submissions cannot be de-duplicated.
- **Volume.** A normal page view causes 1–5 Function requests (page view, up to three engagement events, clicks). On the Workers Free plan, Pages Functions share the daily request allowance; if it is exhausted only `/api/analytics/event` stops (keep the Pages Functions failure mode on *fail open*).
- **Recommended (Cloudflare dashboard, optional):** a rate-limiting rule for `POST /api/analytics/event` (for example 30 requests / 10 s per IP → block for 10 s). This runs at the edge and stores nothing in the dataset.
- **Detection:** use the per-minute spike query below; treat sudden bursts with a single `page_path` and no campaign as suspect.

## Operational rule for campaign links

Campaign values are stored verbatim (when they are short URL-safe tokens). Never put anything that identifies a person into `utm_*` / `src·med·cmp·cnt` values — no email addresses, customer numbers, recipient IDs or per-person codes. Use shared labels such as `utm_source=x&utm_campaign=launch_2026`.

## Privacy model

Never collected or stored: user ID, session ID, UUIDs, email addresses, IP address, User-Agent, fingerprints, cookie values, IDs from `localStorage` / `sessionStorage`, full query strings, form input or any other free-form text.

Because there is no identifier, events from different page views cannot be linked to one person. **There is no person-level funnel and no cross-page journey per visitor — this is the specification, not a defect.** All funnel figures below are ratios between aggregate counts.

The Privacy Policy (`/privacy/`, `/ja/privacy/`) describes this processing.

## Sampling and counting

Analytics Engine may sample data at write and query time. Each row carries `_sample_interval`, the number of events it stands for. **Always count with `SUM(_sample_interval)`, not `COUNT()`.**

## Retention

Analytics Engine keeps raw data points for **3 months**. Export or summarise anything that needs to be kept longer.

## KPIs

All rates are computed per period, and can be split by `lang` (`blob3`), `product` (`blob4`) and campaign (`blob6`–`blob9`).

| KPI | Definition |
|---|---|
| **Product Interest Rate** (product X) | `product_interest` with product = X ÷ `site_page_view` on pages that are **not** product X (the pages from which interest in X can be shown). Site-wide: all `product_interest` ÷ all `site_page_view`. |
| **60s Engagement Rate** (product X) | `engagement_60s` with product = X ÷ `site_page_view` with product = X |
| **Outbound CTA Rate** (product X) | `outbound_cta` with product = X ÷ `site_page_view` with product = X |
| **Campaign Product Interest Rate** | per campaign: `product_interest` ÷ `site_page_view` (both with the same `blob6`–`blob9`) |

15 s and 180 s engagement rates follow the 60 s definition. Note that an `outbound_cta` can also come from Home (for example the App Store badge on a product card); the per-product rate uses the product page views as denominator by definition.

### Example queries (Analytics Engine SQL API)

```sql
-- Events per type, last 7 days
SELECT blob1 AS event, SUM(_sample_interval) AS events
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY event
ORDER BY events DESC;

-- Per product: page views, 60 s engagement and outbound CTAs, last 28 days
SELECT
  blob4 AS product,
  SUM(IF(blob1 = 'site_page_view', _sample_interval, 0))  AS page_views,
  SUM(IF(blob1 = 'engagement_60s', _sample_interval, 0))  AS engaged_60s,
  SUM(IF(blob1 = 'outbound_cta',   _sample_interval, 0))  AS outbound_cta
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '28' DAY
GROUP BY product;

-- Product interest by destination product and language
SELECT blob4 AS product, blob3 AS lang, SUM(_sample_interval) AS interest
FROM futodama_site_events
WHERE blob1 = 'product_interest' AND timestamp > NOW() - INTERVAL '28' DAY
GROUP BY product, lang;

-- Campaign Product Interest Rate inputs
SELECT
  blob6 AS source, blob7 AS medium, blob8 AS campaign, blob9 AS content,
  SUM(IF(blob1 = 'site_page_view',   _sample_interval, 0)) AS page_views,
  SUM(IF(blob1 = 'product_interest', _sample_interval, 0)) AS product_interest
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '28' DAY AND (blob6 != '' OR blob8 != '')
GROUP BY source, medium, campaign, content
ORDER BY page_views DESC;
```

Divide in the reporting layer (or wrap these in an outer query) to get the rates.

## Out of scope / later

- **GA4, Google Tag Manager, the Google tag, new cookies or a consent banner are not used.** GA4 would only be considered in a separate phase, if session- or path-level analysis turns out to be necessary, and then only with Basic Consent Mode.
- **App Store campaign links.** App Store links currently use the plain product URL. Once official Campaign Links (provider token `pt`, campaign token `ct`) are issued in App Store Connect, they can replace the link URLs in the HTML as a separate change; the `outbound_cta` attribution keys on the app ID in the path, so it keeps working.

## Deployment, verification and rollback

The site deploys through the Cloudflare Pages GitHub integration: a push to `main` builds and publishes production (`futodama.app`); other branches only get preview deployments, which never record events.

### Before the first production deploy

1. Cloudflare dashboard → Workers & Pages → `futodama-website` → Settings → Bindings: **Analytics Engine** binding `SITE_ANALYTICS` → dataset `futodama_site_events`, in the **Production** environment. Bindings only apply to deployments created after they were added.
2. Pages Functions failure mode on the Free plan: keep *fail open*.

### Right after deploying

1. Open `https://futodama.app/` in a normal browser window. In DevTools → Network, the `POST /api/analytics/event` request must answer `204` with `X-Analytics-Status: stored`.
   - `unavailable` → the binding is not active in this deployment (check step 1 above, then redeploy).
   - `error` → the runtime refused the write; check the Functions real-time logs of the deployment.
   - `skipped` → you are not on `futodama.app` (preview URL).
   - No request at all → the page is not on `futodama.app`, the browser is automated, or `script.js` failed (Console).
2. Wait a few minutes, then confirm arrival with the SQL API:

```sql
-- Rows in the last hour, by event (sampling-aware)
SELECT blob1 AS event, SUM(_sample_interval) AS events
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '1' HOUR
GROUP BY event;

-- Layout sanity check: every stored value should be from the allowlists
SELECT blob1 AS event, blob2 AS page_path, blob3 AS lang, blob4 AS product, blob5 AS target, SUM(_sample_interval) AS events
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '1' DAY
GROUP BY event, page_path, lang, product, target
ORDER BY events DESC;

-- Campaign values seen (check for anything that looks personal)
SELECT blob6 AS source, blob7 AS medium, blob8 AS campaign, blob9 AS content, SUM(_sample_interval) AS events
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '7' DAY AND (blob6 != '' OR blob7 != '' OR blob8 != '' OR blob9 != '')
GROUP BY source, medium, campaign, content
ORDER BY events DESC;

-- Per-minute volume (spikes / abuse)
SELECT toStartOfInterval(timestamp, INTERVAL '1' MINUTE) AS minute, SUM(_sample_interval) AS events
FROM futodama_site_events
WHERE timestamp > NOW() - INTERVAL '1' DAY
GROUP BY minute
ORDER BY events DESC
LIMIT 20;
```

Expected shape: `site_page_view` ≥ `engagement_15s` ≥ `engagement_60s` ≥ `engagement_180s`. Compare the daily `site_page_view` total with Cloudflare Web Analytics page views: it should be the same order of magnitude (it will be lower — automated browsers are excluded and blocked scripts send nothing).

### Rollback

Pick the lightest step that solves the problem:

1. **Stop storing, keep everything else:** remove the `SITE_ANALYTICS` binding (Settings → Bindings) and redeploy. The endpoint then answers `204 unavailable` and writes nothing; the site is unaffected.
2. **Return to the previous site instantly:** Workers & Pages → `futodama-website` → Deployments → the last deployment before this change → *Rollback to this deployment*. No Git change needed.
3. **Remove the change from the code:** `git revert <merge commit>` on `main`, push; Pages redeploys without the Function and the client script. Revert the Privacy Policy wording in the same step only if the measurement is being discontinued.

Data already stored cannot be deleted selectively; it expires after 3 months.

## Repository files on the website

The Pages project publishes the repository root, so `_redirects` sends `/README.md`, `/docs/*` and `/functions/*` to `/` (`302`): this document and the brand guidelines are kept in Git but are not served on futodama.app.
