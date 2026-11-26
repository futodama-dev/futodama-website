# ARRVD pages — before and after the App Store launch

ARRVD is futodama's flagship. From before its App Store launch, the home page (`/` and `/ja/`) leads with
ARRVD, and the order of the page never changes with the launch. The launch changes only the ARRVD calls to
action, on four pages at once: the two home pages and the two ARRVD product pages (`/arrvd/`, `/ja/arrvd/`).

The phase is written on `<main>` — `data-home-phase="…"` on the home pages, `data-arrvd-phase="…"` on the
ARRVD pages — and `tests/home-phase.test.mjs` checks that all four match it. There is no date-based or
script-based switch: the phase is changed by hand, once ARRVD is confirmed live on the App Store.

## Home page order (every phase)

| # | Section (`<section id>`) | Content |
|---|---|---|
| 1 | `arrvd` | ARRVD hero: headline, what ARRVD does, the ARRVD call to action, the app's home screen |
| 2 | `arrvd-values` | Three values (arrivals, the notices that matter, privacy without constant tracking) and the Activity screen |
| 3 | `how-it-works` | Register places → set the expected arrival → arrivals or a "not yet confirmed" notice |
| 4 | `arrvd-privacy` | How location is used, consent and ages, who it's for, limits; links to the ARRVD Privacy Policy, Terms, Support and For guardians; the closing ARRVD call to action |
| 5 | `products` | More from futodama: Celestial Oracle (today's card, PDCA 2026-10-19-A1) and Mojitsunagi (App Store), plus links to both product pages (A3) |
| 6 | `about` | What futodama believes, About futodama, "All is well." |

The header has a direct ARRVD link (`.nav-arrvd`) outside the collapsible menu, so it stays visible on phones.
The footer lists ARRVD first.

## The two phases

| | `prelaunch` (now) | `arrvd-live` (after the launch) |
|---|---|---|
| Home hero (`arrvd-cta:hero`) | Primary "Explore ARRVD" → `/arrvd/` + "Preparing for release on the App Store" | Primary "Get ARRVD" → App Store |
| Home closing (`arrvd-cta:closing`) | "Learn more about ARRVD →" + status | App Store badge + "Learn more about ARRVD →" |
| ARRVD page hero (`arrvd-cta:lp-hero`) | Status | App Store badge |
| ARRVD page FAQ "Is ARRVD available yet?" (`arrvd-cta:lp-faq`) | "Not yet…" | "Yes…" + App Store link |
| ARRVD page closing (`arrvd-cta:lp-closing`) | "Preparing for release" + status | "Get ARRVD" + App Store badge |

Each marker is `<!-- arrvd-cta:NAME -->` … `<!-- /arrvd-cta -->`; the switch replaces only what is between them.
No App Store id or URL is written anywhere before the App Store page is live.

## Switching to `arrvd-live`

Do this only after the ARRVD App Store page is live: open it in the App Store (JP and MY storefronts) and copy
its URL and app id from that page — never from an email, a draft or memory.

Use the storefront URLs, not the country-less one: ARRVD is sold only in Japan and Malaysia, and
`https://apps.apple.com/app/arrvd/id<APP_ID>` (US storefront) returns 404 in a browser. `APP_STORE_URL` below is
`https://apps.apple.com/jp/app/arrvd/id<APP_ID>` on the Japanese pages and
`https://apps.apple.com/my/app/arrvd/id<APP_ID>` on the English pages (same app id; the iPhone App Store opens
the visitor's own storefront either way). Confirmed live on 2026-11-26: id `6813303271` on both storefronts.

1. **Measurement first (futodama-analytics, separate approval).** Add ARRVD's App Store platform to the
   product registry and regenerate the generated block in `script.js`
   (`npm run registry -- site-config --site <this repo> --write`), so ARRVD App Store clicks count for
   `arrvd`. Until then they would count for the page (`site`). Never edit the generated block by hand.
   The test below fails without it.
2. **All four pages, in the same commit:**
   1. `index.html`, `ja/index.html`: `<main id="main" data-home-phase="arrvd-live">`.
      `arrvd/index.html`, `ja/arrvd/index.html`: `<main id="main" data-arrvd-phase="arrvd-live">`.
   2. Replace the contents of the markers (keep the markers). English:

      ```html
      <!-- arrvd-cta:hero -->
      <a href="APP_STORE_URL" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Get ARRVD</a>
      <!-- /arrvd-cta -->

      <!-- arrvd-cta:closing -->
      <a href="APP_STORE_URL" class="app-store-badge-link" target="_blank" rel="noopener noreferrer" aria-label="Download ARRVD on the App Store"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" class="app-store-badge" width="160" height="53"></a>
      <a href="/arrvd/" class="link-arrow">Learn more about ARRVD &rarr;</a>
      <!-- /arrvd-cta -->

      <!-- arrvd-cta:lp-hero -->
      <a href="APP_STORE_URL" class="app-store-badge-link" target="_blank" rel="noopener noreferrer" aria-label="Download ARRVD on the App Store"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" class="app-store-badge" width="160" height="53"></a>
      <!-- /arrvd-cta -->

      <!-- arrvd-cta:lp-faq -->
      <p>Yes. ARRVD is available on the App Store for iPhone. <a href="APP_STORE_URL" target="_blank" rel="noopener noreferrer">Open ARRVD on the App Store</a>.</p>
      <!-- /arrvd-cta -->

      <!-- arrvd-cta:lp-closing -->
      <h2>Get ARRVD</h2>
      <p>ARRVD is available on the App Store for iPhone.</p>
      <a href="APP_STORE_URL" class="app-store-badge-link" target="_blank" rel="noopener noreferrer" aria-label="Download ARRVD on the App Store"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" class="app-store-badge" width="160" height="53"></a>
      <!-- /arrvd-cta -->
      ```

      Japanese pages: "ARRVDを入手", `aria-label="ARRVDをApp Storeでダウンロード"`, badge `…/black/ja-jp?size=250x83`,
      `alt="App Storeからダウンロード"`, link `/ja/arrvd/` "ARRVDを詳しく見る &rarr;",
      FAQ「はい。ARRVDはiPhone向けにApp Storeで配信中です。<a …>App Storeで見る</a>」,
      closing 見出し「ARRVDを入手」・本文「ARRVDはiPhone向けにApp Storeで配信中です。」.
3. Read the four pages once more for any other pre-launch wording ("preparing for release", 「リリース準備中」).
4. `node --test tests/*.test.mjs` — all tests must pass.
5. Check `/`, `/ja/`, `/arrvd/` and `/ja/arrvd/` at 1280 px, 375 px and 320 px, and that the App Store links open
   the ARRVD page.

## Facts the copy relies on

The ARRVD copy on these pages restates the published ARRVD Privacy Policy, Terms of Use and Support pages
(`tests/arrvd-copy.test.mjs` checks the key facts and banned promises). If one of these changes — for
example a new country of residence, a paid plan going on sale, or Android — update the home and ARRVD pages
in the same release:

- iPhone app; serves people who live in Malaysia and Japan; has a free plan (ARRVD Plus once offered).
- Organizers 18 or over, Members 13 or over (no one under 13); Members aged 13–17 share nothing until a
  guardian and the Member have both agreed.
- Location is used on the Member's iPhone (iOS Location Services, region monitoring; "Always" for the
  background) to detect arrivals at and departures from registered places; no live location, no movement
  history.
- Organizers are notified of arrivals, departures (when turned on for the place) and arrivals not confirmed
  by the expected time; records are deleted after 7 days.
- Detection is not guaranteed; ARRVD isn't an emergency service.

The app screens (`assets/brand/arrvd/screens/`) are the App Store screenshots' app screens (Build 112 screen
code, sample names), cropped and resized. Replace them when the app's home or Activity screens change.
