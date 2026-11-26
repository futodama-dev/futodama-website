# ARRVD pages — before and after the App Store launch

ARRVD is futodama's flagship. Since before its App Store launch, the home page (`/` and `/ja/`) leads with
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

The pages are in `arrvd-live` since ARRVD went on sale on 2026-11-26 (App Store id `6813303271`, JP and MY).

| | `prelaunch` (until 2026-11-26) | `arrvd-live` (now) |
|---|---|---|
| Home hero (`arrvd-cta:hero`) | Primary "Explore ARRVD" → `/arrvd/` + "Preparing for release on the App Store" | Apple's App Store badge + "Free · iPhone · Japan and Malaysia" |
| Home closing (`arrvd-cta:closing`) | "Learn more about ARRVD →" + status | Button "Download on the App Store" / 「App Storeで入手」 + "Learn more about ARRVD →" |
| ARRVD page hero (`arrvd-cta:lp-hero`) | Status | Apple's App Store badge + "Free · iPhone (iOS 15 or later) · Japan and Malaysia" |
| ARRVD page FAQ "Is ARRVD available yet?" (`arrvd-cta:lp-faq`) | "Not yet…" | "Yes…" + App Store link |
| ARRVD page closing (`arrvd-cta:lp-closing`) | "Preparing for release" + status | "Get ARRVD" + button "Download on the App Store" / 「App Storeで入手」 |

Each marker is `<!-- arrvd-cta:NAME -->` … `<!-- /arrvd-cta -->`; a switch replaces only what is between them.

Rules the tests check (`tests/home-phase.test.mjs`):

- **One App Store badge per page** (Apple's App Store marketing guidelines: "Use one App Store badge per layout"),
  Apple's own artwork in the page's language, unmodified, shown at one height (53 px) in both languages.
  Other App Store links on the same page are text — including Mojitsunagi's on the home page.
- **Storefront URLs**: ARRVD is sold only in Japan and Malaysia, and the country-less
  `https://apps.apple.com/app/arrvd/id6813303271` (US storefront) is a 404. Japanese pages link
  `https://apps.apple.com/jp/app/arrvd/id6813303271`, English pages `https://apps.apple.com/my/app/arrvd/id6813303271`
  (same app id; the iPhone App Store opens the visitor's own storefront either way).
- **Registry first**: ARRVD's App Store id must be in the generated registry block of `script.js`, so App Store
  clicks count for `arrvd` (`outbound_cta`, target `app_store`). The block is written only by
  `npm run registry -- site-config --site <this repo> --write` from the production registry; never by hand.

## Before this goes to production

1. **Registry (futodama-analytics, production D1 — needs the owner's approval).** Dry run checked on 2026-11-26:

   ```
   npm run registry -- link app_store 6813303271 --product arrvd --platform ios --release-date 2026-11-26 \
     --bundle-id com.futodama.arrvd --store-url https://apps.apple.com/jp/app/arrvd/id6813303271 \
     --sources asc_sales,asc_analytics --apply
   npm run registry -- site-config --site ../futodama-website --write    # adds "app_store:6813303271":"arrvd"
   npm run registry -- check-site --site ../futodama-website             # must report 0 errors
   ```

   It also starts the daily ARRVD download import from the App Store sales reports (first-time downloads and
   redownloads by country). Rollback: `npm run registry -- set-status arrvd:ios retired`, then `site-config --write`.
2. Commit the regenerated `script.js` on this branch; `node --test tests/*.test.mjs` must pass with no failures.
3. Check `/`, `/ja/`, `/arrvd/` and `/ja/arrvd/` at 1280 px, 375 px and 320 px, and that the App Store links open
   the ARRVD page.

Until step 1 is done, `tests/home-phase.test.mjs` fails with "register ARRVD's App Store app first" — on purpose.

## Switching back to `prelaunch`

Not expected. If ARRVD is ever removed from sale, restore the `prelaunch` contents of the five markers from Git
history (`git show 1c6fe85:index.html` etc.) and set both phase attributes back.

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
