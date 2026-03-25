# Global Preferences — Idan Allush

## Language & Communication
- Always communicate with me in **Hebrew** (עברית)
- Code, variable names, comments, and commit messages — in **English**
- Keep explanations concise and practical — skip unnecessary theory

## About Me
- Digital marketing professional — I build landing pages, ad tools, reporting dashboards, and client-facing web apps
- I work with Facebook/Meta Ads, Google Ads, and analytics platforms
- My clients are mostly Israeli businesses — **Hebrew RTL support is critical**

## Tech Stack Preferences
Choose per project, but default to:
- **Frontend:** React 18 + TypeScript + Vite (or Next.js when SSR/SEO is needed)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (for complex state) or React hooks (for simple state)
- **Backend:** Node.js + Express or Supabase (Edge Functions + PostgreSQL)
- **Animations:** Framer Motion (motion)
- **Deployment:** Vercel or Netlify
- **Database:** Supabase (PostgreSQL)
- **PDF:** @react-pdf/renderer (client-side)

---

## Design System

### General Philosophy
- Clean, minimal, professional. Substance over decoration.
- Whitespace is a design tool — use it generously.
- No visual noise: no unnecessary gradients, glows, shadows, or textures.
- Data should speak for itself. The UI frames it, not competes with it.
- If it looks like a generic AI-generated UI, start over.

### Language & Direction
- **Default language:** Hebrew
- **Direction:** RTL (`dir="rtl"` on `<html>`)
- All text aligns right unless explicitly specified otherwise
- Flex containers in RTL: first JSX element appears on the right. Do NOT use `flex-row-reverse` — RTL handles it natively.
- When mixing Hebrew and English, keep the layout RTL and let the browser handle bidi.

### Typography
**Web apps:** Almoni (Hebrew) — weights 400, 500, 600, 700. Files in `public/fonts/`. Fallback: `sans-serif`
**Quick prototypes:** System fonts — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
**HTML reports:** System fonts only — no Google Fonts, no external resources
**PDFs:** Heebo for Hebrew text (registered via reportlab/pdfkit)
**Rules:** Body text 14-15px. Clean heading hierarchy with size + weight only. No decorative fonts.

### Color System — Light Theme (default for reports & client-facing)
```
Background:       #f7f7f5  (warm off-white)
Card/Surface:     #ffffff
Border:           #e5e5e0
Border Light:     #eeeeea
Text Primary:     #1a1a1a
Text Mid:         #555550
Text Dim:         #8a877f
```

### Color System — Functional Colors
```
Green (positive):    #1a7a4c  on  #e8f5ee
Red (negative):      #c0392b  on  #fceaea
Blue (info/links):   #2563a0  on  #e8f0fa
Purple (secondary):  #6d4c9e  on  #f0eaf8
```

### Color System — Dark Theme (for internal dashboards / app UI)
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

### Color System — Claude.ai-Inspired Warm Theme (for finance/internal tools)
```
Main Background:   #F5F4EF  (warm cream)
Card/Sidebar:      #FFFFFF
Hover/Selected:    #F5F4EF
Accent/Links:      #D97706  (amber)
Border:            #E5E7EB
Input focus:       #D97706
```

### Color Rules
- No brand colors in headers or titles — keep neutral
- Currency symbols (₪) always visible next to monetary values
- Positive/negative indicators use green/red badges, not just color on text
- Stick to 2-3 accent colors max per view

### Component Patterns

