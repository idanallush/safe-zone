# Facebook Ads Reporter — Full Product Specification

**Version:** 1.0
**Date:** 2026-03-07
**Status:** Final — Ready for Implementation

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Stories](#2-user-stories)
3. [UI/UX Design](#3-uiux-design)
4. [Data Model](#4-data-model)
5. [Business Logic](#5-business-logic)
6. [API Integration](#6-api-integration)
7. [Components to Build](#7-components-to-build)
8. [Edge Cases](#8-edge-cases)
9. [Acceptance Criteria](#9-acceptance-criteria)
10. [Handoff to UI Builder](#10-handoff-to-ui-builder)

---

## 1. Overview

### 1.1 Product Summary

Facebook Ads Reporter is an internal web application used exclusively by agency employees. It allows users to authenticate via Facebook, connect to one or more Facebook Ad Accounts, view all ads from those accounts in a unified library-style interface, filter and sort by various parameters, and export filtered results as professionally formatted PDF reports.

The tool is not a public SaaS product. It is a private internal tool. There is no payment, no onboarding flow, no marketing pages.

### 1.2 Core Goals

- Provide a full Facebook Ad Library-style view of all ads across connected ad accounts.
- Allow fast filtering, sorting, and searching of ads.
- Enable one-click PDF export of any filtered view.
- Persist user preferences and report history across sessions.
- Handle Facebook API complexity (token management, pagination, media types, errors) transparently.

### 1.3 Tech Stack

- **Frontend:** React (Next.js App Router), TypeScript
- **UI Components:** shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Authentication:** Facebook OAuth (Login with Facebook)
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** SQLite via Prisma (local persistence for single-user; migration path to PostgreSQL for multi-user)
- **PDF Generation:** react-pdf or Puppeteer (server-side rendering to PDF)
- **State Management:** Zustand or React Context + useReducer
- **API:** Facebook Marketing API (Graph API v21.0+)

### 1.4 Scope Boundaries

**In scope:**
- Facebook OAuth login and token management
- Ad account selection and connection
- Ad library view with full filtering/sorting
- PDF export of filtered ad sets
- Report history (saved reports viewable later)
- Session persistence (last selected account, metrics, filters)

**Out of scope:**
- Campaign creation or editing
- Budget management
- Competitor ad library (public ads from other accounts)
- Google Ads or other platforms
- Multi-user role management (designed for future addition, not built now)

---

## 2. User Stories

### Authentication & Setup

**US-001:** As an agency employee, I want to log in with my Facebook account so that I can securely access ad data without managing separate credentials.

**US-002:** As a user, I want to grant additional permissions for ad account access from within Settings so that I can connect my agency's ad accounts after initial login.

**US-003:** As a user, I want to select which ad account(s) I want to view so that I see only relevant data.

**US-004:** As a user, I want my last selected account and preferences to be remembered so that I don't need to reconfigure the tool every session.

### Ad Library View

**US-005:** As a user, I want to see all ads from a selected account on a single scrollable screen so that I get a complete overview without navigating between pages.

**US-006:** As a user, I want to see only ACTIVE ads by default so that I focus on what is currently running.

**US-007:** As a user, I want a toggle to also include PAUSED ads so that I can review ads that are not currently running.

**US-008:** As a user, I want to filter ads by date range (default: Last 7 days) so that I see performance for the relevant period.

**US-009:** As a user, I want to sort and filter ads by metrics (spend, impressions, clicks, CTR, CPM, CPC, conversions, ROAS) so that I can identify top and bottom performers.

**US-010:** As a user, I want to search ads by name or copy text so that I can find a specific ad quickly.

### Ad Creative Viewing

**US-011:** As a user, I want to see image ads with their full creative inline so that I can review visuals without leaving the app.

**US-012:** As a user, I want to see video ads with a thumbnail and a link to view the video so that I can access video content.

**US-013:** As a user, I want to see carousel ads with ALL cards displayed so that I understand the full creative sequence.

**US-014:** As a user, I want to see the ad copy, headline, and description for every ad so that I can review the full messaging.

**US-015:** As a user, I want ads with no media to show a clear label indicating text-only so that I understand why there is no creative shown.

### Metrics

**US-016:** As a user, I want to see performance metrics calculated for my selected date range so that numbers are accurate to my filter.

**US-017:** As a user, I want to choose which metrics are displayed so that my view is not cluttered with irrelevant data.

**US-018:** As a user, I want my selected metrics configuration to be saved between sessions.

### PDF Export

**US-019:** As a user, I want to export a PDF of exactly the ads currently shown (filtered view) so that I can share a report with clients or colleagues.

**US-020:** As a user, I want the exported PDF to show the ad creative, copy, headlines, and a link to view the ad live on Facebook so that the report is self-contained.

**US-021:** As a user, I want the PDF to have a clean, minimalist, professional design so that it is client-presentable.

**US-022:** As a user, I want all generated reports to be saved so that I can access them again later.

### Error Handling

**US-023:** As a user, I want to see a clear error message if the Facebook API fails so that I understand what went wrong.

**US-024:** As a user, I want failed API requests to be automatically retried so that transient errors don't disrupt my workflow.

---

## 3. UI/UX Design

### 3.1 Application Layout

The application uses a persistent sidebar layout with a main content area.

```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixed)    │  MAIN CONTENT AREA (flex-fill)      │
│                           │                                      │
│  [Logo / App Name]        │  [Top Bar: Account Selector +       │
│                           │   Date Range + Search + Export]     │
│  Navigation:              │                                      │
│  - Ad Library             │  [Filter Bar: Status toggle,        │
│  - Reports                │   Metrics filter, Sort]             │
│  - Settings               │                                      │
│                           │  [Ad Grid / List]                   │
│  [Connected Account]      │                                      │
│  [User Avatar + Name]     │  [Footer: total count, pagination   │
│                           │   if needed]                        │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Page: Ad Library (Primary View)

This is the main screen. It is always the default landing page after login.

**Top Bar (sticky, full width):**
- Left: App name/logo (text-based, no heavy branding)
- Center: Account selector dropdown (shows currently selected ad account name; click to switch)
- Right: Date range picker, Search input, Export PDF button

**Filter Bar (below top bar, sticky):**
- Status toggle: "Active only" (default ON) / "Include Paused" (toggle switch)
- Metrics selector: Multi-select dropdown listing all available metrics; user picks which columns to show
- Sort by: Dropdown with metric options + direction (asc/desc)
- Results count: "Showing X ads"

**Ad Grid:**
- Layout: Masonry or fixed-column grid. Recommended: 3-column grid on desktop (1280px+), 2-column on tablet, 1-column on mobile.
- Each cell is an Ad Card (see component spec in Section 7).
- All ads load on one screen. No pagination. Virtualized scrolling if count exceeds 50 to maintain performance.
- Empty state: Centered text block reading: "No active ads found." (plain text, no illustration required)

**Ad Card Design (detailed in Section 7.3):**
```
┌──────────────────────────────────┐
│  [Campaign Name] · [Ad Set Name] │  ← small gray text, top
│  [Ad Name]                       │  ← medium weight
├──────────────────────────────────┤
│                                  │
│  [CREATIVE AREA]                 │  ← image / video thumb /
│  (image, carousel, video, or     │    carousel strip / text label
│   text-only label)               │
│                                  │
├──────────────────────────────────┤
│  [Headline]                      │  ← bold
│  [Primary Text / Copy]           │  ← truncated to 3 lines, expand
│  [Description]                   │  ← small gray
├──────────────────────────────────┤
│  [CTA Button Label]  [View on FB]│  ← CTA shown as badge; View on FB
│                                  │    is external link icon + text
├──────────────────────────────────┤
│  METRICS ROW (selected metrics)  │
│  Spend: $X  |  Impr: X  |  CTR: │
└──────────────────────────────────┘
```

### 3.3 Page: Reports

A simple table/list view of all previously generated PDF reports.

**Columns:** Report Name (auto-generated from account + date range + timestamp), Date Generated, Account, Filters Applied, Action (Download, Delete)

- Clicking "Download" re-downloads the stored PDF file.
- Reports are stored persistently. They do not expire.
- No report generation happens on this page; only browsing history.

### 3.4 Page: Settings

Split into sections:

**Section 1: Facebook Connection**
- Shows current logged-in Facebook user (name, profile picture)
- "Manage Permissions" button: triggers a Facebook re-authentication dialog requesting additional permissions (ads_read, ads_management, read_insights)
- "Disconnect" button: logs out and clears tokens

**Section 2: Connected Ad Accounts**
- List of all ad accounts the user has access to (fetched via API)
- Each row: Account Name, Account ID, Status (ACTIVE / DISABLED), "Set as Default" button
- "Refresh accounts" button to re-fetch from Facebook

**Section 3: Display Preferences**
- Default date range selector (Last 7 days default; options: Last 3 days, Last 7 days, Last 14 days, Last 30 days, Custom)
- Default metrics: multi-select of which metric columns to show by default
- "Save Preferences" button

**Section 4: About**
- App version number
- Link to Facebook API status

### 3.5 Responsive Behavior

- **Desktop (1280px+):** 3-column ad grid, sidebar visible
- **Tablet (768–1279px):** 2-column ad grid, sidebar collapsible
- **Mobile (<768px):** 1-column ad grid, sidebar as drawer

### 3.6 Typography and Color

Use shadcn/ui defaults. No custom brand colors. Rely on the default shadcn/ui neutral palette (zinc-based) with blue as the accent. Light mode only (dark mode not required at this stage).

### 3.7 Loading States

- Initial account load: Full-screen skeleton with shimmer cards (3 columns of placeholder cards)
- Metrics refresh: Inline spinner on each card's metrics row
- PDF generation: Button shows loading spinner with text "Generating PDF..." and is disabled
- API retry in progress: Toast notification: "Connection issue, retrying..." with a loading indicator

### 3.8 Toast Notifications

Use shadcn/ui Toast (Sonner). Position: bottom-right.
- Success: "PDF exported successfully" (green)
- Error: "Failed to load ads: [error message]" (red)
- Info: "Retrying connection..." (neutral)
- Warning: "Token expires in 7 days. Please reconnect in Settings." (amber)

---

## 4. Data Model

### 4.1 Database Schema (Prisma / SQLite)

```prisma
model User {
  id              String        @id @default(cuid())
  facebookId      String        @unique
  name            String
  email           String?
  profilePicture  String?
  accessToken     String        // encrypted at rest
  tokenExpiresAt  DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  settings        UserSettings?
  reports         Report[]
  adAccounts      AdAccount[]
}

model UserSettings {
  id                  String   @id @default(cuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id])
  defaultAccountId    String?
  defaultDateRange    String   @default("LAST_7_DAYS")
  defaultMetrics      String   @default("[\"spend\",\"impressions\",\"clicks\",\"ctr\"]") // JSON array
  includepausedAds    Boolean  @default(false)
  lastSelectedAccount String?
  updatedAt           DateTime @updatedAt
}

model AdAccount {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  facebookAccountId String  // e.g. "act_123456789"
  name            String
  currency        String   @default("USD")
  status          String   // ACTIVE, DISABLED
  isDefault       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Report {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  name            String   // auto-generated display name
  accountId       String
  accountName     String
  dateRangePreset String?  // e.g. "LAST_7_DAYS"
  dateRangeStart  DateTime
  dateRangeEnd    DateTime
  filtersApplied  String   // JSON snapshot of all filters at time of export
  adCount         Int
  filePath        String   // path to stored PDF file on server
  createdAt       DateTime @default(now())
}
```

### 4.2 In-Memory / Client State

Managed via Zustand store:

```typescript
interface AppStore {
  // Auth
  currentUser: User | null;
  accessToken: string | null;

  // Account selection
  selectedAccount: AdAccount | null;
  availableAccounts: AdAccount[];

  // Filters
  dateRange: DateRange;
  includesPaused: boolean;
  selectedMetrics: MetricKey[];
  sortBy: MetricKey | 'name';
  sortDirection: 'asc' | 'desc';
  searchQuery: string;

  // Ads data
  ads: Ad[];
  adsLoading: boolean;
  adsError: string | null;

  // UI state
  exportLoading: boolean;
}
```

### 4.3 Ad Data Type

This represents a single ad as returned and normalized from the Facebook API:

```typescript
interface Ad {
  id: string;                      // Facebook ad ID
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  campaignName: string;
  adSetName: string;
  createdTime: string;
  updatedTime: string;

  // Creative
  creative: AdCreative;

  // Metrics (for selected date range)
  metrics: AdMetrics;

  // Direct Facebook link
  facebookAdLink: string;          // https://www.facebook.com/ads/library/?id=AD_ID
}

interface AdCreative {
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'TEXT_ONLY';

  // For IMAGE
  imageUrl?: string;
  imageHash?: string;

  // For VIDEO
  videoThumbnailUrl?: string;
  videoUrl?: string;               // link to Facebook video

  // For CAROUSEL
  cards?: CarouselCard[];

  // All types
  headline?: string;
  primaryText?: string;
  description?: string;
  callToAction?: string;           // e.g. "LEARN_MORE", "SHOP_NOW"
}

interface CarouselCard {
  index: number;
  imageUrl?: string;
  videoThumbnailUrl?: string;
  headline?: string;
  description?: string;
  linkUrl?: string;
}

interface AdMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;                    // percentage, e.g. 1.23
  cpm: number;
  cpc: number;
  reach: number;
  frequency: number;
  conversions?: number;
  conversionValue?: number;
  roas?: number;
  dateStart: string;
  dateStop: string;
}

type MetricKey = 'spend' | 'impressions' | 'clicks' | 'ctr' | 'cpm' | 'cpc' | 'reach' | 'frequency' | 'conversions' | 'conversionValue' | 'roas';
```

---

## 5. Business Logic

### 5.1 Authentication Flow

1. User clicks "Login with Facebook".
2. Facebook OAuth dialog opens. Requested permissions on first login: `public_profile`, `email`.
3. On success, user record is created or updated in database. Access token is stored encrypted.
4. After login, user is redirected to Settings to add ad account permissions.
5. In Settings, user clicks "Manage Permissions" to trigger a second OAuth request with additional permissions: `ads_read`, `read_insights`, `ads_management`.
6. On success, the stored access token is updated with the extended token.
7. Application exchanges short-lived token for a long-lived token (60-day) using the server-side Graph API endpoint: `GET /oauth/access_token?grant_type=fb_exchange_token`.
8. Token expiry is stored. If token expires within 7 days, show a warning in the UI.

### 5.2 Ad Account Discovery

After extended permissions are granted:
1. Fetch all ad accounts the user has access to: `GET /me/adaccounts?fields=id,name,currency,account_status`.
2. Store all accounts in the `AdAccount` table.
3. If user has a saved default account, pre-select it. Otherwise, prompt user to select one.

### 5.3 Ad Fetching

Fetching ads for a selected account and date range:

**Step 1: Fetch ads with creative data**
```
GET /{account_id}/ads
  ?fields=id,name,status,campaign{name},adset{name},created_time,updated_time,creative{id,name,image_url,image_hash,thumbnail_url,body,title,call_to_action_type,object_story_spec,asset_feed_spec}
  &status=['ACTIVE'] (or ['ACTIVE','PAUSED'] if toggle is on)
  &limit=100
```

**Step 2: Fetch insights for each ad (or batch)**
```
GET /{account_id}/insights
  ?fields=ad_id,spend,impressions,clicks,ctr,cpm,cpc,reach,frequency,actions,action_values,purchase_roas
  &time_range={"since":"YYYY-MM-DD","until":"YYYY-MM-DD"}
  &level=ad
  &limit=100
```

**Step 3: Merge ad creative data with insight data by `ad_id`.**

**Step 4: Apply client-side filters** (status toggle, search query, sort).

**Pagination:** Facebook API returns max 100 results per call. Use cursor-based pagination (`after` cursor) to fetch all pages. Combine all pages before rendering.

### 5.4 Date Range Logic

| Preset | since | until |
|--------|-------|-------|
| Last 3 days | today - 3 | today |
| Last 7 days | today - 7 | today |
| Last 14 days | today - 14 | today |
| Last 30 days | today - 30 | today |
| Custom | user-selected | user-selected |

All dates are in the ad account's timezone (retrieved from account data).

### 5.5 Metrics Calculation

All metrics are returned directly from the Facebook Insights API for the requested date range. No client-side calculation of raw metrics is required except for:
- **ROAS:** If `purchase_roas` is not available, calculate as `conversionValue / spend`. If spend is 0, ROAS = 0.
- **CTR:** Returned as decimal from API (e.g., `0.0123`). Display as percentage: multiply by 100, round to 2 decimal places.

### 5.6 Carousel Ad Handling

For carousel ads, the creative is fetched via `object_story_spec.link_data.child_attachments`. Each child attachment represents one card:
- Extract: image_hash, picture (URL), name (headline), description, link
- Display all cards in order. No limit on card count.
- If a card has no image and no video, show a placeholder with the card's text.

### 5.7 Video Ad Handling

- Fetch `thumbnail_url` from the ad creative.
- Link to the video: construct as `https://www.facebook.com/video/embed?video_id={video_id}` or use the `permalink_url` from the video object if available.
- Display: thumbnail image with a play button overlay (CSS only, not functional — clicking opens the Facebook link).

### 5.8 PDF Export Logic

1. User clicks "Export PDF".
2. Client sends POST request to `/api/export/pdf` with:
   - Current filtered ad IDs list
   - Selected date range
   - Selected account name
   - Current metrics configuration
3. Server fetches the stored ad data (re-use cached/fetched data, do not re-call Facebook API on export).
4. Server renders a PDF using a predefined template (see PDF Template below).
5. PDF is saved to the server filesystem under `/reports/{userId}/{timestamp}-{accountName}.pdf`.
6. A `Report` record is created in the database.
7. PDF is streamed back to the client for immediate download.
8. Toast notification: "PDF exported successfully."

**PDF Template Structure:**
- **Cover page:** Report title ("Facebook Ads Report"), Account Name, Date Range, Generated Date, Total Ads count.
- **Per-ad page(s):** One ad per "block" (not necessarily one per full page; pack efficiently).
  - Ad name, Campaign, Ad Set
  - Creative: full image, OR video thumbnail with "View Video" link, OR all carousel cards, OR "Text-only ad" label
  - Ad copy (full, not truncated)
  - Headline, Description
  - CTA label (as text badge)
  - "View on Facebook" link (rendered as clickable URL in PDF)
  - Metrics table: selected metrics for the date range
- **Summary page (last page):** Aggregate totals — total spend, total impressions, total clicks, average CTR across all exported ads.

### 5.9 Settings Persistence

On any change to:
- Selected ad account
- Date range preset
- Selected metrics
- Include paused toggle

...trigger a PATCH to `/api/settings` to update `UserSettings` in the database. This happens debounced (500ms) to avoid excessive writes.

On application load, fetch user settings from `/api/settings` and hydrate the Zustand store.

### 5.10 Error Handling and Retry Logic

**Retry Strategy:**
- On any API call to `/api/ads` or Facebook Graph API: implement exponential backoff retry.
- Retry attempts: 3 total (initial + 2 retries).
- Delays: 1s, 3s, 9s.
- Retry on: HTTP 429 (rate limit), HTTP 500, HTTP 502, HTTP 503, network timeout.
- Do NOT retry: HTTP 400 (bad request), HTTP 401 (unauthorized — needs re-auth), HTTP 403 (forbidden — permissions issue).

**User Feedback:**
- On first failure: show toast "Connection issue, retrying..."
- On retry success: toast disappears automatically.
- On all retries exhausted: show persistent error banner above the ad grid with message: "Failed to load ads. [Specific error message from API]. [Try Again] button."
- Try Again button re-triggers the full fetch sequence.

---

## 6. API Integration

### 6.1 Facebook Graph API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/oauth/authorize` | GET | Initiate OAuth login |
| `/oauth/access_token` | GET | Exchange code for token; exchange for long-lived token |
| `/me` | GET | Get current user profile |
| `/me/adaccounts` | GET | List all ad accounts |
| `/{account_id}/ads` | GET | Fetch all ads with creative data |
| `/{account_id}/insights` | GET | Fetch performance metrics |
| `/{ad_id}/insights` | GET | Fetch metrics for a single ad |
| `/{creative_id}` | GET | Fetch extended creative details |

### 6.2 Required Facebook App Permissions

| Permission | Purpose |
|------------|---------|
| `public_profile` | Basic user info |
| `email` | User email (optional) |
| `ads_read` | Read ad account structure and creatives |
| `read_insights` | Read performance metrics |
| `ads_management` | Required by some creative fields |

### 6.3 Next.js API Routes

All Facebook API calls are proxied through Next.js API routes. The frontend never calls Facebook directly. This protects the access token.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/facebook` | GET | Initiate Facebook OAuth |
| `/api/auth/callback` | GET | Handle OAuth callback, store token |
| `/api/auth/logout` | POST | Clear session and tokens |
| `/api/auth/permissions` | POST | Request additional ad permissions |
| `/api/settings` | GET / PATCH | Get or update user settings |
| `/api/accounts` | GET | List connected ad accounts |
| `/api/accounts/refresh` | POST | Re-fetch accounts from Facebook |
| `/api/ads` | GET | Fetch ads for account + date range |
| `/api/export/pdf` | POST | Generate and return PDF |
| `/api/reports` | GET | List saved reports |
| `/api/reports/:id` | GET | Download a specific report PDF |
| `/api/reports/:id` | DELETE | Delete a report record and file |

### 6.4 API Route: GET /api/ads

**Query parameters:**
- `accountId` (required): Facebook ad account ID (e.g., `act_123456789`)
- `since` (required): ISO date string
- `until` (required): ISO date string
- `includesPaused` (optional, boolean): default false

**Response:**
```json
{
  "ads": [...],          // Ad[] normalized array
  "totalCount": 84,
  "fetchedAt": "2026-03-07T10:00:00Z"
}
```

**Behavior:**
- Fetches all pages from Facebook (handles cursor pagination internally).
- Merges creative data with insights data.
- Returns fully normalized `Ad[]` array.
- On error, returns `{ "error": { "code": "...", "message": "..." } }`.

### 6.5 Token Management

- Access tokens are stored encrypted in the database using AES-256.
- The encryption key is set via environment variable `TOKEN_ENCRYPTION_KEY`.
- Tokens are never sent to the client. The client only receives a session cookie.
- Server-to-Facebook calls always use the server-side decrypted token.
- If token is expired, the API route returns HTTP 401 with `{ "error": "TOKEN_EXPIRED" }`, which triggers a re-authentication flow on the client.

---

## 7. Components to Build

### 7.1 AppLayout

**File:** `components/layout/AppLayout.tsx`

**Purpose:** Root layout wrapping all authenticated pages. Renders sidebar + main content area.

**Props:**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Behavior:**
- Checks authentication state on mount. If not authenticated, redirects to `/login`.
- Renders `<Sidebar />` on the left and `children` on the right.
- Applies responsive breakpoints (sidebar collapses on tablet/mobile).

---

### 7.2 Sidebar

**File:** `components/layout/Sidebar.tsx`

**Props:** None (reads from global store).

**Renders:**
- App title ("FB Ads Reporter" or similar text logo)
- Navigation links: Ad Library, Reports, Settings (using Next.js `<Link>`, active state highlighted)
- Bottom section: current user avatar (from Facebook profile picture), user name, connected account name

**Behavior:**
- Active link is highlighted using shadcn/ui styling (e.g., background highlight, bold text).
- On mobile, renders as a drawer triggered by a hamburger button in the top bar.

---

### 7.3 AdCard

**File:** `components/ads/AdCard.tsx`

**Props:**
```typescript
interface AdCardProps {
  ad: Ad;
  selectedMetrics: MetricKey[];
}
```

**Renders:**
1. **Header:** Campaign name · Ad Set name (small gray text), Ad Name (semibold)
2. **Creative section** (based on `ad.creative.type`):
   - `IMAGE`: `<img>` tag with full-width image, rounded corners. Lazy loaded.
   - `VIDEO`: `<img>` for thumbnail with a centered play icon overlay. Below: "Watch video" link opens Facebook video URL in new tab.
   - `CAROUSEL`: Horizontal scrollable strip of cards. Each card shows: image (or thumbnail), card headline, card description. Cards are fixed width (e.g., 200px) so they can scroll horizontally.
   - `TEXT_ONLY`: A gray bordered box with centered italic text: "This ad has no media — text only"
3. **Copy section:**
   - Headline (bold, full width)
   - Primary text (truncated to 3 lines with "See more" expand toggle)
   - Description (small, gray)
4. **CTA row:** CTA label shown as a small badge (e.g., "Learn More"). Facebook external link icon + "View on Facebook" as a link (opens Facebook Ads Library URL for this ad in a new tab).
5. **Metrics row:** Horizontal list of metric pills. Each pill: metric label + value. Only selected metrics are shown. Formatted values:
   - Spend: `$1,234.56`
   - Impressions: `12,345`
   - CTR: `1.23%`
   - CPM: `$12.34`
   - CPC: `$0.45`
   - ROAS: `3.2x`

**Behavior:**
- "See more" on primary text: toggles between truncated and full text.
- All images use `loading="lazy"` attribute.
- Card has a subtle border (`border border-zinc-200`), rounded corners, white background, and a hover shadow effect.
- Clicking the card itself does nothing. Only specific links/buttons are interactive.

---

### 7.4 AdGrid

**File:** `components/ads/AdGrid.tsx`

**Props:**
```typescript
interface AdGridProps {
  ads: Ad[];
  loading: boolean;
  selectedMetrics: MetricKey[];
}
```

**Behavior:**
- If `loading` is true: render skeleton grid (12 placeholder cards using shadcn/ui Skeleton component).
- If `ads` is empty (and not loading): render `<EmptyState />`.
- Otherwise: render a CSS grid with auto-fill columns, each `AdCard`.
- Uses `react-window` or CSS `content-visibility: auto` for performance if ad count > 50.

---

### 7.5 EmptyState

**File:** `components/ads/EmptyState.tsx`

**Props:** None.

**Renders:** Centered container with the text: "No active ads found." No icon, no illustration. Plain text using `text-zinc-500` styling.

---

### 7.6 TopBar

**File:** `components/layout/TopBar.tsx`

**Renders:**
- Account selector (`<AccountSelector />`)
- Date range picker (`<DateRangePicker />`)
- Search input (debounced, updates `searchQuery` in store after 300ms)
- Export PDF button (`<ExportButton />`)

---

### 7.7 AccountSelector

**File:** `components/accounts/AccountSelector.tsx`

**Props:**
```typescript
interface AccountSelectorProps {
  accounts: AdAccount[];
  selectedAccount: AdAccount | null;
  onSelect: (account: AdAccount) => void;
}
```

**Renders:** shadcn/ui `Select` or `Combobox` dropdown showing all ad accounts. Displays account name. On selection, fires `onSelect` and triggers full ad reload.

---

### 7.8 DateRangePicker

**File:** `components/filters/DateRangePicker.tsx`

**Props:**
```typescript
interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}
```

**Renders:** shadcn/ui `Popover` containing preset buttons (Last 3 days, Last 7 days, Last 14 days, Last 30 days) and a custom calendar date range picker. On change, fires `onChange` and triggers ad metrics reload.

---

### 7.9 FilterBar

**File:** `components/filters/FilterBar.tsx`

**Renders:**
- Paused toggle: shadcn/ui `Switch` labeled "Include paused ads"
- Metrics selector: shadcn/ui `DropdownMenu` (multi-select) for choosing visible metric columns
- Sort by: shadcn/ui `Select` for sort field + `Button` to toggle asc/desc
- Results count: plain text "Showing X ads"

---

### 7.10 ExportButton

**File:** `components/export/ExportButton.tsx`

**Props:**
```typescript
interface ExportButtonProps {
  adIds: string[];
  disabled: boolean;
}
```

**Behavior:**
- On click: shows confirmation if ad count > 50 ("Export X ads to PDF?"), then fires POST to `/api/export/pdf`.
- Shows loading spinner during generation.
- On success: triggers file download and shows success toast.
- On error: shows error toast with message.
- Button is disabled if `ads` array is empty or `loading` is true.

---

### 7.11 ReportsPage

**File:** `app/reports/page.tsx`

**Renders:** Table of past reports using shadcn/ui `Table`. Columns: Report Name, Date, Account, Date Range, Ad Count, Actions (Download, Delete).

**Behavior:**
- On mount: fetches `/api/reports`.
- Download: GET `/api/reports/:id` returns file stream.
- Delete: DELETE `/api/reports/:id` with confirmation dialog.

---

### 7.12 SettingsPage

**File:** `app/settings/page.tsx`

**Renders:** Divided into sections as described in Section 3.4.

**Behavior:**
- "Manage Permissions" triggers re-OAuth flow via `/api/auth/permissions`.
- "Refresh accounts" triggers POST to `/api/accounts/refresh`.
- All setting changes auto-save via debounced PATCH to `/api/settings`.
- "Disconnect" triggers POST to `/api/auth/logout` and redirects to `/login`.

---

### 7.13 ErrorBanner

**File:** `components/ui/ErrorBanner.tsx`

**Props:**
```typescript
interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}
```

**Renders:** Full-width amber/red banner above the ad grid. Shows error message and a "Try Again" button.

---

### 7.14 LoginPage

**File:** `app/login/page.tsx`

**Renders:** Centered card with: app name, brief one-line description ("Facebook Ads reporting for agencies"), and a "Login with Facebook" button (shadcn/ui Button, blue variant). Clicking initiates OAuth via `/api/auth/facebook`.

---

## 8. Edge Cases

### 8.1 No Ad Accounts Available

User has granted permissions but has no ad accounts. Settings page shows: "No ad accounts found. Make sure you have access to at least one Facebook Ad Account." with a "Refresh" button.

### 8.2 Ad Account is Disabled

If an ad account has `account_status !== 1` (ACTIVE), show a warning badge next to its name in the selector. Fetching ads from a disabled account will return an empty set or an API error; display a specific message: "This account is not active."

### 8.3 Zero Spend Ads in Date Range

An ad may be ACTIVE but have zero spend in the selected date range (e.g., budget exhausted earlier). Show all metrics as 0 or "--". Do not hide these ads unless explicitly filtered.

### 8.4 Ads With No Creative Data

If Facebook returns an ad with no creative fields populated, classify it as `TEXT_ONLY` and show the text-only label in the creative area. Do not throw an error or hide the ad.

### 8.5 Carousel With Only One Card

Treat as carousel type but display the single card without the horizontal scroll UI (show it like a standard image instead).

### 8.6 Very Long Primary Text

Primary text exceeding 500 characters: truncate to 3 lines (CSS `-webkit-line-clamp: 3`). "See more" button expands to full text within the card.

### 8.7 Expired Access Token

If `/api/ads` returns `TOKEN_EXPIRED`:
1. Show full-screen modal: "Your Facebook session has expired. Please reconnect."
2. Single button: "Reconnect with Facebook" — triggers re-OAuth flow.
3. After successful re-auth, automatically retry the pending request.

### 8.8 Facebook API Rate Limiting

Facebook Marketing API has rate limits. If HTTP 429 is received:
- Apply retry with exponential backoff (per Section 5.10).
- Show toast: "Rate limit reached. Retrying in Xs..."
- On repeated 429s: pause 60 seconds before final retry.

### 8.9 Large Number of Ads (>100)

Average is ~100 ads; some accounts may have more. Handle pagination automatically. Show a progress indicator: "Loading ads... (X of Y fetched)" during paginated fetch. After all pages are fetched, render the full grid.

### 8.10 PDF Generation for Large Ad Sets

If exporting more than 50 ads, PDF generation may take >5 seconds. Show a loading modal (not just a button spinner) with text: "Generating PDF, please wait..." to prevent user from navigating away.

### 8.11 Image Load Failures

If an ad image URL fails to load (404, CORS, etc.): show a gray placeholder box with an image-broken icon and the text "Image unavailable."

### 8.12 Missing Metrics Fields

If the Facebook Insights API does not return a specific metric (e.g., `roas` is absent because there are no conversion events configured), display "--" for that metric. Do not show 0 (which implies the metric was tracked but returned zero).

### 8.13 Single-User to Multi-User Migration Path

The current data model uses a `userId` foreign key on all records. To support multi-user in the future:
- Add a `Team` model and a `teamId` foreign key.
- Migrate `AdAccount` ownership from `User` to `Team`.
- The schema is designed to accommodate this without requiring table recreation.

---

## 9. Acceptance Criteria

### AC-001: Authentication
- [ ] User can click "Login with Facebook" and complete OAuth flow.
- [ ] After login, user record is created in the database.
- [ ] User can navigate to Settings and click "Manage Permissions" to grant ad account permissions.
- [ ] Long-lived token is successfully exchanged and stored.
- [ ] User remains logged in across browser sessions (persistent session cookie).

### AC-002: Account Selection
- [ ] After permissions are granted, all accessible ad accounts are listed.
- [ ] User can select an account from the dropdown.
- [ ] Selected account is saved and pre-selected on next session.

### AC-003: Ad Library View
- [ ] All ACTIVE ads from the selected account are displayed on page load.
- [ ] Ads load within 5 seconds for an account with ~100 ads.
- [ ] Each ad card displays: creative, copy, headline, description, CTA, metrics, "View on Facebook" link.
- [ ] Image ads show the actual image.
- [ ] Video ads show the thumbnail with a play icon and a "Watch video" link.
- [ ] Carousel ads show all cards in a horizontal scroll.
- [ ] Text-only ads show the "no media" label.

### AC-004: Filtering and Sorting
- [ ] Default date range is Last 7 days.
- [ ] Changing date range refreshes metrics without reloading creative data.
- [ ] "Include paused ads" toggle adds PAUSED ads to the view.
- [ ] Search by ad name or copy text filters the visible cards in real time.
- [ ] Sorting by any metric reorders cards correctly.
- [ ] Selected metrics determine which metric pills are shown on cards.

### AC-005: Empty State
- [ ] When no active ads match the current filters, the text "No active ads found." is shown.
- [ ] No broken UI elements or errors in the empty state.

### AC-006: PDF Export
- [ ] Export button generates a PDF of the currently filtered ads.
- [ ] PDF includes cover page, per-ad blocks, and summary page.
- [ ] Each ad block in PDF contains: creative (image or thumbnail for video, all cards for carousel, or text-only label), full copy, headline, CTA, "View on Facebook" link, metrics.
- [ ] PDF design is clean and professional (white background, dark text, minimal styling).
- [ ] Generated PDF is saved and appears in the Reports page.
- [ ] PDF file is downloadable from the Reports page.

### AC-007: Reports History
- [ ] Reports page lists all previously generated PDFs.
- [ ] Each report shows: name, date, account, filters, ad count.
- [ ] Clicking download re-downloads the original PDF.

### AC-008: Settings Persistence
- [ ] Selected metrics are saved between sessions.
- [ ] Last selected account is restored on next session.
- [ ] Default date range setting is applied on load.

### AC-009: Error Handling
- [ ] API failures show a clear error message above the ad grid.
- [ ] "Try Again" button retries the request.
- [ ] Automatic retry with exponential backoff is attempted before showing the error banner.
- [ ] Expired token shows a re-authentication modal, not a raw error.

### AC-010: Performance
- [ ] Ad grid with 100 cards renders without layout jank.
- [ ] Virtualized scrolling is enabled for grids with more than 50 cards.
- [ ] Images are lazy loaded.
- [ ] Switching between accounts does not show stale data.

---

## 10. Handoff to UI Builder

### 10.1 What to Build First (Priority Order)

1. **Project Setup:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui init, Prisma with SQLite.
2. **Login Page:** Simple centered card with Facebook login button. OAuth flow (mock the callback for now if Facebook app is not yet configured).
3. **AppLayout + Sidebar:** Shell of the authenticated app.
4. **Ad Library Page (static data first):** Build the page using hardcoded mock ad data to validate the UI before connecting the API.
5. **AdCard Component:** Most complex component — build all four creative types (image, video, carousel, text-only).
6. **FilterBar and TopBar:** Filtering and sorting logic against mock data.
7. **API Integration:** Connect real Facebook API routes once UI is validated.
8. **PDF Export:** Build last as it requires all ad data to be correct first.
9. **Reports Page and Settings Page.**

### 10.2 shadcn/ui Components Required

Install these shadcn/ui components:
- `button`
- `card`
- `select`
- `dropdown-menu`
- `popover`
- `calendar`
- `switch`
- `input`
- `separator`
- `skeleton`
- `toast` (use Sonner)
- `dialog`
- `table`
- `badge`
- `avatar`
- `sheet` (for mobile sidebar drawer)

### 10.3 File/Folder Structure

```
app/
  (auth)/
    login/
      page.tsx
  (dashboard)/
    layout.tsx            ← AppLayout
    page.tsx              ← redirect to /ads
    ads/
      page.tsx            ← Ad Library
    reports/
      page.tsx            ← Reports History
    settings/
      page.tsx            ← Settings
  api/
    auth/
      facebook/route.ts
      callback/route.ts
      logout/route.ts
      permissions/route.ts
    settings/route.ts
    accounts/
      route.ts
      refresh/route.ts
    ads/route.ts
    export/
      pdf/route.ts
    reports/
      route.ts
      [id]/route.ts

components/
  layout/
    AppLayout.tsx
    Sidebar.tsx
    TopBar.tsx
  ads/
    AdCard.tsx
    AdGrid.tsx
    EmptyState.tsx
    creatives/
      ImageCreative.tsx
      VideoCreative.tsx
      CarouselCreative.tsx
      TextOnlyCreative.tsx
  accounts/
    AccountSelector.tsx
  filters/
    FilterBar.tsx
    DateRangePicker.tsx
    MetricsSelector.tsx
    SortControl.tsx
  export/
    ExportButton.tsx
  ui/
    ErrorBanner.tsx

lib/
  facebook/
    api.ts               ← Facebook API client
    auth.ts              ← Token management
    normalizers.ts       ← Transform API responses to Ad type
  pdf/
    template.tsx         ← React-PDF template
    generator.ts         ← Server-side PDF generation
  store/
    useAppStore.ts       ← Zustand store
  db/
    client.ts            ← Prisma client singleton
  utils/
    formatters.ts        ← Metric formatting helpers
    retry.ts             ← Retry with backoff

prisma/
  schema.prisma
  migrations/

public/
  (static assets if any)
```

### 10.4 Environment Variables Required

```bash
# Facebook App
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Encryption
TOKEN_ENCRYPTION_KEY=   # 32-byte hex string for AES-256

# Database
DATABASE_URL=file:./dev.db

# Next.js
NEXTAUTH_SECRET=        # if using NextAuth, otherwise a custom session secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 10.5 Key Implementation Notes for UI Builder

1. **No custom colors.** Use only shadcn/ui defaults. Do not add any hex color values to the code that are not already in the shadcn/ui palette.

2. **The Ad Library is the core screen.** Spend the most time making AdCard pixel-perfect. It will appear in both the app and the PDF.

3. **All metrics are formatted on the client side** using the helpers in `lib/utils/formatters.ts`. Never display raw API decimal values.

4. **PDF and UI share the same data structure (Ad[]).** The PDF template can import and reuse parts of AdCard's logic (not the React component directly, but the same data fields).

5. **Do not implement real-time updates.** Data is fetched on load and on explicit user actions (account change, date range change, retry). No polling or WebSockets needed.

6. **Test with mock data.** Create a file `lib/mocks/ads.ts` with 10-15 mock `Ad` objects covering all creative types. Use this for local development before connecting the API.

7. **Carousel horizontal scroll** should use `overflow-x: auto` with `scroll-snap-type: x mandatory` on the container and `scroll-snap-align: start` on each card. Do not use a carousel library.

8. **The "View on Facebook" link** for each ad should be: `https://www.facebook.com/ads/library/?id={ad.id}`. This is the standard Facebook Ad Library URL format.

9. **Lazy loading:** Add `loading="lazy"` and `decoding="async"` to all `<img>` tags in ad creatives. For the PDF, images must be pre-fetched and embedded as base64.

10. **Accessibility:** All interactive elements (buttons, links, toggles) must have proper `aria-label` attributes. Cards are not focusable as a whole — only the internal links/buttons are.

---

*End of Specification. This document is the source of truth for all implementation decisions. Any ambiguity should default to the simplest implementation that satisfies the acceptance criteria.*
