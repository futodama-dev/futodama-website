# futodama-website — rules for coding agents

Static site on Cloudflare Pages: a push to `main` deploys https://futodama.app; any other branch deploys a
preview at `https://<branch>.futodama-website.pages.dev` (served with `x-robots-tag: noindex`).

## Before every commit

```powershell
node tools/asset-version.mjs --write   # after any change to style.css or script.js (incl. registry site-config)
node --test tests/*.test.mjs           # must pass; never disable or loosen a test to make it pass
```

The product block in `script.js` is generated: change it only with
`npm run registry -- site-config --site <this checkout> --write` in futodama-analytics, then run the two
commands above. Never merge or push to `main`, and never deploy, without the owner's explicit approval.

## Production checks (https://futodama.app) — keep QA out of the real numbers

`script.js` sends anonymous events (page views, engagement after 15 s / 60 s / 180 s visible, product and
store clicks) from futodama.app only. Reports exclude campaigns that start with `qa_`. The in-app browser is
**not** flagged as automated, so an untagged visit counts as a real visitor.

1. **Check without JavaScript first.** Status codes, response headers and HTML: use `fetch()` from an
   already-open futodama.app page (e.g. `/robots.txt`, which runs no script), or a non-browser HTTP client.
   Fetching a page runs none of its scripts and sends no event.
2. **When a page must render in a browser, always open it with a QA campaign:**
   `https://futodama.app/<path>?utm_campaign=qa_<purpose>` (e.g. `qa_release_check`). The campaign is read
   from the address of each page and is **not** carried to the next page: when you navigate (link click,
   language switch, menu), open the destination with `?utm_campaign=qa_<purpose>` again instead of clicking.
   Iframes need the parameter on their own URL too.
3. **Never click CTAs on production** (App Store, web app, product links) to test them. Click events are
   covered by `tests/script.test.mjs`; check the link targets by reading the HTML.
4. **Never create fake user events** in production (no scripted visits, no replayed payloads to
   `/api/analytics/event`, no edits to measured data).
5. **Close production tabs or navigate them away** to a preview or `/robots.txt` when done, so no
   engagement event follows.
6. **Verify QA exclusion in tests or on a preview**, not with production traffic: preview and local hosts
   send nothing (`tests/script.test.mjs`), and the collector stores production traffic only.

If an untagged production visit happens anyway, record its time, URL and the likely events in the
follow-up notes for the next analysis; never delete or change stored data to hide it.
