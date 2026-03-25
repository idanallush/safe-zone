# Idan Alush — UI & Design System Preferences

> Load this file into any Claude project where you build interfaces, apps, dashboards, reports, or any visual output. It contains design rules, technical preferences, and real examples from past projects.

---

## 1. General Design Philosophy

- Clean, minimal, professional. Substance over decoration.
- Whitespace is a design tool — use it generously.
- No visual noise: no unnecessary gradients, glows, shadows, or textures.
- Data should speak for itself. The UI frames it, not competes with it.
- If it looks like a generic AI-generated UI, start over.

---

## 2. Language & Direction

- **Default language:** Hebrew
- **Direction:** RTL (`dir="rtl"` on `<html>`)
- All text aligns right unless explicitly specified otherwise
- Flex containers in RTL: first JSX element appears on the right. Do NOT use `flex-row-reverse` — RTL handles it natively.
- When mixing Hebrew and English (e.g., metric names), keep the layout RTL and let the browser handle bidi.
- English content is fine for code-facing or developer tools.

---

## 3. Typography

### For web apps (React / Next.js):
- **Primary font:** Almoni (Hebrew) — weights: 400, 500, 600, 700
  - Files: `almoni-regular-aaa.otf`, `almoni-medium-aaa.otf`, `almoni-demibold-aaa.otf`, `almoni-bold-aaa.otf`
  - Stored in `public/fonts/`
  - Fallback: `sans-serif`
- **Alternative for quick prototypes:** System fonts — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

### For HTML reports (standalone files):
- **System fonts only** — no Google Fonts, no external resources
- Font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

### For PDFs:
- **Heebo** for Hebrew text (registered via reportlab/pdfkit)
- Ensure RTL rendering with bidi algorithm

### Rules:
- Body text: 14-15px
- Don't over-style headings. Clean hierarchy: size + weight, not color tricks.
- No decorative fonts. Ever.

---

## 4. Color System

### Light theme (default for reports and client-facing tools):

```
Background:       #f7f7f5  (warm off-white)
Card/Surface:     #ffffff
Border:           #e5e5e0
Border Light:     #eeeeea
Text Primary:     #1a1a1a
Text Mid:         #555550
Text Dim:         #8a877f
```

### Functional colors:

```
Green (positive):    #1a7a4c  on  #e8f5ee
Red (negative):      #c0392b  on  #fceaea
Blue (info/links):   #2563a0  on  #e8f0fa
Purple (secondary):  #6d4c9e  on  #f0eaf8
```

### Dark theme (for internal dashboards / app UI):

```
Background:       #0c0f14
Card/Surface:     #151921
Card Border:      rgba(255,255,255,0.04)
Accent Gold:      #c9a96e
Green:            #34d399
Blue:             #60a5fa
Purple:           #a78bfa
Orange:           #fb923c
Text:             #e8e4dd
Text Dim:         #7a7872
Text Mid:         #a8a49d
```

### Rules:
- No brand colors in headers or titles — keep them neutral
- Currency symbols (₪) always visible next to monetary values
- Positive/negative indicators use green/red badges, not just color on text
- No rainbow palettes. Stick to 2-3 accent colors max per view.

---

## 5. Component Patterns

### Cards
- White background, subtle border (`#e5e5e0`), rounded corners (8-12px)
- Comfortable padding: `py-3 px-4` minimum
- Hover: light blue background (`#F0F7FF`) for interactive cards
- Selected state: light background + left border accent (in RTL: right border)

### Metric displays
- Label on top (small, dim color, 11-12px)
- Value below (large, bold, 20-22px)
- Optional badge underneath for % change (green/red background)

### Tables
- Clean, minimal borders
- Row hover for interactivity
- Right-aligned text for Hebrew
- Numbers in a slightly different weight or color for scannability

### Buttons
- Primary: solid fill, rounded (10-14px radius)
- Secondary: border only, no fill
- Don't stack more than 2-3 action buttons in a row

### Dropdowns / Selects
- Open from right side in RTL
- Show secondary info (like account ID) in small gray text below main label
- Comfortable padding per item

---

## 6. Layout Patterns

### Toolbar / Filter bars
- Horizontal flex, items aligned right (RTL native)
- Use `flex-1` on spacer elements (like search input) to push groups apart
- Never use `flex-row-reverse` — RTL handles direction
- Group related controls together with consistent spacing

### Grid layouts
- Use CSS Grid or flex-wrap
- For ad galleries: masonry-style or uniform card grid
- For reports: single column, max-width 760px, centered
- For dashboards: responsive grid, 2-4 columns

