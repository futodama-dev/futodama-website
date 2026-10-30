# Home page phases — before and after the ARRVD launch

The home page (`/` and `/ja/`) has two phases. The phase is written on `<main data-home-phase="…">`
and `tests/home-phase.test.mjs` checks that both pages match it. There is no date-based or
script-based switch: the phase is changed by hand, once ARRVD is confirmed live on the App Store.

| | `prelaunch` (now) | `arrvd-live` (after the launch) |
|---|---|---|
| Order after the hero | Available now → ARRVD (Featured) | ARRVD (Featured) → Available now |
| Hero ARRVD button | Secondary (`btn-outline`), "Explore ARRVD" → `#products` | Primary (`btn-primary`), "Get ARRVD" → App Store |
| ARRVD Featured / bottom band | "Coming soon" + "Learn more about ARRVD" | App Store badge + "Learn more about ARRVD" |
| Available now | Celestial Oracle (today's card, A1) + Mojitsunagi row | unchanged |
| Other Products grid | Mojitsunagi, Celestial Oracle | unchanged |

Markers in both HTML files:

- `<!-- home-block:available-now -->` … `<!-- /home-block -->` and `<!-- home-block:arrvd -->` … `<!-- /home-block -->`:
  the two blocks whose order changes.
- `<!-- arrvd-cta:hero -->`, `<!-- arrvd-cta:featured -->`, `<!-- arrvd-cta:band -->` … `<!-- /arrvd-cta -->`:
  the three ARRVD calls to action that change.

## Switching to `arrvd-live`

Do this only after the ARRVD App Store page is live (open it and note the app id, `id1234567890`).

1. **Measurement first (futodama-analytics, separate approval).** Add ARRVD's App Store platform to the
   product registry and regenerate the generated block in `script.js`
   (`npm run registry -- site-config --site <this repo> --write`), so ARRVD App Store clicks count for
   `arrvd`. Until then they would count for the page (`site`). The test below fails without it.
2. **Both `index.html` and `ja/index.html`, in the same commit:**
   1. `<main data-home-phase="arrvd-live">`.
   2. Cut the whole `home-block:arrvd` block (markers included) and paste it above `home-block:available-now`.
   3. Replace the contents of the three `arrvd-cta` markers (keep the markers):

      ```html
      <!-- arrvd-cta:hero -->
      <a href="APP_STORE_URL" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Get ARRVD</a>
      <!-- /arrvd-cta -->

      <!-- arrvd-cta:featured --> (and arrvd-cta:band, the same markup)
      <a href="APP_STORE_URL" class="app-store-badge-link" target="_blank" rel="noopener noreferrer" aria-label="Download ARRVD on the App Store"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" alt="Download on the App Store" class="app-store-badge" width="150" height="63"></a>
      <a href="/arrvd/" class="link-arrow">Learn more about ARRVD &rarr;</a>
      <!-- /arrvd-cta -->
      ```

      Japanese page: "ARRVDを入手", `aria-label="ARRVDをApp Storeでダウンロード"`, badge `…/black/ja-jp?size=250x83`,
      `alt="App Storeからダウンロード"`, link `/ja/arrvd/` "ARRVDを詳しく見る &rarr;".
3. `node --test tests/*.mjs` — all tests must pass.
4. Check `/` and `/ja/` at 1280 px, 375 px and 320 px.

The ARRVD product pages (`/arrvd/`, `/ja/arrvd/`) and the ARRVD Featured copy ("Coming soon" wording elsewhere)
are separate edits for the launch and are not covered here.
