# Futodama Brand Guidelines 1.3

Version: 1.3
Status: Current canonical brand guideline
Brand: futodama
Primary domain: https://futodama.app
Established: 2026
Canonicalized: 2026-09-24

This document is the current official standard for futodama's design, writing, and brand expression. It applies to the website, apps, App Store materials, social media, press materials, B2B materials, and future internal and external production work.

---

## 1. Brand Core

**Brand name:** futodama

The brand name is written in lowercase as a general rule.

**Primary Brand Idea:**

> Small ideas. Better everyday moments.

**Japanese Brand Expression:**

> 毎日を、少し安心に。
> 少し楽しく。
> 少し軽やかに。

**Brand Spirit:**

> All is well.

"All is well." is not a marketing tagline to be used heavily on the top page. It is a quiet phrase that underpins futodama's philosophy, and is used sparingly — in About sections, footers, and brand storytelling.

---

## 2. Purpose

**Purpose (JA):**

日常を、少し良くする。

日常にある小さな不便、不安、楽しみ、気づきを見つけ、それを人の生活を少し良くするプロダクトへ変える。

**Purpose (EN):**

Make everyday life a little better.

futodama finds small moments of friction, worry, joy, and discovery in everyday life and turns them into thoughtful digital products.

---

## 3. Mission

**Mission (JA):**

人の気持ちに寄り添う、シンプルなデジタル体験をつくる。

便利なだけではなく、使ったあとに少し安心したり、少し楽しくなったり、少し気持ちが軽くなるものをつくる。

**Mission (EN):**

Create simple digital experiences designed around people.

Products should not only be useful. They should leave people feeling a little more reassured, a little happier, or a little lighter.

---

## 4. Vision

**Vision (JA):**

「あってよかった」と思われる存在になる。

規模だけを目標にせず、一人ひとりに価値を届けた結果として、世界で信頼されるプロダクトブランドへ成長する。

**Vision (EN):**

Become a brand people are glad exists.

Growth should be the result of creating products that genuinely make everyday moments better.

---

## 5. Brand Values

The official values, in order:

1. Reassurance
2. Joy
3. Empathy
4. Kindness
5. Simplicity
6. Lightness
7. Gratitude
8. Positive

### Reassurance
不安を煽るのではなく、安心を届ける。

### Joy
使う人にも、つくる人にも、小さな喜びがあること。

### Empathy
機能より先に、人の立場や気持ちを考える。

### Kindness
使う人を急かしたり、責めたり、必要以上に監視したりしない。

### Simplicity
機能を増やすことより、わかりやすくすることを優先する。

### Lightness
テクノロジーによって生活を重くしない。

### Gratitude
使ってくれる人、協力してくれる人への感謝を忘れない。

### Positive
前向きであること。ただし根拠のない楽観や誇張表現は避ける。

---

## 6. Brand Personality

**Brand Personality: Professional × Human**

- 信頼できるが、冷たくない
- 親しみがあるが、子どもっぽくない
- ポジティブだが、軽薄ではない
- シンプルだが、無機質ではない
- 現代的だが、流行だけを追わない

---

## 7. Logo — Official Direction

**Official logo direction: A案 "Simple Dot"**

Basic construction:

```
● futodama
```