### Responsive
- Mobile-first breakpoint at 600px
- Stack everything vertically on mobile
- Reduce padding on mobile (48px → 16px)
- Font sizes can drop 2-4px on mobile

---

## 7. Report-Specific Rules (HTML standalone files)

These are for visual campaign reports sent to clients:

- **Style:** Clean, light, doc-like. Think "Google Doc with a quiet design upgrade."
- **Background:** `#f7f7f5` — never dark mode
- **No JavaScript** — pure HTML + CSS
- **No external resources** — no Google Fonts, no CDN links
- **No charts or interactive elements** — just clean readable content
- **Don't rephrase the user's notes** — keep original text exactly as written
- **Don't skip links** the user provided
- **Currency:** Always show ₪ next to monetary values
- **Structure:** Header → Campaign sections → Budget section → Notes

### Report color patterns:
- Campaign metrics in clean tables with alternating subtle backgrounds
- Positive changes: green badge (`#1a7a4c` on `#e8f5ee`)
- Negative changes: red badge (`#c0392b` on `#fceaea`)
- Info/links: blue (`#2563a0` on `#e8f0fa`)
- Notes/commentary: blockquote style with right border accent

---

## 8. Tech Stack Preferences

### For web apps:
- **React** (Next.js preferred)
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Recharts** for data visualization
- **Lucide React** for icons
- TypeScript

### For standalone tools:
- Single HTML file when possible
- No build step required
- Self-contained CSS

### For artifacts in Claude:
- React with Tailwind
- shadcn/ui components available
- Recharts for charts
- Single-file, no separate CSS/JS

### Deployment:
- **Vercel** (primary)
- **Cloudflare Pages** (for client landing pages)
- **GitHub** for version control

---

## 9. What I Don't Like

- Generic "AI-generated" aesthetics (overly smooth gradients, generic stock-photo vibes)
- Cluttered interfaces with too many elements competing for attention
- Blurry or low-quality images
- Left-aligned Hebrew text
- `flex-row-reverse` hacks instead of proper RTL
- Google Fonts in standalone HTML reports
- Noise textures, excessive shadows, glow effects
- Dark mode for client-facing reports
- Emoji in professional/marketing content
- Em dashes anywhere

---

## 10. Claude.ai-Inspired Theme (Airtable Scan / Finance Tracker)

This is the design system mapped from Claude.ai's interface (March 2026), used as the base for the Finance Tracker app and similar internal tools. It's a warm, minimal, borderline-invisible UI style.

