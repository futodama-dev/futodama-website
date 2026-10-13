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

The binding is configured in the Cloudflare Pages project (Settings → Functions → Analytics Engine bindings), not in code. If the binding is missing, the collector still answers `204` and writes nothing.

Only the production host `futodama.app` records events. The browser script does nothing on any other host (preview `*.pages.dev`, `localhost`, `127.0.0.1`), and the Function stores nothing for requests whose hostname is not `futodama.app`.

## Event dictionary

| Event | When | `product` | `target` |
|---|---|---|---|
| `site_page_view` | Once per page load | Product of the current page | *(empty)* |
| `product_interest` | Click on an internal link to another product's main page (`/arrvd/`, `/mojitsunagi/`, `/celestial-oracle/`, or the `/ja/` equivalent, without a `#fragment`) | Product of the **destination** | `product_page` |
| `outbound_cta` | Click on an App Store link | Product of the App Store app (by app ID; falls back to the current page's product) | `app_store` |
| `outbound_cta` | Click on a `celestial.futodama.app` link | `celestial_oracle` | `web_app` |
| `engagement_15s` | The page has been **visible** for 15 s in total | Product of the current page | *(empty)* |
| `engagement_60s` | … 60 s in total | Product of the current page | *(empty)* |
| `engagement_180s` | … 180 s in total | Product of the current page | *(empty)* |

Notes:

- Engagement counts only time with `document.visibilityState === "visible"`; time in a background tab does not count. Each threshold is sent at most once per page load.
- `product_interest` is not sent when the destination is the same product as the current page (for example the language switch or ARRVD's own legal pages), nor for links to a product's `#legal` section.
- Invitation pages (`/arrvd/invite/…`) send no events at all.
- Clicks are sent with `fetch(…, { keepalive: true, credentials: "omit" })`, so they never delay or block navigation and never carry cookies.

### Product values

`arrvd` · `mojitsunagi` · `celestial_oracle` · `site` (everything that is not a product section: Home, About, Support, Privacy, Terms, Legal).

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
| `blob2` | `page_path` | a canonical site path (`/`, `/ja/`, `/arrvd/`, `/ja/arrvd/terms/`, …); anything else is stored as `other` |
| `blob3` | `lang` | `en`, `ja` or empty |
| `blob4` | `product` | `arrvd`, `mojitsunagi`, `celestial_oracle`, `site` |
| `blob5` | `target` | `product_page`, `app_store`, `web_app` or empty |
| `blob6` | `source` | campaign token or empty |
| `blob7` | `medium` | campaign token or empty |
| `blob8` | `campaign` | campaign token or empty |
| `blob9` | `content` | campaign token or empty |

No `doubles` are written; every data point represents one event.

### Collector validation

- `POST` only (`405` otherwise); request body at most 4 KB (`413`).
- Requests with an `Origin` header other than `https://futodama.app` are refused (`403`).
- Body must be a JSON object. Only the nine fields above are read; any other field is ignored and can never be stored.
- `event`, `product` and `target` must be in their allowlists, and `target` must match the event (`product_interest` → `product_page` with a non-`site` product; `outbound_cta` → `app_store` or `web_app`; all other events → empty). Otherwise `400` and nothing is written.
- All strings have control characters removed and are length-limited. `page_path` must match the canonical path pattern (else `other`); campaign values must be URL-safe tokens of at most 64 characters (`A–Z a–z 0–9 . _ ~ -`), otherwise they are stored empty — so values containing `@`, spaces or free text are dropped.
- The collector does not log requests.

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

## Setup checklist (before the first production deploy)

1. Cloudflare dashboard → Workers & Pages → the futodama-website Pages project → Settings → Functions → **Analytics Engine bindings**: add variable name `SITE_ANALYTICS`, dataset `futodama_site_events` (Production environment).
2. Deploy, then confirm that a production page view produces a row:
   `SELECT COUNT() FROM futodama_site_events WHERE timestamp > NOW() - INTERVAL '1' HOUR`.
