# Futodama Logo Assets

Canonical logo specification:

- Dot: 12px reference diameter
- Gap: 8px
- Wordmark: futodama
- Weight: 600
- Dot color: #3B82C4
- Wordmark color: #1F2A37

This specification is defined in [`docs/brand/Futodama_Brand_Guidelines_1.0.md`](../../../docs/brand/Futodama_Brand_Guidelines_1.0.md), §9 "Official Logo Specification".

## Files

- `futodama-logo.svg` — full logo (dot + wordmark), brand colors, transparent background
- `futodama-logo-dark.svg` — full logo, monochrome dark (Deep Navy) version
- `futodama-logo-reversed.svg` — full logo, white version for dark backgrounds
- `futodama-symbol.svg` — Simple Dot symbol only, brand blue
- `futodama-symbol-dark.svg` — Simple Dot symbol only, Deep Navy
- `futodama-symbol-reversed.svg` — Simple Dot symbol only, white for dark backgrounds

## Wordmark implementation note

The official full-logo SVG assets use outlined vector paths for the wordmark. They do not depend on locally installed fonts.

The wordmark typeface is Inter SemiBold (600), licensed under the SIL Open Font License 1.1, which permits converting the typeface to outlines for use in a logo. No font file is included in this repository, and none is distributed to end users — only the resulting vector outlines are shipped, embedded directly in the SVG path data.

This is separate from Web UI typography, which continues to use the system font stack defined in the Brand Guidelines (§18–§19) and is unaffected by this rule.

## Usage

- Full logo (`futodama-logo.svg`) for headers, documents, presentations.
- Symbol only (`futodama-symbol*.svg`) for favicon, small icons, and compact spaces.
- Reversed logo/symbol for dark backgrounds (e.g. Deep Navy).
- Dark/monochrome logo/symbol where a restrained, single-color mark is needed on a light background.

## Do not

- Stretch the logo or change its aspect ratio.
- Recolor it arbitrarily.
- Add a shadow.
- Add a gradient.
- Alter the dot size, gap, or letter spacing.
- Add extra dots or shapes.

See the Brand Guidelines for the full Clear Space and Minimum Size rules.