### Core Philosophy
- **Warm neutral base** — not cold white. Background is cream (#F5F4EF), not #FFFFFF.
- **Minimal shadows** — separation is done with borders and background shifts, not shadows.
- **Amber as accent** — brand/interactive color is #D97706 (amber/orange). Used sparingly on links, focus states, and active indicators.
- **Hover = cream fill** — across the entire UI, hover state is background #F5F4EF. No scale, no opacity, no dramatic color changes.
- **No decoration** — no gradients, no noise, no textures, no filled icons. Outline icons only.

### Colors

```
Backgrounds:
  Main:              #F5F4EF   (warm off-white/cream)
  Card/Sidebar:      #FFFFFF   (pure white, for "elevated" elements)
  Hover/Selected:    #F5F4EF   (same as main bg)
  Banner (info):     #FFFBEB   (soft amber tint)

Text:
  Primary:           #1A1A1A   (near-black)
  Secondary:         #6B7280   (medium gray)
  Tertiary:          #9CA3AF   (light gray, placeholders)
  Accent/Links:      #D97706   (amber/orange)

Functional:
  Blue (toggle/progress): #3B82F6
  Green (success):        #16A34A   on #DCFCE7
  Red (danger):           #EF4444
  Border:                 #E5E7EB
  Table row border:       #F0F0EC   (lighter)
  Input border:           #D1D5DB
  Input focus border:     #D97706   (amber)
```

### Border Radius Scale

```
Chat Input (pill):      20px
Menus / Dropdowns:      12px
Cards / Banners:        12px
Buttons:                8px
Settings Inputs:        8px
Sidebar Items:          8px
Menu Items (hover):     6px
Tags / Badges:          4-6px
Toggle:                 12px
Progress Bar:           4px
Avatar:                 50% (circle)
```

### Shadows

```
Menu/Popup:     0 4px 24px rgba(0,0,0,0.12) + border 1px solid #E5E7EB
Chat Input:     0 1px 3px rgba(0,0,0,0.06)
Cards:          border only, no shadow
Everything else: no shadow
```

### Layout

```
Sidebar:                ~240px, white, border-right 1px solid #E5E7EB
Main Content:           flex-grow, centered, cream background
Settings Nav:           ~160-180px text-only nav, no icons
Content Max Width:      ~800-900px
Chat Input Max Width:   ~580px
```

### Spacing

```
Sidebar Padding:        12-16px
Sidebar Item:           8px 12px, gap 2-4px between
Settings Section Gap:   32-40px
Settings Row Gap:       16-24px
Button Padding:         8px 16px (outline), 8px 20px (primary)
Menu Item:              8px 12px
Card Padding:           16-20px
```

### Component Specs

**Buttons (4 styles):**
- Outline (default): bg white, border #D1D5DB, text #1A1A1A, radius 8px
- Danger: bg #EF4444, no border, text white, radius 8px
- Text Link: transparent, text #D97706, no border
- Status: transparent, text #16A34A (green), no border

**Toggles:**
- 44px wide, 24px tall, radius 12px
- On: bg #3B82F6, Off: bg #D1D5DB
- White circle 20px inside, transition 200ms

**Progress Bars:**
- Track: #E5E7EB, 8px tall, radius 4px
- Fill: #3B82F6, radius 4px
- Label right-aligned: "41% used"

**Sidebar Navigation:**
- White bg, outline icons ~18px, text 14px
- Active: bg #F5F4EF, font-weight 500
- Recents section: header in #9CA3AF uppercase 11px

**Settings Navigation:**
- Text-only (no icons), ~160px wide
- Active: bg #F5F4EF, font-weight 600, radius 8px
- Items: General, Account, Privacy, Billing, Usage, Capabilities, Connectors

**Connectors List:**
- Brand icon 32-36px + name bold + subtitle "Interactive" + "Configure" button or "Connected" green status
- Divider between rows

**Tables:**
- Header: 13px, weight 600, color #6B7280, border-bottom #E5E7EB
- Rows: 14px, padding 12-16px, border-bottom #F0F0EC
- Three-dot menu (⋯) at row end

**Icons:**
- Outline style, stroke 1.5-2px, size 18-20px
- Default color: #6B7280, active: #1A1A1A
- Library: Lucide or Heroicons outline

### Interaction States

```
Sidebar Item:     default transparent → hover #F5F4EF → active #F5F4EF + weight 500
Menu Item:        default transparent → hover #F5F4EF radius 6px
Outline Button:   default white → hover #F9F9F7 → focus border amber
Text Link:        default #D97706 → hover underline
Chat Input:       default border #D1D5DB → focus border amber + stronger shadow
Toggle:           off #D1D5DB → on #3B82F6 (slide animation)
```

---

## 11. Examples from Past Projects

### fb-ads-tool (React / Next.js)
- Facebook Ads creative display + PDF export
- Dark-ish UI for internal use, card-based ad gallery
- Almoni font, full RTL Hebrew
- Masonry grid for ad cards with full-quality images
- Filter chips: All, Images, Videos, Carousels, Active, Paused
- Metric badges on each card
- PDF export with Heebo font for Hebrew support

### Visual campaign reports (HTML)
- Light background (#f7f7f5), system fonts
- Clean metric tables per campaign
- Budget progress bars
- Green/red badges for performance changes
- Max-width 760px, centered layout
- Mobile responsive at 600px breakpoint

### Budget Pacing Tool (planned)
- Dashboard with client overview table
- Per-client detail: cumulative spend chart with ideal pace line
- Color scheme: green (#27AE60), yellow (#F39C12), red (#E74C3C)
- Auto-refresh every 15 minutes

### Finance Tracker / Airtable Scan (Next.js on Vercel)
- Claude.ai-inspired warm neutral theme (#F5F4EF base)
- Sidebar navigation, settings pages, connectors list
- Amber accent (#D97706) for links and focus states
- Outline icons only, no shadows on cards
- Hover = cream fill everywhere
- Deployed at finance-tracker-roan-eight.vercel.app

### Expense Tracker (React artifact)
- Hebrew UI, RTL
- Category-based pie charts
- Budget progress indicators
- Clean card-based dashboard inspired by Rise Up

---

## 12. How to Use This File

1. **In a Claude Project:** Upload as a project file or paste into Project Instructions
2. **In Claude Code:** Place in project root as `DESIGN_SYSTEM.md` and reference in `CLAUDE.md`
3. **For one-off conversations:** Paste the relevant sections

When starting any new UI project, Claude should read this file first and apply these preferences automatically without asking.

---

*Last updated: March 2026*