**Cards:** White bg, subtle border (#e5e5e0), rounded 8-12px, padding py-3 px-4 min. Hover: #F0F7FF. Selected: light bg + right border accent (RTL).

**Metric displays:** Label on top (small, dim, 11-12px). Value below (large, bold, 20-22px). Optional badge for % change (green/red bg).

**Tables:** Clean minimal borders, row hover, right-aligned Hebrew text, numbers in different weight for scannability.

**Buttons:** Primary = solid fill, rounded 10-14px. Secondary = border only. Max 2-3 action buttons in a row.

**Dropdowns:** Open from right side (RTL). Show secondary info in small gray text. Comfortable padding.

### Layout Patterns
- **Toolbar/Filters:** Horizontal flex, RTL native. Use flex-1 spacers. Never `flex-row-reverse`.
- **Grids:** CSS Grid or flex-wrap. Dashboards: 2-4 columns. Reports: single column, max-width 760px.
- **Responsive:** Mobile-first at 600px. Stack vertically on mobile. Reduce padding (48px → 16px). Font sizes drop 2-4px.

### Report-Specific Rules (HTML standalone)
- Clean, light, doc-like. Think "Google Doc with a quiet design upgrade."
- Background: #f7f7f5 — never dark mode
- No JavaScript — pure HTML + CSS
- No external resources — no Google Fonts, no CDN links
- Don't rephrase user's notes — keep original text exactly
- Currency: always show ₪ next to monetary values
- Structure: Header → Campaign sections → Budget section → Notes

---

## UI Component Preferences
- Use **shadcn/ui** components as the base — customize from there
- Use **21st.dev Magic** (MCP) for component inspiration and building
- Icons: Lucide React (outline style, stroke 1.5-2px, 18-20px)
- Charts: Recharts
- Tables: TanStack Table when needed

## Code Standards
- TypeScript strict mode — always
- Functional components with hooks — no class components
- Named exports over default exports
- Organize by feature, not by type (e.g., `features/dashboard/` not `components/`, `hooks/`, `utils/`)
- Keep components under 150 lines — extract when they grow
- Use `const` arrow functions for components
- Error boundaries for production apps

## Project Structure (Default)
```
project-name/
├── src/
│   ├── features/        # Feature-based modules
│   ├── components/      # Shared/reusable components
│   ├── hooks/           # Shared custom hooks
│   ├── lib/             # Utilities, API clients, helpers
│   ├── types/           # Global TypeScript types
│   └── styles/          # Global styles, Tailwind config
├── public/
│   └── fonts/           # Almoni font files
├── .env.example
├── CLAUDE.md            # Project-specific instructions
└── package.json
```

## Build Pipeline (For Complex Features)
Follow this agent sequence for any major feature:
1. **Plan** — Understand requirements, ask questions, write a brief spec
2. **Build UI** — Components, layout, styling, responsive
3. **Integrate** — APIs, data, state management, third-party services
4. **Debug** — Test, find bugs, fix edge cases
5. **Review** — Final QA, performance, accessibility

## Deployment Preferences
- **Vercel** for Next.js projects
- **Netlify** for static/Vite projects
- **Cloudflare Pages** for client landing pages
- **Supabase** for backend/database
- Always set up environment variables properly — never hardcode secrets
- Use preview deployments for testing before production

## Available Tools (MCP Servers)
I have these connected — use them when relevant:
- **Magic (21st.dev)** — UI component building, inspiration, and refinement
- **Figma** — Design references, screenshots, design system, code connect
- **Vercel** — Deployment, project management, logs, domains
- **Netlify** — Alternative deployment and project management
- **Supabase** — Database, SQL, Edge Functions, migrations
- **Canva** — Design assets, brand kits, templates

## Installed Skills
These skills are available in my Claude Code setup:
- **ui-ux-pro-max-skill** — Advanced UI/UX building patterns and best practices
- **hebrew-tailwind-preset** — Tailwind CSS v4 configured for Hebrew RTL
- **visual-report** — HTML report generation from campaign data

## Installed Packages (Global)
- **motion** (framer-motion v12) — animations and transitions for React

## What I Don't Like
- Generic "AI-generated" aesthetics (overly smooth gradients, stock-photo vibes)
- Cluttered interfaces with too many elements competing for attention
- Left-aligned Hebrew text
- `flex-row-reverse` hacks instead of proper RTL
- Google Fonts in standalone HTML reports
- Noise textures, excessive shadows, glow effects
- Dark mode for client-facing reports
- Emoji in professional/marketing content
- Blurry or low-quality images

## Thinking & Execution Mode
- **Ultrathink** — always use extended thinking / deep reasoning before acting
- **Use sub-agents** when the task is complex — break it into parallel or sequential agents for planning, building, debugging, and reviewing
- **ALWAYS research before implementing** — before making any change, search for the latest best practices and newest documentation. Only implement if you are 100% sure it will work. Do not guess or use outdated patterns.

## Important Rules
- **Never skip RTL** — if content is in Hebrew, it must be RTL
- **Always mobile-first** — design for mobile, then scale up
- **Ask before deleting** — never remove files without confirmation
- **Git commits in English** — short, descriptive messages
- **Show progress** — use todo lists for multi-step tasks
- **Test visually** — always check the result looks right, not just that code compiles
- **Read DESIGN_SYSTEM.md** — for any UI project, load the full design system file first

## Workflow for Claude Code Prompts
When sending me a prompt to paste into Claude Code, always structure it like this:
1. **Start:** "Read CLAUDE.md and DESIGN_SYSTEM.md first"
2. **Task:** The actual implementation instructions
3. **End:** "Verify everything works (no errors, no warnings), then build and deploy"

*Last updated: March 2026*
