# futodama website

Official website for futodama.

Production:
https://futodama.app

Hosting:
Cloudflare Pages

Repository:
futodama-dev/futodama-website

## Brand Guidelines

The canonical futodama brand guidelines are maintained at:

`docs/brand/Futodama_Brand_Guidelines_1.3.md`

## Publishing

A push to `main` deploys production (Cloudflare Pages); other branches deploy previews. Before committing:

```
node tools/asset-version.mjs --write   # content-hash ?v= for style.css / script.js in every page
node --test tests/*.test.mjs
```

`style.css` and `script.js` are cached by browsers for 4 hours on futodama.app, so every page links them as
`style.css?v=<hash>` / `script.js?v=<hash>` (first 10 hex characters of the file's SHA-256, LF line
endings). The version changes only when the file's content changes; `tests/asset-version.test.mjs` fails
if a page links an outdated version. Rules for coding agents, including production QA checks: `CLAUDE.md`.
