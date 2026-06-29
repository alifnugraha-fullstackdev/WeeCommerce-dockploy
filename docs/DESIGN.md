# WeeCommerce Design System

**Version:** 1.0
**Source of structural inspiration:** Framer marketing canvas (dark canvas, surface elevation, pill CTAs, poster-grade display type)
**Brand source of truth:** [WeeCommerce Brand Blueprint §D](../WeeCommerce-Brand-Blueprint.txt) (Visual Identity Direction)
**Implementation:** Tailwind CSS v4 + Shadcn/UI + Radix primitives

> Berkaitan: [PRD.md](./PRD.md) (UI requirements) · [CONTRIBUTING.md](./CONTRIBUTING.md) (component workflow) · [SECURITY.md §4](./SECURITY.md#4-content-security-policy) (CSP untuk inline styles)

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Adaptation Notes (Framer → WeeCommerce)](#2-adaptation-notes-framer--weecommerce)
3. [Color Tokens](#3-color-tokens)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Border Radius](#6-border-radius)
7. [Surface Elevation & Depth](#7-surface-elevation--depth)
8. [Signature Element: The Intelligence Grid](#8-signature-element-the-intelligence-grid)
9. [Components](#9-components)
10. [Hero Section](#10-hero-section)
11. [Pricing Section (Bento)](#11-pricing-section-bento)
12. [Logo Wordmark](#12-logo-wordmark)
13. [Do's & Don'ts](#13-dos--donts)
14. [Responsive Behavior](#14-responsive-behavior)
15. [Component Registry](#15-component-registry)

---

## 1. Design Philosophy

### 1.1 Visual Personality

| WeeCommerce Feels Like | WeeCommerce Does NOT Feel Like |
|---|---|
| Precision tool | Creative playground |
| Confident advisor | Corporate vendor / IT company |
| Intelligent system | Generic tech startup |
| Editorial, structured | Flashy, gradient-heavy |

### 1.2 Core Principles

- **Dark-first canvas** — near-black base, surfaces lift subtly. Dark IS the whitespace.
- **Single accent** — teal `#2DD4BF` only. One chromatic signal, never decorative.
- **Poster-grade headlines** — aggressive negative letter-spacing on display sizes.
- **Structural depth** — surface elevation (canvas → surface-1 → surface-2) carries hierarchy, not opacity.
- **AI-native signal** — monospace accent for technical/AI elements (chatbot, code, metrics).
- **Portable identity** — the visual system survives a brand rename (working brand, per Brand Blueprint §A).

### 1.3 Why Dark-First?

- Most WeeCommerce clients are tech-aware e-commerce founders who expect a serious, modern aesthetic.
- Dark canvas lets teal accent pop without competing.
- Hero projects (NexaMart) look like "products," not "websites."
- Aligns with Brand Blueprint §D: *"Dark-first untuk digital presence."*

---

## 2. Adaptation Notes (Framer → WeeCommerce)

WeeCommerce borrows **Framer's structural language** but swaps the **brand identity layer** to match Brand Blueprint §D.

### 2.1 What We KEEP from Framer

| Framer Element | Why Keep |
|---|---|
| Near-black canvas (`#090909`) | Matches Brand Blueprint `--color-base #09090B` |
| Surface elevation 0/1/2 | Subtle, professional hierarchy |
| Pill CTAs (`rounded-full`) | Modern, confident |
| Poster-grade display with negative tracking | Memorable, editorial |
| Inter Variable body with OpenType variants | Universal readability |
| Whitespace as cuts in a dark film | Distinctive rhythm |

### 2.2 What We REPLACE

| Framer (original) | WeeCommerce (replacement) | Why |
|---|---|---|
| Accent blue `#0099ff` | **Teal `#2DD4BF`** | Brand Blueprint signature color |
| GT Walsheim Medium display | **Space Grotesk 500–700** | Brand Blueprint: "Geometric, distinctive. Lebih memorable dari Inter." |
| Gradient spotlights (violet/magenta/orange/coral) | **Intelligence Grid pattern** | Brand Blueprint §D: "Dark + purple gradient → overused, tidak memorable" |
| (no mono) | **JetBrains Mono for AI elements** | Brand Blueprint: "Untuk AI feature callouts, label teknis" |

### 2.3 What We ADD

- **Light mode** (for proposals/docs) — per Brand Blueprint §D: *"Light untuk dokumen & proposal."*
- **Intelligence Grid** signature element — subtle grid pattern (8–12% opacity) in hero backgrounds.

---

## 3. Color Tokens

### 3.1 Dark Mode (Primary — Digital Presence)

```yaml
# CSS variables (also exposed as Tailwind theme tokens)
--color-base:        #09090B   # Background utama (near-black)
--color-surface:     #111113   # Card, panel surface (surface-1)
--color-surface-2:   #1A1A1D   # Featured/selected surface (surface-2)
--color-border:      #27272A   # Divider, outline
--color-border-soft: #1A1A1D   # Subtler divider (between FAQ rows, footer cols)
--color-text:        #FAFAFA   # Primary text (off-white)
--color-muted:       #A1A1AA   # Secondary text, labels
--color-accent:      #2DD4BF   # Signature accent (teal-400) — hero color
--color-accent-dim:  #0D9488   # Hover/darker accent (teal-600)
--color-accent-soft: rgba(45, 212, 191, 0.15)  # Focus ring, selection halo
--color-success:     #22C55E   # Checkmarks, confirmations
```

### 3.2 Light Mode (Documents & Proposals)

```yaml
--color-base-light:        #FFFFFF
--color-surface-light:     #FAFAFA
--color-surface-2-light:   #F4F4F5
--color-border-light:      #E4E4E7
--color-text-light:        #09090B
--color-muted-light:       #52525B
--color-accent-light:      #0D9488   # darker teal for AA contrast on white
```

### 3.3 Tailwind Theme Mapping

```css
/* apps/web/app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: var(--color-base);
  --color-foreground: var(--color-text);
  --color-card: var(--color-surface);
  --color-card-foreground: var(--color-text);
  --color-muted: var(--color-surface-2);
  --color-muted-foreground: var(--color-muted);
  --color-border: var(--color-border);
  --color-primary: var(--color-accent);       /* teal */
  --color-primary-foreground: #09090B;        /* dark text on teal */
  --color-secondary: var(--color-surface);
  --color-secondary-foreground: var(--color-text);
  --color-accent: var(--color-surface-2);
  --color-accent-foreground: var(--color-text);
  --color-ring: var(--color-accent-soft);

  /* Fonts */
  --font-display: "Space Grotesk", sans-serif;
  --font-sans: "Inter Variable", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

/* Dark mode toggle */
.dark { /* dark is default */ }
.light {
  --color-background: var(--color-base-light);
  --color-foreground: var(--color-text-light);
  /* ...map all tokens */
}
```

### 3.4 Usage Rules

- **`--color-text` vs `--color-muted`** — binary hierarchy. Avoid mid-tone grays outside these two.
- **`--color-accent` (teal)** — single chromatic signal: hyperlinks, focus rings, primary CTA fills, signature dot in wordmark, Intelligence Grid lines.
- **Never** use teal as large background fill. It's a signal color, not a surface.

---

## 4. Typography

### 4.1 Font Stack

| Role | Font | Weights | Notes |
|---|---|---|---|
| Display / Heading | **Space Grotesk** | 500–700 | Geometric, distinctive. Negative tracking -0.02em default. |
| Body / UI | **Inter Variable** | 400–500 | Universal readability. OpenType variants `cv01, cv05, cv09, cv11` enabled. |
| Technical / Code | **JetBrains Mono** | 400 | For AI feature callouts, metrics, code snippets, technical labels. |

### 4.2 Type Scale

Letter-spacing scales aggressively negative at display sizes (Framer principle — poster-grade at top, comfortable at body).

| Token | Size | Weight | Line-Height | Letter-Spacing | Font | Use |
|---|---|---|---|---|---|---|
| `display-xxl` | clamp(48px, 8vw, 96px) | 600 | 0.9 | -0.04em | Space Grotesk | Hero headline |
| `display-xl` | clamp(40px, 6vw, 72px) | 600 | 0.95 | -0.035em | Space Grotesk | Section opener |
| `display-lg` | clamp(32px, 5vw, 56px) | 600 | 1.0 | -0.03em | Space Grotesk | Sub-section opener |
| `display-md` | 32px | 500 | 1.13 | -0.02em | Space Grotesk | Card titles |
| `headline` | 22px | 700 | 1.2 | -0.02em | Inter | Pricing tier, FAQ category |
| `subhead` | 24px | 400 | 1.3 | -0.01em | Inter | Lead body next to display |
| `body-lg` | 18px | 400 | 1.5 | -0.011em | Inter | Hero subhead, lead paragraphs |
| `body` | 16px | 400 | 1.6 | -0.011em | Inter | Default body |
| `body-sm` | 14px | 500 | 1.4 | -0.01em | Inter | Dense data, comparison rows |
| `caption` | 13px | 500 | 1.2 | -0.005em | Inter | Footer columns, meta |
| `micro` | 12px | 400 | 1.2 | 0 | Inter | Disclaimer, footnote |
| `button` | 14px | 500 | 1.0 | -0.01em | Inter | Pill buttons |
| `mono-label` | 12px | 500 | 1.2 | 0.05em | JetBrains Mono | AI/technical label (uppercase) |
| `mono-metric` | 28px | 500 | 1.0 | -0.02em | JetBrains Mono | Case study metric value |

### 4.3 Next.js Font Loading

```tsx
// apps/web/app/layout.tsx
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 4.4 Typography Principles

- **Letter-spacing scales with size.** Display: -0.04em (4% of size). Body: -0.011em (~0.7%).
- **Weight stays narrow band.** Display 600, body 400, body-sm/caption 500. Hierarchy via size + tracking, not 700/900 ramps.
- **Tight line-heights for display** (0.9–1.0), relaxed for body (1.5–1.6).
- **Mono for AI signal.** Any time content references the AI capability (chatbot, RAG, metrics, code), use JetBrains Mono with slight positive tracking.

---

## 5. Spacing & Layout

### 5.1 Base Unit

5px base (per Framer, non-standard but produces tighter editorial rhythm).

| Token | Value | Use |
|---|---|---|
| `hair` | 1px | Hairline borders |
| `xxs` | 4px | Icon padding |
| `xs` | 8px | Tight gaps |
| `sm` | 12px | Inline element gaps |
| `md` | 16px | Default gap, card padding small |
| `lg` | 20px | Card padding, button padding |
| `xl` | 24px | Card padding large |
| `2xl` | 32px | Spotlight card padding, section sub-gap |
| `3xl` | 48px | Major section gap |
| `section` | 96px | Section vertical padding (home), tighter (~64px) on pricing |

### 5.2 Container

- **Max content width:** 1200px (desktop), with side gutters scaling to `xl` (24px) on desktop.
- **Wide sections** (hero, logo cloud): full-bleed background, content constrained to 1200px.
- **Card grids:** 2-up desktop, 1-up below 768px.

```css
.container-wee {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1rem;   /* 16px mobile */
}
@media (min-width: 768px) {
  .container-wee { padding-inline: 1.5rem; }  /* 24px desktop */
}
```

### 5.3 Section Rhythm

Dark canvas IS the whitespace. Sections separate by mode change:
- Band of charcoal cards → band of black with Intelligence Grid → back to charcoal.
- Like cuts in a dark film. Don't overfill space — let headlines breathe.

---

## 6. Border Radius

Framer's granular scale, kept.

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Small chip / utility |
| `sm` | 6px | Inline tag, badge |
| `md` | 10px | Form input, list item |
| `lg` | 12px | Template card thumbnails |
| `xl` | 16px | Pricing cards, mockup tiles |
| `2xl` | 24px | Oversized panels, Intelligence Grid tiles |
| `pill` | 9999px | All primary CTAs (full pill) |
| `full` | 9999px | Circular icon buttons, avatars |

> In Tailwind/Shadcn: `rounded-full` for pills, `rounded-xl` (12px) default for cards, `rounded-md` (6px) for inputs (Shadcn default).

---

## 7. Surface Elevation & Depth

### 7.1 Elevation Scale

| Level | Treatment | Use |
|---|---|---|
| **0 (flat)** | No shadow, no border, on `--color-base` | Default for canvas-mounted display type, FAQ rows, footer |
| **1 (surface lift)** | `--color-surface` (#111113) on canvas | Pricing cards, mockup tiles, secondary buttons, input fields |
| **2 (featured)** | `--color-surface-2` (#1A1A1D) on surface | Featured pricing card (CONVERT), selected state |
| **3 (focus ring)** | `0 0 0 1px var(--color-accent-soft)` teal halo | Focused inputs, selected option |
| **4 (floating)** | Layered shadow: `rgba(255,255,255,0.06) 0 1px 0 inset, rgba(0,0,0,0.4) 0 10px 30px` | Modals, dropdowns, floating cards |

### 7.2 Shadow Tokens

```css
--shadow-subtle:  0 1px 2px rgba(0,0,0,0.4);
--shadow-card:    0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 12px rgba(0,0,0,0.3);
--shadow-floating: 0 1px 0 rgba(255,255,255,0.08) inset, 0 10px 30px rgba(0,0,0,0.4);
--shadow-focus:   0 0 0 2px var(--color-base), 0 0 0 4px var(--color-accent-soft);
```

### 7.3 Depth Principles

- **Surface lift > shadow.** Hierarchy on dark canvas is carried by surface elevation (canvas → surface-1 → surface-2), not heavy shadows.
- **One chromatic depth signal:** teal focus ring (level 3).
- **No gradient elevation.** (Brand Blueprint forbids gradients as decorative depth.)

---

## 8. Signature Element: The Intelligence Grid

The **Intelligence Grid** is WeeCommerce's brand signature — replacing Framer's gradient spotlight cards. Per Brand Blueprint §D:

> *"Satu subtle grid pattern yang visible di background hero section dan proposal header. Opacity 8–12%. Merepresentasikan dua dunia WeeCommerce sekaligus: product grid (e-commerce) dan data matrix (AI). Bukan ornamental — structural."*

### 8.1 Implementation (CSS)

```css
/* apps/web/app/globals.css */

.intelligence-grid {
  background-image:
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.08;  /* 8–12% per brand spec */
  mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black, transparent);
}
```

### 8.2 Usage Locations

| Location | Opacity | Notes |
|---|---|---|
| Hero section background | 10% | Fades from top, masked at bottom |
| Proposal header (PDF/docs) | 8% | Same pattern, light-mode variant |
| Footer top edge | 6% | Subtle horizon line |
| Case study detail (above fold) | 10% | Behind hero metric tiles |

### 8.3 Rules

- **Structural, not ornamental.** Grid lines align to the typographic baseline grid (48px → matches `2xl` spacing).
- **Subtle.** Never above 12% opacity — must read as texture, not pattern.
- **Single direction mask.** Always fades (top→bottom or center→edges), never hard-edged.
- **Do NOT use as section background.** It's an accent texture, used sparingly (1–2 locations per page max).

---

## 9. Components

### 9.1 Button Variants

| Token | Background | Text | Use |
|---|---|---|---|
| `button-primary` | `--color-text` (white) | `--color-base` (dark) | Primary CTA pill — "Get Started", "Book a Call" |
| `button-primary-hover` | `--color-muted` (#A1A1AA) | `--color-base` | Hover state |
| `button-secondary` | `--color-surface` | `--color-text` | Secondary pill — "Sign in", "Talk to us" |
| `button-accent` | `--color-accent` (teal) | `--color-base` (dark) | Reserve for conversion-critical CTA only (max 1 per page) |
| `button-ghost` | transparent | `--color-text` | Tertiary nav links |
| `button-icon-circular` | `--color-surface` | `--color-text` | 40px circle (carousel arrows, social) |

All buttons: `rounded-full`, padding `10px 20px`, font `button` (14px / 500), min height 44px (touch target).

```tsx
// Shadcn Button variants extension
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90",
        accent: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-card text-card-foreground hover:bg-card/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-border bg-transparent hover:bg-card",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
  }
);
```

### 9.2 Cards

| Token | Background | Radius | Padding | Use |
|---|---|---|---|---|
| `card` | `--color-surface` | `xl` (12px) | `lg` (20px) | Default content card |
| `card-featured` | `--color-surface-2` | `xl` (12px) | `lg` (20px) | Featured pricing tier (CONVERT) |
| `card-spotlight` | `--color-surface-2` + Intelligence Grid | `2xl` (24px) | `2xl` (32px) | Case study hero, oversized showcase |
| `card-mockup` | `--color-surface` | `xl` (12px) | `md` (16px) | Product UI mock tile (NexaMart preview) |

### 9.3 Form Inputs

| Token | Background | Border | Radius | Focus |
|---|---|---|---|---|
| `input` | `--color-surface` | `1px --color-border` | `md` (6px) | `--shadow-focus` teal ring |
| `input-error` | `--color-surface` | `1px #EF4444` | `md` (6px) | red ring |

Padding `10px 14px`, font `body`, color `--color-text`.

### 9.4 Pricing Tabs

| Token | Background | Text | Use |
|---|---|---|---|
| `pricing-tab-default` | `--color-base` | `--color-muted` | Unselected tier toggle |
| `pricing-tab-selected` | `--color-surface-2` | `--color-text` | Selected tier (lift, not color) |

### 9.5 FAQ Row

| Token | Background | Text | Radius | Padding |
|---|---|---|---|---|
| `faq-row` | `--color-base` | `--color-text` | `md` (6px) | `xl` (24px) |

Separator: `1px --color-border-soft` between rows.

### 9.6 Top Nav

- Background: `--color-base` with subtle backdrop blur on scroll.
- Height: 56px desktop, 56px mobile (with hamburger).
- Logo wordmark left, nav links center (desktop), CTAs right.
- On scroll > 10px: `bg-background/95 backdrop-blur-lg border-b border-border`.

### 9.7 Footer

- Background: `--color-base`.
- Text: `--color-muted`, font `caption` (13px).
- Padding: `64px 32px`.
- 5–6 columns of links + wordmark + Intelligence Grid edge (6% opacity).

---

## 10. Hero Section

Reference implementation: **`hero-1.tsx`** (efferd/21st.dev). Adapted to WeeCommerce brand copy.

### 10.1 Hero Anatomy

```
┌─────────────────────────────────────────────────────────┐
│              [Intelligence Grid bg, 10% opacity]        │
│                                                          │
│         ┌──────────────────────────────────┐            │
│         │ 🚀 E-commerce, powered by AI! →  │  (pill badge)│
│         └──────────────────────────────────┘            │
│                                                          │
│              Built to convert.                          │
│              Wired to learn.                            │
│              (display-xxl, Space Grotesk)               │
│                                                          │
│         We build the store. AI runs it.                 │
│         Most agencies build you a store.                │
│         We build you a system.                          │
│              (body-lg, Inter)                           │
│                                                          │
│      [ 📞 Book a Call ]   [ Get Started → ]            │
│       (secondary pill)     (primary pill)              │
│                                                          │
└─────────────────────────────────────────────────────────┘

              [ Logo Cloud: trusted by experts ]
              (InfiniteSlider animation, tech stack logos)
```

### 10.2 Reference Component (`apps/web/components/ui/hero-1.tsx`)

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-3";

export function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-5xl">
      {/* Intelligence Grid background */}
      <div
        aria-hidden="true"
        className="intelligence-grid absolute inset-0 -z-10"
      />

      {/* Top radial fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -top-14 isolate -z-10 hidden overflow-hidden lg:block"
      >
        <div className="absolute inset-0 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)]" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center gap-5 pb-30 pt-32">
        {/* Pill badge */}
        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-500 duration-500 ease-out"
          )}
          href="#services"
        >
          <RocketIcon className="size-3 text-muted-foreground" />
          <span className="text-xs">E-commerce, powered by AI!</span>
          <span className="block h-5 border-l" />
          <ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
        </a>

        {/* Headline */}
        <h1
          className={cn(
            "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center delay-100 duration-500 ease-out",
            "font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl",
            "text-shadow-[0_0px_50px_theme(--color-foreground/.2)]"
          )}
        >
          Built to convert. <br /> Wired to learn.
        </h1>

        {/* Subhead */}
        <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base tracking-wider text-foreground/80 delay-200 duration-500 ease-out sm:text-lg md:text-xl">
          We build the store. AI runs it. <br />
          Most agencies build you a store. We build you a system.
        </p>

        {/* CTAs */}
        <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards delay-300 duration-500 ease-out pt-2">
          <Button variant="secondary" size="lg">
            <PhoneCallIcon className="mr-2 size-4" />
            Book a Call
          </Button>
          <Button size="lg">
            Get Started
            <ArrowRightIcon className="ms-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LogosSection() {
  return (
    <section className="relative space-y-4 border-t pb-10 pt-6">
      <h2 className="text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
        Trusted by <span className="text-foreground">experts</span>
      </h2>
      <div className="relative z-10 mx-auto max-w-4xl">
        <LogoCloud logos={logos} />
      </div>
    </section>
  );
}

// WeeCommerce tech stack (replace placeholder logos with real SVGs)
const logos = [
  { src: "/logos/nextjs.svg", alt: "Next.js" },
  { src: "/logos/supabase.svg", alt: "Supabase" },
  { src: "/logos/openai.svg", alt: "OpenAI" },
  { src: "/logos/n8n.svg", alt: "n8n" },
  { src: "/logos/cloudflare.svg", alt: "Cloudflare" },
  { src: "/logos/hono.svg", alt: "Hono" },
  { src: "/logos/postgresql.svg", alt: "PostgreSQL" },
  { src: "/logos/redis.svg", alt: "Redis" },
];
```

### 10.3 Dependencies (Hero)

Required sub-components to copy into `components/ui/`:

| Component | Source | Purpose |
|---|---|---|
| `logo-cloud-3` | efferd/21st.dev | Animated infinite logo scroll |
| `infinite-slider` | ibelick/21st.dev | Framer Motion-based infinite carousel |
| `button` (extended) | Shadcn base | Pill CTA with teal accent variant |
| `menu-toggle-icon` | sshahaider/21st.dev | Mobile hamburger (animated) |
| `use-scroll` | sshahaider/21st.dev | Sticky nav state hook |

**NPM deps:** `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`, `framer-motion`, `react-use-measure`.

### 10.4 Hero Copy Variants (A/B ready)

| Variant | Headline | Subhead |
|---|---|---|
| Primary (default) | "Built to convert. Wired to learn." | "We build the store. AI runs it." |
| ID market | "Toko online lo harusnya kerja keras, bukan lo." | "Lengkap dengan AI yang handle CS, otomasi operasional, dan sistem yang scale bareng bisnis lo." |
| Intl market | "Your e-commerce should work for you." | "Custom e-commerce with AI chatbot, RAG, and automation. Built to last." |

Switch via `?variant=id` query or geo-detect (Phase 2 client portal).

---

## 11. Pricing Section (Bento)

Reference implementation: **efferd/bento-pricing** (21st.dev). Bento grid for the 4 tiers with CONVERT as featured card.

### 11.1 Bento Layout (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│                  Choose your tier                        │
│           (display-lg, centered, Space Grotesk)          │
├──────────────┬──────────────────────┬───────────────────┤
│              │                      │                    │
│   LAUNCH     │  ★ CONVERT           │   SCALE            │
│              │  (featured, 2x wide) │                    │
│  Rp 15–25jt  │  Rp 38–55jt          │   Rp 70–120jt      │
│  $2,500–4k   │  $6–9k               │   $11–20k          │
│              │  ┌────────────────┐  │                    │
│  Platform    │  │ AI Chatbot     │  │  Full system       │
│  only        │  │ RAG            │  │  + Analytics       │
│              │  │ n8n basic      │  │  + Multi-channel   │
│              │  └────────────────┘  │                    │
│  [ Details ] │  [ Get Started → ]   │  [ Details ]       │
│              │                      │                    │
├──────────────┴──────────────────────┴───────────────────┤
│                                                          │
│   INTEGRATE — AI for existing stores                     │
│   Rp 8–40jt / $1,200–6,500 · Modular (full width row)    │
│                                                          │
└─────────────────────────────────────────────────────────┘

[IDR ⇄ USD] toggle pill (top right)
```

### 11.2 Featured Card (CONVERT)

- **Surface:** `--color-surface-2` (one step above others).
- **Border:** `1px solid var(--color-accent-soft)` (subtle teal halo).
- **Badge:** `★ Most Popular` — pill, `bg-primary text-primary-foreground`, top-right corner.
- **CTA:** `button-primary` (white pill), other tiers use `button-outline`.
- **Scale:** Slightly larger (1.05× on desktop) to emphasize.

### 11.3 Tier Card Anatomy

```
┌─────────────────────────────┐
│  LAUNCH          (tier name,│
│                    display-md)│
│  Platform only    (caption, │
│                    muted)   │
│                              │
│  Rp 15–25 juta               │
│  $2,500–$4,000               │
│  (mono-metric, JetBrains)   │
│                              │
│  ─────────────────────       │
│                              │
│  ✓ Custom storefront         │
│  ✓ Payment gateway           │
│  ✓ Admin dashboard           │
│  ✓ Mobile responsive         │
│  ✗ AI Chatbot                │
│  ✗ RAG Knowledge Base        │
│  (body-sm, check/x icons)    │
│                              │
│  4–6 weeks                   │
│                              │
│  [ View Details → ]          │
│  (button-outline, full width)│
└─────────────────────────────┘
```

### 11.4 Pricing Card Component

```tsx
// apps/web/components/ui/pricing-card.tsx
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  tier: {
    name: string;
    tagline: string;
    priceIdrDisplay: string;
    priceUsdDisplay: string;
    timelineWeeksDisplay: string;
    features: { feature: string; isIncluded: boolean }[];
  };
  currency: 'idr' | 'usd';
  featured?: boolean;
}

export function PricingCard({ tier, currency, featured }: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl p-5",
        featured
          ? "bg-card-foreground/5 border border-primary/30 shadow-card lg:scale-[1.03]"
          : "bg-card border border-border"
      )}
    >
      {featured && (
        <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          ★ Most Popular
        </span>
      )}

      <div className="mb-4">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{tier.name}</h3>
        <p className="text-sm text-muted-foreground">{tier.tagline}</p>
      </div>

      <div className="mb-4 font-mono">
        <div className="text-2xl font-medium">
          {currency === 'idr' ? tier.priceIdrDisplay : tier.priceUsdDisplay}
        </div>
        <div className="text-xs text-muted-foreground">{tier.timelineWeeksDisplay}</div>
      </div>

      <ul className="mb-6 space-y-2 text-sm">
        {tier.features.map((f) => (
          <li key={f.feature} className="flex items-start gap-2">
            {f.isIncluded ? (
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            ) : (
              <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
            )}
            <span className={f.isIncluded ? "" : "text-muted-foreground/70 line-through"}>
              {f.feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={featured ? "default" : "outline"}
        className="mt-auto w-full"
      >
        {featured ? "Get Started →" : "View Details"}
      </Button>
    </div>
  );
}
```

### 11.5 Currency Toggle

```tsx
const [currency, setCurrency] = useState<'idr' | 'usd'>('idr');

<div className="inline-flex rounded-full bg-card p-1">
  <button
    onClick={() => setCurrency('idr')}
    className={cn(
      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
      currency === 'idr' ? "bg-card-foreground/10 text-foreground" : "text-muted-foreground"
    )}
  >
    IDR
  </button>
  <button
    onClick={() => setCurrency('usd')}
    className={cn(
      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
      currency === 'usd' ? "bg-card-foreground/10 text-foreground" : "text-muted-foreground"
    )}
  >
    USD
  </button>
</div>
```

---

## 12. Logo Wordmark

Per Brand Blueprint §D.

### 12.1 Spec

- **Wordmark:** `WeeCommerce` or `Wee·Commerce` or `Wee/Commerce`.
- **Font:** Space Grotesk 600, letter-spacing `-0.02em`.
- **Separator** (`·` or `/`): in teal `--color-accent`. Portable to a future brand rename.
- **Wordmark color:** `--color-text` (off-white on dark, dark on light).

### 12.2 Implementation

```tsx
// apps/web/components/wordmark.tsx
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-display font-semibold tracking-tight ${className}`}>
      Wee<span className="text-primary">·</span>Commerce
    </span>
  );
}
```

### 12.3 What to Avoid

(Per Brand Blueprint §D)
- ❌ Shopping cart icon
- ❌ Robot/AI icon
- ❌ Hexagon, circuit board
- ❌ Gradient on wordmark
- ❌ Anything literal & cliché

---

## 13. Do's & Don'ts

### Do

- Reserve `--color-text` (white) and `--color-base` (near-black) as the two anchor surfaces.
- Push display-size letter-spacing aggressively negative — `display-xxl` at `-0.04em` is the signature.
- Use `--color-accent` (teal) only for hyperlinks, focus rings, primary CTA fills, signature wordmark dot, Intelligence Grid lines.
- Compose every CTA as a pill (`rounded-full`).
- Keep body Inter Variable. Keep AI/technical content JetBrains Mono.
- Use surface lift (canvas → surface-1 → surface-2) for hierarchy on dark, not opacity changes.
- Use Intelligence Grid sparingly (1–2 locations per page) — it's a signature, not wallpaper.

### Don't

- ❌ **Don't introduce a second accent color.** Teal only. (Brand Blueprint: "Multiple accent colors yang saling competing.")
- ❌ **Don't use dark + purple gradient.** Overused in Indonesia. (Brand Blueprint §D explicit ban.)
- ❌ **Don't use gradient text on headings.** (Brand Blueprint ban.)
- ❌ **Don't use generic illustrations** (robot, shopping cart, globe). (Brand Blueprint ban.)
- ❌ **Don't square off CTAs.** Pill or full circle only.
- ❌ **Don't reduce negative letter-spacing on display "for accessibility."** Reduce the SIZE if needed, keep the percentage.
- ❌ **Don't use gradient backgrounds for whole sections.** Gradients are not used at all in WeeCommerce — Intelligence Grid is the texture device.
- ❌ **Don't combine more than one font for headings.** Space Grotesk only for display.
- ❌ **Don't ship low-opacity body text** that's unreadable when printed. (For docs, use light mode.)

---

## 14. Responsive Behavior

### 14.1 Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile-XS | < 480px | Single column everything, display-xxl → 32px |
| Mobile | 480–767px | Default mobile, display-xxl → 40px |
| Tablet | 768–1023px | Card grids 2-up, nav becomes hamburger |
| Desktop | 1024–1279px | Default desktop layout |
| Wide | ≥ 1280px | Max-width container caps at 1200px |

### 14.2 Display Type Scaling

```css
/* Fluid display via clamp() */
.display-xxl {
  font-size: clamp(2.5rem, 5vw + 1rem, 6rem);  /* 40px → 96px */
  letter-spacing: -0.04em;
}
```

### 14.3 Touch Targets

- Pill buttons: minimum 44px tap height across all viewports.
- Circular icon buttons: 40px desktop → 44px touch viewports.
- Pricing tabs: ≥40px tap height, collapse to horizontal scroll below 768px.

### 14.4 Collapse Strategy

- **Nav:** Horizontal links collapse to hamburger below 768px. Primary CTA stays visible on bar.
- **Card grids:** 2-up desktop → 1-up mobile.
- **Pricing bento:** Featured card loses scale advantage on mobile (all cards equal). INTEGRATE row stacks below tiers.
- **Hero:** Headline scales down, subhead wraps, CTAs stack on narrow screens.

---

## 15. Component Registry

Sources for React component inspiration. Copy-paste pattern: download → adapt to WeeCommerce tokens → place in `apps/web/components/ui/`.

### 15.1 Primary Registries

| Registry | URL | Use For |
|---|---|---|
| **Shadcn/UI** | https://ui.shadcn.com | Base components (Button, Card, Dialog, Input, Select, Table, etc.) — copy-paste, full control |
| **21st.dev** | https://21st.dev | Community components (hero-1, bento-pricing, infinite-slider, etc.) — curated, copy-paste |
| **Kinetics Colorion** | https://kinetics.colorion.co | Animation/motion patterns and references |

### 15.2 Component Integration Workflow

1. **Find component** on registry (e.g., 21st.dev/efferd/bento-pricing).
2. **Copy files** to `apps/web/components/ui/`:
   - Main component: `bento-pricing.tsx`
   - Sub-components: any dependencies (e.g., `infinite-slider.tsx`).
3. **Replace tokens** with WeeCommerce design tokens:
   - Replace any `bg-blue-500`/`bg-violet-*` → `bg-primary` (teal).
   - Replace `font-sans` (if non-Inter) → `font-display` (Space Grotesk) for headings.
   - Replace `rounded-lg` on CTAs → `rounded-full` (pill).
   - Replace any gradient backgrounds → solid `--color-surface` + Intelligence Grid overlay.
4. **Install NPM deps** listed by component.
5. **Test in isolation** at `apps/web/app/_dev/[component]/page.tsx`.
6. **Integrate into page.**

### 15.3 Quality Gate (Before Component Ships)

- [ ] No external brand colors (only teal accent, monochrome otherwise).
- [ ] No gradient backgrounds.
- [ ] CTAs are pills (`rounded-full`).
- [ ] Headings use Space Grotesk.
- [ ] AI/technical elements use JetBrains Mono.
- [ ] Respects dark mode (light mode optional unless for docs).
- [ ] Keyboard accessible (Radix primitives or ARIA).
- [ ] Min 44px touch targets on mobile.
- [ ] No layout shift (CLS-safe, sized images).

### 15.4 Curated Component List (MVP)

Already identified for MVP integration:

| Component | Source | Page Use |
|---|---|---|
| `hero-1` | efferd/21st.dev | Home hero |
| `logo-cloud-3` | efferd/21st.dev | Home logo strip |
| `infinite-slider` | ibelick/21st.dev | Logo cloud animation |
| `header-1` | sshahaider/21st.dev | Top nav (sticky, mobile menu) |
| `menu-toggle-icon` | sshahaider/21st.dev | Mobile hamburger |
| `use-scroll` | sshahaider/21st.dev | Nav scroll state |
| `bento-pricing` | efferd/21st.dev | Pricing page |
| Button, Card, Dialog, Input, etc. | Shadcn/UI base | Everywhere |

---

## Summary

Design system ini provide:

- ✅ **Structural inspiration dari Framer** — dark canvas, surface elevation, pill CTAs, poster-grade display type.
- ✅ **WeeCommerce brand identity** — teal `#2DD4BF` accent, Space Grotesk + Inter + JetBrains Mono, no gradients.
- ✅ **Intelligence Grid signature** — replaces gradient spotlights, structural not ornamental.
- ✅ **Complete token system** — colors, typography, spacing, radius, elevation.
- ✅ **Component specs** — buttons, cards, inputs, pricing tabs, FAQ, nav, footer.
- ✅ **Hero section reference** — `hero-1.tsx` integration with WeeCommerce copy.
- ✅ **Bento pricing reference** — `efferd/bento-pricing` with CONVERT featured.
- ✅ **Component registry workflow** — Shadcn/UI + 21st.dev + Kinetics Colorion.

**Next:** [ROADMAP.md](./ROADMAP.md) untuk MVP vs Phase 2–4 plan.