A simple blue circle combined with a lowercase `futodama` wordmark. The exact, finalized specification is defined in [§9 Official Logo Specification](#9-official-logo-specification).

---

## 8. Simple Dot Concept

Simple Dot abstractly represents:

- small idea
- beginning
- moment
- connection
- possibility
- simplicity
- futodamaの「玉」(tama / ball)

It must not carry meaning so complex that it requires explanation to be understood. As a symbol it should remain simple and easy to use worldwide.

---

## 9. Official Logo Specification

The following values are the finalized, official specification for the Simple Dot logo, confirmed through direct real-browser comparison (Desktop and Mobile) and superseding all earlier provisional values.

**Basic form:**

```
● futodama
```

| Property | Value |
|---|---|
| Visible dot diameter | 26px (reference size) |
| Gap (dot to wordmark) | 6px |
| Wordmark | `futodama` |
| Official wordmark typeface | Inter SemiBold |
| Wordmark weight | 600 |
| Dot color | `#3B82C4` |
| Wordmark color | `#1F2A37` |
| Vertical alignment | Center |

**Official wordmark typeface:** Inter SemiBold (600). This is separate from the Web UI typography system in §19 English Font Stack. The logo wordmark is a fixed brand asset and must render identically in every environment, so it is not left to whatever font a given system happens to have installed — that is a different concern from body/UI text, which intentionally uses the system font stack for performance and stable global rendering.

**Distribution logo assets:** in the canonical SVG files (`assets/brand/logo/futodama-logo*.svg`), the wordmark is converted to outlined vector paths, not left as editable text. This means the official logo renders identically across environments and does not depend on the Inter font being installed or loaded. Web UI typography (navigation, headings, body copy) remains governed separately by the Futodama typography system in §18–§20, and is unaffected by this rule.

**SVG construction:** the dot symbol is drawn with a tight viewBox (the circle fills its full viewBox with no internal padding); visible clear space around the logo is controlled by CSS/layout (see §10 Clear Space), not baked into the SVG's own geometry. This construction was adopted specifically to prevent a padded-viewBox SVG from rendering its visible circle smaller than the element's declared box size.

**Rules:**

- Lowercase only.
- The dot and wordmark are treated as a single, inseparable unit.
- Visible dot diameter is 26px at reference scale.
- Gap between dot and wordmark is 6px.
- Wordmark weight is 600.
- Dot color is `#3B82C4`.
- Wordmark color is `#1F2A37`.
- Vertical alignment is center.
- No shadow.
- No gradient.
- No multiple dots.
- No change to the dot's shape.
- No arbitrary change to the wordmark's letter spacing.
- No change to the overall logo aspect ratio.

**Why these values:**

- 26px was confirmed, by directly comparing Desktop and Mobile rendering in a real browser, to be the best-balanced visible dot size.
- 6px was confirmed, through the same real-browser comparison process, to be the optimal gap between dot and wordmark.
- Inter SemiBold, weight 600, was reconfirmed as the most suitable typeface and weight; no change was needed.
- Real-browser comparison showed no vertical correction was needed, so center alignment is formally adopted as-is.
- These values were decided by prioritizing real-browser visual comparison over any numeric value assumed in advance. See [§14 Golden Ratio Design Principle](#14-golden-ratio-design-principle) for how this decision relates to, but was not derived from, golden-ratio proportions.

---

## 10. Clear Space

Let **X** = the visible dot diameter.

Minimum clear space around the logo: **1X** on all sides (top, bottom, left, right).

At the current 26px reference size, this is a minimum of 26px of clear space around the full logo.

In practice, using more generous spacing than this minimum is recommended.

Do not place text, rules/lines, icons, or other elements directly against the logo.

---

## 11. Minimum Size

- **Web:** minimum width for the full logo (dot + wordmark) is approximately 80px.
- **Print:** minimum width is approximately 20mm.
- **Symbol only:** 16px or larger is recommended.

If the wordmark would become illegible at very small sizes, use the symbol-only mark instead.

---

## 12. Logo Variants

Officially permitted forms:

1. Simple Dot + futodama wordmark
2. Simple Dot symbol only
3. White / reversed version
4. Dark / monochrome version

Canonical SVG assets for all four variants are maintained at `assets/brand/logo/`. See [assets/brand/logo/README.md](../../assets/brand/logo/README.md).

---

## 13. Logo Prohibitions

The following are prohibited:

- Making the dot an oval
- Changing the aspect ratio
- Adding a drop shadow
- Making it 3D
- Applying a gradient
- Changing the color arbitrarily
- Using multiple dots
- Adding a leaf, star, heart, or similar shape inside the dot
- Changing the wordmark's letter spacing per page
- Rotating the logo
- Placing other elements too close to the logo
- Changing the futodama logo itself per app
- Changing the visible dot diameter from the official 26px reference
- Changing the gap from the official 6px
- Changing the wordmark weight from 600
- Changing the dot or wordmark colors from the official values
- Finalizing any future change to these values from a generated concept image, a golden-ratio calculation, or any other non-browser source, without the real-browser/real-device verification required by [§14 Golden Ratio Design Principle](#14-golden-ratio-design-principle) and the Logo Review Rule within it

---

## 14. Golden Ratio Design Principle

### 14.1 Important caveat — read first

**The futodama logo was not reverse-engineered from the golden ratio.**

> Futodamaロゴは黄金比から逆算して決定したものではない。実ブラウザでの視覚比較により26px / 6pxを選定し、その結果としてgap/dot比が黄金比系列に近いことを確認した。黄金比は「数値を強制する公式」ではなく、視覚的調和を検証・設計するための補助原則として使用する。

**English:** The dot size (26px) and gap (6px) were selected first, through direct real-browser visual comparison on Desktop and Mobile (see §9). Only afterward was it observed that the resulting gap/dot ratio sits close to a golden-ratio-derived value. The golden ratio is not a formula that dictates numbers in advance — it is used only as a secondary, after-the-fact aid for verifying and discussing visual harmony.

### 14.2 The observation

```
φ (phi)  ≈ 1.618
1 / φ    ≈ 0.618
1 / φ²   ≈ 0.382
1 / φ³   ≈ 0.236
```

The logo's actual, real-browser-selected proportion:

```
Gap / Dot = 6 / 26 ≈ 0.231
```

`0.231` is close to `1 / φ³ ≈ 0.236`, but it is not an exact match, and no value in this document was adjusted to make it match more closely. The proximity is recorded here only as a supporting observation, not as the justification for the 26px / 6px spec — the justification is the real-browser comparison in §9.

### 14.3 Purpose of this section

Beyond the logo, golden-ratio thinking is formalized here as a **general, optional design aid** available across futodama's visual work, including:

- Web layout
- App UI
- Marketing materials
- OGP / social share images
- App Store creatives
- Presentations
- B2B documents
- Cards and sections
- Spacing and visual hierarchy
- Composition of images and layouts
- Spacing around the logo
- Typography hierarchy

It is a lens for evaluating and discussing proportion — not a mandatory formula, and not a replacement for any rule already fixed elsewhere in this document.

### 14.4 Priority order

When golden-ratio thinking is considered alongside other design concerns, this is the required priority order:

1. **Usability / actual visual quality** — how it actually looks and works, verified in a real browser or on a real device.
2. **Brand consistency** — alignment with the values, tokens, and rules already fixed in this document.
3. **Golden-ratio / proportional harmony** — used only as a secondary refinement once (1) and (2) are satisfied.
4. **Technical / platform constraints** — what the platform, framework, or format actually allows.

**Explicit meaning of this order:**

- Golden-ratio proportion must never be used to justify breaking usability, accessibility, or platform constraints.
- Real-device and real-browser verification always outranks a golden-ratio calculation. If a golden-ratio-derived value looks or behaves worse in a real browser or on a real device, the real-browser/real-device result wins.
- Golden-ratio thinking is a tie-breaker and a refinement tool, not a decision-maker on its own.

### 14.5 Permitted usage

- **Hierarchy:** when establishing relative visual weight between elements, the approximate proportions `100 : 61.8 : 38.2 : 23.6` may be used as a reference scale for relative emphasis (for example, comparing the relative prominence of a hero, a subhead, and a caption).
- **Spacing:** golden-ratio-derived relationships may inform the relative proportions between "large / medium / small" spacing steps, without replacing the fixed spacing tokens in §24 Spacing System.
- **Layout:** column splits such as `61.8% / 38.2%` may be evaluated as a *candidate* layout proportion for a given section — never adopted automatically, and always confirmed by real-browser review before use.
- **Image composition:** golden-ratio-based composition (e.g. golden spiral or golden rectangle framing) may be used as a compositional aid for original illustrations, diagrams, or marketing imagery.
- **Typography hierarchy:** golden-ratio relationships may inform how much visual weight difference should exist between heading levels, without overwriting the existing official Type Scale in §21.

### 14.6 Prohibited usage

- Do not multiply every size, spacing, or dimension in the product by 1.618 as a blanket rule.
- Do not sacrifice readability, tap target size, or mobile usability for the sake of a golden-ratio proportion.
- Do not arbitrarily change existing fixed tokens (color, spacing scale, type scale, radius, etc.) to force a golden-ratio relationship.
- Do not finalize any design decision from golden-ratio math alone, without a real-device or real-browser check.

### 14.7 Real browser / real device priority rule

Generated concept images, mockups, and calculated proportions are **reference-only**. They may be used to explore ideas and communicate intent, but they are never sufficient on their own to finalize an official value.

Any value that becomes part of this document's official specification — logo, spacing, layout, or otherwise — must be confirmed through verification in an actual browser or on an actual device before being adopted as canonical.

### 14.8 Logo Review Rule

Any future proposal to change the logo's official values (§9) must be reviewed against all of the following before it can be approved, regardless of how the new values were derived (including if derived from golden-ratio math):

- Visible size, as rendered, not as declared in a viewBox or attribute
- Rendered gap, as actually laid out
- Optical (not just mathematical) vertical alignment
- Appearance on desktop
- Appearance on mobile
- Appearance on a dark background
- Appearance on a light background
- Appearance at small sizes
- Appearance in the favicon context

Matching CSS or SVG values to a calculation, on its own, is **not sufficient approval** — the checks above must be confirmed by direct observation in a real browser or on a real device.

---

## 15. Brand Colors

Official brand colors:

| Name | Hex |
|---|---|
| Futodama Blue | `#3B82C4` |
| Futodama Green | `#6F9275` |
| Deep Navy | `#1F2A37` |
| Charcoal | `#222222` |
| Warm White | `#FAFAF8` |
| White | `#FFFFFF` |
| Joy Gold | `#D8B45B` |

---

## 16. Color Roles

- **Blue:** Trust / reassurance / primary action
- **Green:** growth / life / positive support
- **Navy:** brand text / headings / stability
- **Charcoal:** body text
- **Warm White:** main background
- **Gold:** joy / special moments / limited accent
- **Red:** not used as a brand color. Red is reserved only for meaningful UI purposes such as error / danger / warning.

---

## 17. Product Colors

The parent brand and each product are distinguished by color.

- **futodama:** Blue-centered
- **ARRVD:** Blue-centered
- **Mojitsunagi / もじつなぎ:** Green-centered
- **Celestial Oracle:** Deep Navy + Gold

The parent brand's color is not forced across every product uniformly.

---

## 18. Typography Policy

To preserve visual consistency, fonts, sizes, and weights are not added arbitrarily.

On the web, a system font stack is the baseline, prioritizing performance and stable global rendering.

---

## 19. English Font Stack

Recommended:

```
Inter,
system-ui,
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif
```

Inter is not currently loaded as a required external network dependency. The brand must hold up on system fonts alone.

---

## 20. Japanese Font Stack

Recommended:

```
"Noto Sans JP",
"Hiragino Kaku Gothic ProN",
"Yu Gothic",
"YuGothic",
Meiryo,
sans-serif
```

External web fonts are not made mandatory.

---

## 21. Type Scale

### Desktop

| Role | Size |
|---|---|
| Display / Hero | 56px |
| H1 | 40px |
| H2 | 32px |
| H3 | 24px |
| Lead | 20px |
| Body Large | 18px |
| Body | 16px |
| Small | 14px |
| Caption | 12px |

### Mobile

| Role | Size |
|---|---|
| Display / Hero | 38px |
| H1 | 32px |
| H2 | 26px |
| H3 | 20px |
| Lead | 18px |
| Body Large | 17px |
| Body | 16px |
| Small | 14px |
| Caption | 12px |

As a rule, sizes outside this scale are not introduced ad hoc. When using `clamp()`, this range is the baseline.

---

## 22. Font Weights

- **400 Regular:** body text
- **500 Medium:** navigation, labels, small emphasis
- **600 Semibold:** H3, buttons, the futodama wordmark, etc.
- **700 Bold:** Hero, H1, key headings
- **800 / 900:** not used as a rule

---

## 23. Line Height

- **Body:** 1.6–1.75
- **Heading:** approximately 1.1–1.3, depending on content

Do not cram long text too densely.

---

## 24. Spacing System

Base unit: 4px.

Official spacing scale:

```
4px
8px
12px
16px
24px
32px
48px
64px
80px
```

CSS tokens:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 80px;
```

Ad hoc spacing values such as 37px or 57px are not created as a rule.

---

## 25. Border Radius

Official values:

- **Small:** 8px
- **Medium:** 12px
- **Large:** 16px
- **Pill:** 999px

- Cards: 12–16px
- Buttons: 8–12px

Do not round corners excessively.

---

## 26. Borders

- **Normal:** 1px
- **Emphasis:** 2px
- **Icon stroke:** 1.5–2px

Do not create boundaries with excessive shadow instead of borders.

---

## 27. Buttons

There are three official button types:

- **Primary:** Blue background, white text
- **Secondary:** White / transparent background, navy border
- **Text link:** No background, blue text

Do not place a large number of Primary CTAs on one screen.

---

## 28. Cards

Cards are used to organize content. Do not turn everything into a card.

Baseline:

- White background
- Subtle 1px border
- 12–16px radius
- No shadow as a rule, or a very subtle one only

Do not lift cards excessively on hover either.

---

## 29. Icons

Baseline:

- Simple
- Line-based
- Abstract
- Stroke 1.5–2px

Emoji are not used as official UI icons.

---

## 30. Imagery

Priority order:

1. Actual product screens
2. Original diagrams / illustrations
3. Simple abstract expressions

Do not use meaningless stock photography in bulk. In particular, do not build the brand around generic "smiling family" style photography that could belong to any company.

---

## 31. Motion

Animation is supportive, not central.

- Standard duration: approximately 150–250ms
- Natural easing

Prohibited:

- Flashy scroll animation
- Constantly moving backgrounds
- Large parallax effects
- Animation unrelated to brand value

`prefers-reduced-motion` is respected.

---

## 32. Writing Voice

Brand writing should be:

Short, calm, sincere, human, positive, clear.

Do not exaggerate.

**Prohibited examples** (unsubstantiated superlatives):

- Revolutionary
- Ultimate
- Game-changing
- 100% safe
- Perfect solution

**Recommended examples:**

- Know they arrived. Not everywhere they went.
- Designed with privacy in mind.
- 必要な情報を、シンプルに。
- 「到着した」という安心を。

---

## 33. Brand Architecture

Structure:

```
futodama
├── ARRVD
├── Mojitsunagi / もじつなぎ
├── Celestial Oracle
└── Future Products
```

Each product has its own independent personality.

Relationship to the parent brand is expressed with phrases such as "Created by futodama" or "A product by futodama."

---

## 34. ARRVD Brand Signature

### 34.1 Brand signature — the core idea

**futodama:** One Dot / small idea / beginning.

**ARRVD:** The Dot has arrived. Reassurance spreads outward from that point.

> 「着いた」という一点から、安心が静かに広がる。

ARRVD's entire visual signature — the Arrival Mark and the App Icon — is built from this single idea: a small dot that has *arrived*, from which calm spreads outward.

**This must never be designed, described, or read as surveillance, tracking, radar, targeting, or a crosshair.** Any candidate that evokes those associations is rejected regardless of how visually appealing it is, per the Brand Values (§5 Reassurance, Kindness) and Brand Personality (§6 Professional × Human).

### 34.2 ARRVD Messaging

Three distinct pieces of copy serve three distinct roles. They are not interchangeable and must not be blended into one sentence:

| Role | Copy | Where it is used |
|---|---|---|
| **Product Promise** | "Know they arrived. Not everywhere they went." | Hero-level, first introduction to ARRVD |
| **Product Explanation** | "Arrival reassurance. Without continuous tracking." | Supporting explanation, e.g. Bottom CTA |
| **Brand Spirit** | "All is well." | Sparingly, in About/footer/brand storytelling — shared with the parent futodama brand (§1), not ARRVD-exclusive |

Do not merge these three into a single new sentence, and do not use the Brand Spirit line as a substitute for ARRVD's own Product Promise or Explanation.

### 34.3 Web Arrival Mark — Official Specification

The officially adopted design is **Comparison B** (concentric rings whose spacing tightens near the center dot and widens toward the outer edge), confirmed through real-browser comparison across Desktop and Mobile.

**Construction** (SVG viewBox `0 0 240 240`, center at `120, 120`):

| Element | Radius | Stroke opacity |
|---|---|---|
| Center dot (fill) | 12.5 | — (solid fill) |
| Ring 1 (innermost) | ≈29.21 | 0.5 |
| Ring 2 (middle) | ≈56.25 | 0.3 |
| Ring 3 (outermost) | 100 | 0.15 |

- The center dot keeps the already-approved 1.25× scale (radius 12.5, up from the original radius 10 — see the Brand Guidelines 1.1-era Arrival Mark work).
- Ring spacing increases from center to edge: the gap between the dot and Ring 1 is the smallest, and the gap between Ring 2 and Ring 3 is the largest. This is what reads as "reassurance spreading calmly outward" from the arrived point, rather than a mechanical, evenly-ticking pattern.
- Color: `#3B82C4` (Futodama Blue) for both the rings (stroke) and the center dot (fill). No new color is introduced for the Arrival Mark.

**Golden Ratio note:** the design goal for Comparison B was ring spacing that tightens near the center dot and widens toward the outer edge. A golden-ratio-derived series was used as a **reference while designing** that widening progression (each gap set to roughly φ times the previous one). **Formal adoption was not an automatic, formula-driven decision, however:** Comparison B was confirmed as the official Arrival Mark through direct real-browser review (Desktop and Mobile), not by the golden-ratio math alone — consistent with the golden ratio's role as a secondary design aid rather than a decision-maker, per §14.4.

**Prohibited for the Arrival Mark** (in addition to the general Logo Prohibitions in §13, where applicable):

- Radar sweep animation or motif
- Location pin shape
- Arrows
- Crosshair
- Target-style high-contrast rings
- Any new color outside the existing Futodama/ARRVD blue system
- Any element that reads as surveillance or continuous tracking

### 34.4 Small-size Arrival Mark (variant, not a separate mark)

At small sizes (as a guideline, 32px and below) the full 3-ring construction in §34.3 can lose legibility. In these cases, a **2-ring simplification** may be used:

| Element | Radius | Stroke opacity |
|---|---|---|
| Center dot (fill) | 12.5 | — (solid fill) |
| Ring (inner) | ≈45.92 | 0.4 |
| Ring (outer) | 100 | 0.2 |

This is explicitly a **small-size variant of the same Arrival Mark**, not an alternate or secondary logo. The standard web context (the ARRVD Featured Card, the ARRVD product page, and any other size ≥64px) uses the full 3-ring version from §34.3 by default. The 2-ring variant is reserved for genuinely small contexts where the 3-ring version would visually degrade.

### 34.5 ARRVD App Icon — Official Specification

#### 34.5.1 Official direction

The officially adopted App Icon design is **Icon A ("Balanced Golden")**, confirmed through real-size visual comparison against two alternative candidates (a softer/larger-dot variant and a bolder/stronger-recognition variant) and against a from-scratch small-size optical-correction pass. It consists of two locked components:

- **Master (A0):** the single official 1024×1024 asset, used at 128px and above.
- **Small-size optical correction (A1):** the *same* icon, with only ring stroke width and opacity nudged upward, used at 32px and 64px rendering contexts only.

**A1 is not a separate icon or alternate logo.** It is a small-size rendering correction of the exact same design, in the same sense that a typeface may carry small-size-specific hinting without becoming a different typeface.

#### 34.5.2 Master (A0) specification

| Property | Value |
|---|---|
| Canvas | 1024 × 1024px |
| File format | PNG, RGB, no alpha channel, no transparency |
| Background | Futodama Blue `#3B82C4`, full-bleed |
| Center dot | Warm White `#FAFAF8`, solid fill, radius 33 |
| Outer ring | radius 316, stroke width 24, stroke opacity 0.35 |
| Inner ring | radius 142, stroke width 32, stroke opacity 0.55 |
| Center alignment | Dot and both rings share the exact canvas center (512, 512) |
| Corner treatment | None baked into the artwork — the OS applies the rounded-square mask at the platform/container level |
| Shadow / glow / gradient | None |

**Geometry ratios (Golden-Ratio-informed reference):**

| Ratio | Value | φ reference |
|---|---|---|
| Mark diameter / canvas | ≈ 0.617 | 1/φ ≈ 0.618 |
| Dot diameter / inner ring diameter | ≈ 0.232 | 1/φ³ ≈ 0.236 |
| Ring gap ratio (outer−inner gap ÷ inner−dot gap) | ≈ 1.596 | φ ≈ 1.618 |

These geometry values (radii, stroke widths at A0, and the ratios above) are locked. They are not changed by the A1 optical correction (§34.5.3) and must not be changed by any future revision without going through the ARRVD Design Review Rule (§34.7).

#### 34.5.3 Small-size optical correction (A1)

Applied **only** when the icon is rendered at 32px or 64px. At 128px and above, A0 is used unchanged.

| Property | A0 (128px+) | A1 (32px / 64px only) |
|---|---|---|
| Outer ring stroke width | 24 | 27 |
| Inner ring stroke width | 32 | 36 |
| Outer ring opacity | 0.35 | 0.42 |
| Inner ring opacity | 0.55 | 0.62 |
| Center dot | Warm White solid fill, radius 33 | Unchanged (already maximum contrast; no correction was needed) |
| All radii (outer ring, inner ring, dot) | 316 / 142 / 33 | Unchanged — geometry is identical to A0 |

**Prohibited for the optical correction:**

- Changing any ring radius or the dot radius
- Changing the overall mark size relative to the canvas
- Enlarging the center dot
- Introducing any new color
- Adding a shadow, glow, or gradient
- Strengthening the strokes as far as the rejected "Strong Recognition" candidate
- Any change that increases a radar, target, or surveillance impression

The goal of A1 is narrow and specific: keep A0's quietness intact while preventing the mark from visually disappearing at the smallest real-world render sizes.

#### 34.5.4 Master asset technical requirements

- 1024×1024px, RGB, no alpha channel — verified with no transparency and no embedded ICC/alpha metadata.
- Full-bleed Futodama Blue background — no padding, no letterboxing.
- No rounded corners baked into the artwork; the platform (iOS/Android) applies its own mask shape at render time.
- No drop shadow, inner shadow, or glow anywhere in the file.
- Center alignment of the dot and both rings must land on the exact canvas center, verified by pixel measurement, not by eye.
- A vector source (`arrvd-app-icon-master.svg`) may be kept for production/design management, but the file submitted to App Store Connect and any other platform is the rasterized 1024px PNG master — the SVG is not a submission format.

#### 34.5.5 App Icon vs. Web Arrival Mark (role difference)

**The App Icon does not need to be pixel-identical to the Web Arrival Mark.** Their roles differ:

- **Web Arrival Mark (§34.3):** prioritizes quietness and lightness, at a size and context (a Featured Card, a hero) where detail can be appreciated. Three rings, tight-viewBox, no small-size optical correction needed at typical web sizes.
- **App Icon (this section):** prioritizes recognizability and findability at very small, fixed sizes (a home screen, a search result, a notification). To serve that role, the App Icon:
  - uses two rings rather than three,
  - uses a bolder stroke-to-canvas ratio than the Web Arrival Mark would at the same relative scale,
  - inverts the color relationship (a Blue background with a Warm White mark, rather than a Blue mark on a light background) for maximum contrast at a glance,
  - carries its own small-size optical correction (A1), a concept that does not apply to the Web Arrival Mark.

Both share the same DNA: a center dot with concentric rings, in the same Futodama/ARRVD blue-and-white color family, expressing the same "arrived point, reassurance spreading outward" idea (§34.1).

#### 34.5.6 Real-size visual priority rule (App Icon)

The golden-ratio reference values in §34.5.2 describe the geometry that was used while *designing* Icon A. **They are not the reason it was adopted.** Icon A, its A0 master, and its A1 small-size correction were each confirmed through direct real-size rendering comparison — at 1024, 256, 128, 64, and 32px, and in an iPhone home-screen mock alongside generic surrounding icons — not by their proximity to φ. This is consistent with §14.7 Real Browser / Real Device Priority Rule.

#### 34.5.7 iOS real-pixel slot mapping

§34.5.3 describes the A0/A1 split in general terms (128px+ vs. 32px/64px). When applied to an actual iOS `AppIcon.appiconset`, the real slot sizes iOS renders are not 32px/64px — they are the specific pixel sizes below, confirmed by direct real-size and pixel-zoom comparison of the shipped asset:

| Slot (px) | Usage | Variant |
|---|---|---|
| 20 | Notification @1x / iPad Settings @1x | A1 |
| 29 | Settings @1x | A1 |
| 40 | Spotlight @1x / Notification @2x | A1 |
| 58 | Settings @2x | A1 |
| 60 | Notification @3x | A1 |
| 76 | iPad Home @1x | A0 |
| 80 | Spotlight @2x | A0 |
| 87 | Settings @3x | A0 |
| 120 | iPhone Home @2x / Spotlight @3x | A0 |
| 152 | iPad Home @2x | A0 |
| 167 | iPad Pro Home @2x | A0 |
| 180 | iPhone Home @3x | A0 |
| 1024 | App Store marketing | A0 |

**Handoff boundary: between 60px and 76px.** At 58px and 60px, A0 alone reads as faint; A1 is needed to keep both rings visible. At 76px and above, A0 already reads cleanly on its own, and applying A1 there would add unnecessary weight without a legibility benefit. This boundary was decided by direct real-pixel-size rendering comparison of the actual candidate slot sizes, not by calculation or by proximity to the golden ratio.

Each slot is rendered directly at its own exact pixel size from the A0 or A1 geometry — never produced by downscaling the 1024px master — so that stroke widths remain crisp at every size. Where a single PNG file is referenced by more than one `Contents.json` entry (for example, an iPhone and iPad entry sharing the same point size and scale), all such shared references resolve to the same real pixel size and therefore always receive the same A0/A1 assignment; this mapping introduces no conflicting assignment for any shared file.

### 34.6 Parent / Product relationship

```
Futodama → Simple Dot
ARRVD    → Arrival Mark / App Icon
```

**Brand story:**

> A small dot becomes a point of arrival. From that moment, reassurance spreads outward.

> 小さな一つの点が、到着した場所になる。その瞬間から、安心が静かに広がっていく。

The Arrival Mark and the App Icon are both direct descendants of the Futodama Simple Dot (§8): at their core, each is a single solid-colored circle. ARRVD adds concentric rings around that same dot to express a specific, additional idea — arrival and the calm that follows it — without replacing or contradicting the parent Simple Dot concept.

### 34.7 ARRVD Design Review Rule

Any future change to the Arrival Mark, the App Icon, or other ARRVD brand-signature elements must be checked against all of the following before approval:

- Does it feel like reassurance?
- Is there any hint of surveillance?
- Is it simple?
- Is it human?
- Is it trustworthy?
- Does it still feel like a child of futodama's Simple Dot?
- Does it still hold up at small sizes?
- Has it been confirmed in a real browser or on a real device (per §14.7), not only as a generated concept image?

---

## 35. Web Grid

- Normal content max-width: 1120–1200px
- Long-form text: 680–760px
- Hero copy: 700–850px

Avoid body text that is too wide.

---

## 36. Accessibility

Accessibility is part of brand quality. Required:

- Semantic HTML
- Heading hierarchy
- Keyboard navigation
- Visible focus
- Sufficient contrast
- `lang` attribute
- Alt text
- `prefers-reduced-motion`
- No horizontal scroll at 375px

---

## 37. Language Policy

**Web:**

- English default: `/`
- Japanese: `/ja/`

One page, one language. English and Japanese body copy are never mixed on the same page.

Language switch: `EN | 日本語`

Proper nouns such as product names retain their official form in both languages.

---

## 38. Brand Governance

Going forward, all production work — including work done via Claude Code — uses this document as the official standard.

**Principle:** the following are not added arbitrarily:

- color
- font family
- text size
- spacing
- radius
- button style
- card style
- icon language

When a new one is genuinely needed, report:

1. The reason
2. Why the existing rules cannot address it
3. The proposed new token

and obtain approval before changing anything.

---

## 39. Five Brand Review Questions

Every new piece of work must be reviewed against these five questions:

1. **Is it simple?** — Are we adding anything unnecessary?
2. **Is it human?** — Does it feel cold or mechanical?
3. **Is it trustworthy?** — Is there exaggeration, fear-based language, or anything that feels suspicious?
4. **Is it recognizably futodama?** — Has it become a generic template that could belong to anyone?
5. **Does it make life lighter?** — Are we increasing the user's cognitive load?

**Additional questions (introduced in 1.1), for work that involves proportion or golden-ratio thinking:**

6. **Was it verified in a real browser or on a real device?** — Has a proportion, size, or layout been finalized from a calculation or a generated image alone, without real-environment confirmation?
7. **Did golden-ratio thinking stay in its place?** — Was it used only as a secondary refinement, never to override usability, accessibility, or an existing fixed token?
8. **Would the decision survive without the golden ratio?** — Is the underlying design choice justified on its own visual and usability merits, independent of whether it happens to align with a golden-ratio proportion?

For ARRVD brand-signature work specifically, also see the [ARRVD Design Review Rule](#347-arrvd-design-review-rule) in §34.7.

---

## 40. Version Management

This document is Version 1.3.

- **Minor changes:** 1.1, 1.2, 1.3
- **Major changes:** 2.0

Examples of major changes:

- A change to the brand Purpose
- A change to the official logo system
- A change to the primary color system
- A change to the brand architecture

Each update should record its reason for change.

**Change log:**

- **1.0 (2026):** Initial canonical guideline established.
- **1.0 update (2026):** Added the official Simple Dot logo specification (dot diameter, gap, wordmark weight, and color values), Clear Space rule, and Minimum Size rule. This finalizes exact values within the Simple Dot direction already adopted in 1.0 — it is not a change to the logo system itself, so the version number is unchanged.
- **1.0 update (2026):** Specified Inter SemiBold (600) as the official wordmark typeface, and required the wordmark in distribution logo SVGs to be outlined vector paths rather than live text, so the official logo renders identically across environments. Web UI typography is unaffected and continues to follow the system font stack in §18–§20.
- **1.1 (2026):** Finalized the Simple Dot logo's visible dot diameter (26px) and gap (6px) after a from-scratch, real-browser-only comparison across Desktop and Mobile, replacing the earlier provisional values (12px / 8px, and an intermediate 20px / 9px round) that had never been confirmed as accurately reflecting real, on-screen rendering. Added the Golden Ratio Design Principle as a new, general, optional design aid, including the explicit clarification that the finalized logo values were derived from real-browser comparison first and were not reverse-engineered from the golden ratio. Added three additional Brand Review Questions covering real-environment verification and the proper, secondary role of golden-ratio thinking. This is a refinement of exact values within the already-adopted Simple Dot logo system, not a change to the logo system itself.
- **1.2 (2026):** Added the new §34 ARRVD Brand Signature: the core brand idea ("the Dot has arrived; reassurance spreads outward"), the three-part ARRVD Messaging system (Product Promise / Product Explanation / Brand Spirit), the official Web Arrival Mark specification (3-ring, center-tight/edge-wide spacing, 1.25× center dot), the small-size 2-ring variant, the official ARRVD App Icon direction (Icon A: Blue background, Warm White dot and rings), the Parent/Product relationship (Simple Dot → Arrival Mark) and brand story, and the ARRVD Design Review Rule. This formalizes design decisions already reached through real-browser comparison; it does not itself change the production Arrival Mark ring spacing or introduce a production App Icon asset — both remain implementation work for a separate, later step. This is a documentation-only addition within the existing brand architecture (§33), not a change to the brand architecture itself, so the version bump is minor.
- **1.3 (2026-09-24):** Adopted the ARRVD App Icon as an official, real-device-verified futodama brand asset. Expanded §34.5 into the full official specification: the locked 1024px master (A0) geometry and color values, the small-size optical correction (A1, explicitly not a separate icon), the master asset technical requirements (1024×1024 RGB, no alpha, full-bleed, no baked corner radius, center-aligned), the App Icon vs. Web Arrival Mark role distinction, the real-size visual priority rule, and (new in this version) the real-pixel iOS slot mapping confirmed against the actual `AppIcon.appiconset` sizes (A1 at 20/29/40/58/60px, A0 at 76/80/87/120/152/167/180/1024px, handoff between 60px and 76px). The App Icon has been verified on-device at its primary display sizes, including the iPhone home screen. The golden-ratio geometry references remain a supporting design aid, not the basis for adoption — see §34.5.6. This is a documentation-only addition within the existing ARRVD Brand Signature (§34), not a change to the brand architecture itself, so the version bump is minor. **This version is now the current canonical brand guideline, superseding 1.2.**

---

## Related documents

- [docs/brand/README.md](README.md) — brand documentation index
- [assets/brand/logo/README.md](../../assets/brand/logo/README.md) — canonical logo asset files
- [Futodama_Brand_Guidelines_1.2.md](Futodama_Brand_Guidelines_1.2.md) — superseded; kept for historical reference only
- [Futodama_Brand_Guidelines_1.1.md](Futodama_Brand_Guidelines_1.1.md) — superseded; kept for historical reference only
- [Futodama_Brand_Guidelines_1.0.md](Futodama_Brand_Guidelines_1.0.md) — superseded; kept for historical reference only
