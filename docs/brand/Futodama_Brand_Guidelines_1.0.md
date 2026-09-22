# Futodama Brand Guidelines 1.0

Version: 1.0
Status: Current canonical brand guideline
Brand: futodama
Primary domain: https://futodama.app
Established: 2026

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

The following values are the finalized, official specification for the Simple Dot logo.

**Basic form:**

```
● futodama
```

| Property | Value |
|---|---|
| Dot diameter | 12px (reference size) |
| Gap (dot to wordmark) | 8px |
| Wordmark | `futodama` |
| Official wordmark typeface | Inter SemiBold |
| Wordmark weight | 600 |
| Dot color | `#3B82C4` |
| Wordmark color | `#1F2A37` |

**Official wordmark typeface:** Inter SemiBold (600). This is separate from the Web UI typography system in §18 English Font Stack. The logo wordmark is a fixed brand asset and must render identically in every environment, so it is not left to whatever font a given system happens to have installed — that is a different concern from body/UI text, which intentionally uses the system font stack for performance and stable global rendering.

**Distribution logo assets:** in the canonical SVG files (`assets/brand/logo/futodama-logo*.svg`), the wordmark is converted to outlined vector paths, not left as editable text. This means the official logo renders identically across environments and does not depend on the Inter font being installed or loaded. Web UI typography (navigation, headings, body copy) remains governed separately by the Futodama typography system in §17–§19, and is unaffected by this rule.

**Rules:**

- Lowercase only.
- The dot and wordmark are treated as a single, inseparable unit.
- Dot diameter is 12px at reference scale.
- Gap between dot and wordmark is 8px.
- Wordmark weight is 600.
- Dot color is `#3B82C4`.
- Wordmark color is `#1F2A37`.
- No shadow.
- No gradient.
- No multiple dots.
- No change to the dot's shape.
- No arbitrary change to the wordmark's letter spacing.
- No change to the overall logo aspect ratio.

**Why these values:**

- A 12px dot reads as a brand mark rather than a decorative flourish.
- An 8px gap keeps the dot and wordmark feeling like one unit without feeling cramped.
- Weight 600 is more visible than 500 and lighter than 700 — it reads as confident without feeling heavy.
- This combination best balances the Professional × Human brand personality.
- It holds up consistently across web, mobile, favicon, and print contexts.

---

## 10. Clear Space

Let **X** = the dot diameter.

Minimum clear space around the logo: **1X** on all sides (top, bottom, left, right).

At the 12px reference size, this is a minimum of 12px of clear space around the full logo.

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
- Changing the dot diameter from the official 12px reference
- Changing the gap from the official 8px
- Changing the wordmark weight from 600
- Changing the dot or wordmark colors from the official values

---

## 14. Brand Colors

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

## 15. Color Roles

- **Blue:** Trust / reassurance / primary action
- **Green:** growth / life / positive support
- **Navy:** brand text / headings / stability
- **Charcoal:** body text
- **Warm White:** main background
- **Gold:** joy / special moments / limited accent
- **Red:** not used as a brand color. Red is reserved only for meaningful UI purposes such as error / danger / warning.

---

## 16. Product Colors

The parent brand and each product are distinguished by color.

- **futodama:** Blue-centered
- **ARRVD:** Blue-centered
- **Mojitsunagi / もじつなぎ:** Green-centered
- **Celestial Oracle:** Deep Navy + Gold

The parent brand's color is not forced across every product uniformly.

---

## 17. Typography Policy

To preserve visual consistency, fonts, sizes, and weights are not added arbitrarily.

On the web, a system font stack is the baseline, prioritizing performance and stable global rendering.

---

## 18. English Font Stack

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

## 19. Japanese Font Stack

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

## 20. Type Scale

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

## 21. Font Weights

- **400 Regular:** body text
- **500 Medium:** navigation, labels, small emphasis
- **600 Semibold:** H3, buttons, the futodama wordmark, etc.
- **700 Bold:** Hero, H1, key headings
- **800 / 900:** not used as a rule

---

## 22. Line Height

- **Body:** 1.6–1.75
- **Heading:** approximately 1.1–1.3, depending on content

Do not cram long text too densely.

---

## 23. Spacing System

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

## 24. Border Radius

Official values:

- **Small:** 8px
- **Medium:** 12px
- **Large:** 16px
- **Pill:** 999px

- Cards: 12–16px
- Buttons: 8–12px

Do not round corners excessively.

---

## 25. Borders

- **Normal:** 1px
- **Emphasis:** 2px
- **Icon stroke:** 1.5–2px

Do not create boundaries with excessive shadow instead of borders.

---

## 26. Buttons

There are three official button types:

- **Primary:** Blue background, white text
- **Secondary:** White / transparent background, navy border
- **Text link:** No background, blue text

Do not place a large number of Primary CTAs on one screen.

---

## 27. Cards

Cards are used to organize content. Do not turn everything into a card.

Baseline:

- White background
- Subtle 1px border
- 12–16px radius
- No shadow as a rule, or a very subtle one only

Do not lift cards excessively on hover either.

---

## 28. Icons

Baseline:

- Simple
- Line-based
- Abstract
- Stroke 1.5–2px

Emoji are not used as official UI icons.

---

## 29. Imagery

Priority order:

1. Actual product screens
2. Original diagrams / illustrations
3. Simple abstract expressions

Do not use meaningless stock photography in bulk. In particular, do not build the brand around generic "smiling family" style photography that could belong to any company.

---

## 30. Motion

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

## 31. Writing Voice

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

## 32. Brand Architecture

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

## 33. Web Grid

- Normal content max-width: 1120–1200px
- Long-form text: 680–760px
- Hero copy: 700–850px

Avoid body text that is too wide.

---

## 34. Accessibility

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

## 35. Language Policy

**Web:**

- English default: `/`
- Japanese: `/ja/`

One page, one language. English and Japanese body copy are never mixed on the same page.

Language switch: `EN | 日本語`

Proper nouns such as product names retain their official form in both languages.

---

## 36. Brand Governance

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

## 37. Five Brand Review Questions

Every new piece of work must be reviewed against these five questions:

1. **Is it simple?** — Are we adding anything unnecessary?
2. **Is it human?** — Does it feel cold or mechanical?
3. **Is it trustworthy?** — Is there exaggeration, fear-based language, or anything that feels suspicious?
4. **Is it recognizably futodama?** — Has it become a generic template that could belong to anyone?
5. **Does it make life lighter?** — Are we increasing the user's cognitive load?

---

## 38. Version Management

This document is Version 1.0.

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
- **1.0 update (2026):** Specified Inter SemiBold (600) as the official wordmark typeface, and required the wordmark in distribution logo SVGs to be outlined vector paths rather than live text, so the official logo renders identically across environments. Web UI typography is unaffected and continues to follow the system font stack in §18–§19.

---

## Related documents

- [docs/brand/README.md](README.md) — brand documentation index
- [assets/brand/logo/README.md](../../assets/brand/logo/README.md) — canonical logo asset files
