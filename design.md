# 🚢 Harbor Elegance — Design System

> A refined, light-mode design language inspired by Mediterranean coastal dining.
> Built for the Ramirez Restaurant website.

---

## 🎨 Color Palette

| Token                | Hex       | Usage                                      |
|----------------------|-----------|---------------------------------------------|
| `--color-ivory`      | `#FDFBF7` | Primary background (Crisp Ivory)            |
| `--color-ivory-warm` | `#F8F4EC` | Card surfaces, alternate backgrounds        |
| `--color-navy`       | `#1B2A4A` | Primary text, headings (Nautical Navy)      |
| `--color-navy-light` | `#2E4066` | Secondary text, subtle emphasis             |
| `--color-navy-muted` | `#5A6A8A` | Tertiary text, captions, metadata           |
| `--color-gold`       | `#C8A951` | Primary accent — CTAs, highlights, borders  |
| `--color-gold-light` | `#E2D1A0` | Soft accent — hover states, dividers        |
| `--color-gold-dark`  | `#A68B3C` | Accent emphasis — active states             |
| `--color-white`      | `#FFFFFF` | Pure white — modals, overlays               |
| `--color-border`     | `#E8E2D6` | Subtle borders and separators               |
| `--color-shadow`     | `rgba(27, 42, 74, 0.08)` | Soft shadows                 |

> **⚠️ No dark mode.** This design system is light-mode only. Every surface stays warm and inviting.

---

## 🔤 Typography

### Font Stack

| Role      | Font Family                         | Weight(s)        | Fallback                  |
|-----------|-------------------------------------|------------------|---------------------------|
| Headings  | **Playfair Display** (Serif)        | 500, 600, 700    | Georgia, serif            |
| Body      | **Inter** (Sans-Serif)              | 400, 500, 600    | system-ui, sans-serif     |
| Accent    | **Cormorant Garamond** (Serif)      | 400 italic, 500  | Georgia, serif            |

### Type Scale

| Element   | Size      | Line Height | Weight | Font        | Letter Spacing |
|-----------|-----------|-------------|--------|-------------|----------------|
| H1        | 3.5rem    | 1.15        | 700    | Playfair    | -0.02em        |
| H2        | 2.5rem    | 1.2         | 600    | Playfair    | -0.01em        |
| H3        | 1.75rem   | 1.3         | 600    | Playfair    | 0              |
| H4        | 1.25rem   | 1.4         | 500    | Playfair    | 0.01em         |
| Body      | 1rem      | 1.65        | 400    | Inter       | 0.01em         |
| Body Sm   | 0.875rem  | 1.6         | 400    | Inter       | 0.015em        |
| Caption   | 0.75rem   | 1.5         | 500    | Inter       | 0.04em         |
| Price     | 1.125rem  | 1.4         | 600    | Inter       | 0.02em         |
| Nav Link  | 0.875rem  | 1           | 500    | Inter       | 0.08em         |

---

## 📐 Spacing & Layout

| Token            | Value   | Usage                          |
|------------------|---------|--------------------------------|
| `--space-xs`     | 0.25rem | Tight inline spacing           |
| `--space-sm`     | 0.5rem  | Between related elements       |
| `--space-md`     | 1rem    | Standard padding               |
| `--space-lg`     | 1.5rem  | Section internal padding       |
| `--space-xl`     | 2.5rem  | Between sections               |
| `--space-2xl`    | 4rem    | Major section gaps             |
| `--space-3xl`    | 6rem    | Hero / page-level spacing      |
| `--max-width`    | 1200px  | Content container max-width    |
| `--border-radius`| 8px     | Default border radius          |
| `--border-radius-lg` | 16px | Cards, larger containers      |

---

## 🧱 Component Guidelines

### Cards (Menu Item, Category)
- Background: `--color-ivory-warm`
- Border: `1px solid --color-border`
- Border-radius: `--border-radius-lg`
- Box-shadow: `0 2px 12px --color-shadow`
- Hover: lift with `translateY(-2px)` and stronger shadow

### Buttons
- Primary: `--color-gold` background, `--color-white` text, bold
- Primary hover: `--color-gold-dark` background
- Secondary: transparent with `--color-gold` border and text
- Border-radius: `--border-radius`
- Padding: `0.75rem 1.5rem`
- Text-transform: `uppercase` + `letter-spacing: 0.08em`

### Navigation
- Background: `--color-ivory` with subtle bottom border
- Links: `--color-navy` with `--color-gold` underline on hover
- Active link: `--color-gold` text color
- Sticky on scroll with soft shadow

### Dividers & Decorative Elements
- Gold thin rule: `1px solid --color-gold-light`
- Ornamental divider: centered gold diamond / anchor icon
- Section separators use generous vertical spacing (`--space-2xl`)

---

## ✨ Micro-Interactions

| Element              | Effect                                              |
|----------------------|------------------------------------------------------|
| Menu card hover      | `translateY(-2px)`, shadow deepens, 200ms ease       |
| Button hover         | Background darkens, subtle scale(1.02), 150ms ease   |
| Nav link hover       | Gold underline slides in from left, 250ms ease       |
| Page transitions     | Fade-in on route change, 300ms ease                  |
| Category header      | Subtle fade-up on scroll into view                   |
| Language switcher    | Smooth opacity transition, 200ms                     |
| Price text           | Gold color with slight weight increase on card hover |

---

## 🌐 Internationalization Notes

- Three languages: **English (en)**, **Hungarian (hu)**, **German (de)**
- Default locale: `hu` (Hungarian)
- All text content sourced from `/public/locales/{locale}.json`
- Font choices support full Latin-extended character set (Hungarian diacritics: á, é, í, ó, ö, ő, ú, ü, ű; German: ä, ö, ü, ß)

---

## 📱 Responsive Breakpoints

| Name     | Min-width | Notes                            |
|----------|-----------|----------------------------------|
| Mobile   | 0px       | Single column, stacked layout    |
| Tablet   | 768px     | Two-column menu grid             |
| Desktop  | 1024px    | Full layout, side-by-side        |
| Wide     | 1440px    | Max content width, centered      |

---

## 🚫 Anti-Patterns

- **No dark mode** — the design is exclusively warm, light, and inviting
- **No neon or saturated colors** — stay within the warm/navy/gold palette
- **No rounded pill buttons** — use subtle `8px` radius
- **No heavy drop shadows** — keep shadows soft and ethereal
- **No decorative fonts for body text** — Serif is headings only
- **No generic system fonts** — always use the specified Google Fonts
