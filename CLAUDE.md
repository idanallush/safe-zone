# Facebook Ads Creative Reporter

## Project Description

A professional tool for digital marketing agencies to showcase active ad creatives to clients.

**Core functionality:**
- Connect to multiple clients' Facebook Ad accounts via the Facebook Marketing API
- Display all active creatives with high-quality previews
- Advanced filtering by campaign, ad set, objective, status, placement, and more
- Customizable metrics dashboard — add/remove KPIs for leads, e-commerce, sales, and engagement
- Dropdown selectors for: ad account selection + date range picker
- Export everything to a clean, organized PDF report that includes:
  - Ad copy (primary text, headline, description, CTA)
  - Media preview (image/video thumbnail) and media type (image, video, carousel, collection)
  - Destination URL and landing page
  - Campaign objective
  - Selected performance metrics
- Goal: Let agency owners reflect all live creatives to clients in a few simple clicks

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **API Layer:** Node.js + Express (backend proxy for Facebook API)
- **Facebook Integration:** Facebook Marketing API v21.0
- **PDF Generation:** @react-pdf/renderer (client-side PDF)
- **Date Handling:** date-fns
- **HTTP Client:** Axios
- **Charts (optional):** Recharts

## Project Structure

```
fb-ads-tool/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── pdf/             # PDF template components
│   └── public/
├── server/                  # Node.js backend
│   ├── routes/              # Express routes
│   ├── services/            # Facebook API service
│   ├── middleware/           # Auth, error handling
│   └── utils/               # Server utilities
└── shared/                  # Shared types & constants
```

## Multi-Agent Build Pipeline

**MANDATORY RULE:** Every new build or feature MUST follow this exact agent sequence:

```
planner → ui-builder → integrator → debugger → reviewer
```

### Pipeline Flow:

1. **Planner** (`planner.md`) — Receives the idea/request, asks clarification questions, produces a detailed spec
2. **UI Builder** (`ui-builder.md`) — Receives the spec, builds all UI components, styling, responsive design
3. **Integrator** (`integrator.md`) — Receives UI + spec, connects APIs, tracking, webhooks, third-party services
4. **Debugger** (`debugger.md`) — Scans all code, runs tests, finds and fixes bugs
5. **Reviewer** (`reviewer.md`) — Final QA: code quality, visuals, logic, performance. Writes report and decides if done

### Rules:
- Each agent receives the output/summary of the previous agent and builds on top of it
- Each agent writes a short summary at the end for the next agent in the pipeline
- Never skip an agent — always run the full pipeline
- If the reviewer finds critical issues, the pipeline restarts from the relevant agent

## Key Facebook API Endpoints

- `GET /me/adaccounts` — List all ad accounts
- `GET /{ad-account-id}/ads` — Get ads with filtering
- `GET /{ad-id}/adcreatives` — Get creative details
- `GET /{ad-id}/insights` — Get performance metrics
- `GET /{ad-creative-id}/previews` — Get ad previews

## Available Metrics Categories

### Lead Metrics
- Cost per Lead, Leads, Lead Form Opens, Lead Form Submissions

### E-commerce Metrics
- ROAS, Purchase Value, Purchases, Add to Cart, Initiate Checkout, Cost per Purchase

### Sales Metrics
- Revenue, Conversions, Cost per Conversion, Conversion Rate

### Engagement Metrics
- CTR, CPC, CPM, Impressions, Reach, Frequency, Link Clicks, Post Engagement, Video Views, ThruPlays

## Environment Variables Required

```
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_ACCESS_TOKEN=
PORT=3001
```

## Development Commands

```bash
# Install dependencies
npm install

# Run frontend
cd client && npm run dev

# Run backend
cd server && npm run dev

# Run both (with concurrently)
npm run dev
```
