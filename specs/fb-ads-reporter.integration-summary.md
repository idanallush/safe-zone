# FB Ads Reporter — Integration Summary

**Handoff to: Debugger**
**Date: 2026-03-07**
**Integrator pass complete.**

---

## What Was Done

### 1. Facebook API Integration Layer (`src/lib/facebook/`)

All five modules were reviewed and are solid. The following was changed:

**`ads.ts`** — Extended to support configurable status filtering.
- Added `fetchAds(accountId, accessToken, options)` as the primary function.
  - `options.effectiveStatuses` accepts any array of Facebook ad statuses (e.g. `["ACTIVE", "PAUSED"]`).
  - `options.maxPages` controls pagination depth.
- Kept `fetchActiveAds` as a deprecated convenience wrapper that calls `fetchAds` with `["ACTIVE"]`.

No changes were needed to `client.ts`, `accounts.ts`, `insights.ts`, or `creatives.ts` — they were already well-implemented with retry logic, exponential backoff, batch requests, and correct data normalization.

---

### 2. PDF Export (`src/lib/pdf/`)

**`quick-template.tsx`** — Rewrote for proper multi-page support:
- Split into sub-components `TableHeaderRow` and `AdRow`.
- Page header and table header are wrapped in `<View fixed>` so they repeat on every generated page.
- Footer is `fixed` as well.
- Table rows use `wrap={false}` per row so each row stays together, but the table itself flows across pages naturally.
- Added `truncate()` helper so very long ad copy doesn't overflow cells.

**`client-template.tsx`** — Rewrote for proper multi-page support:
- Content `<Page>` now uses `wrap` so cards flow across pages.
- Page header and footer are `fixed` and repeat on every page.
- Each `<AdCard>` uses `wrap={false}` to keep the card together.
- Improved visual polish: consistent padding, `textTransform: "uppercase"` labels, better spacing.
- Cover page retained as-is.

**`generator.ts`** — No changes required. Already fetches media in parallel batches and converts to base64.

---

### 3. Report Persistence (`src/lib/reports/storage.ts` — new file)

Implemented file-based report storage. No database required.

**Storage layout:**
```
<REPORTS_DIR>/          # default: .reports/ in project root
  reports.json          # JSON index of all report metadata
  <uuid>.pdf            # one PDF file per saved report
```

**Public API:**
| Function | Description |
|----------|-------------|
| `listReports()` | Returns all reports, newest first |
| `getReport(id)` | Returns a single record or null |
| `saveReport(meta, pdfBuffer)` | Writes PDF to disk + updates index |
| `readReportPdf(record)` | Reads PDF bytes from disk |
| `deleteReport(id)` | Removes record + deletes PDF file |

**Configuration:** Set `REPORTS_DIR` env var to override the default path.

---

### 4. API Routes Updated

#### `POST /api/pdf/quick`
- Now uses `isAuthenticated()` instead of raw `session.accessToken` check — works in dev mock mode.
- Saves the generated PDF via `saveReport()` before streaming the response.
- Accepts `accountId` in the request body for report metadata.

#### `POST /api/pdf/client`
- Same changes as quick route above.

#### `GET /api/reports`
- Replaced mock data return with real `listReports()` call.
- In development with no saved reports, falls back to `MOCK_REPORTS` so the page is not empty.

#### `GET /api/reports/:id`
- Now reads the actual PDF from disk and streams it.
- Returns 404 if the record or file is missing.

#### `DELETE /api/reports/:id`
- Now calls `deleteReport()` to remove both the index entry and the PDF file.

#### `GET /api/facebook/ads`
- Accepts new `include_paused=true` query param.
- Passes `effectiveStatuses: ["ACTIVE", "PAUSED"]` to `fetchAds()` when set.
- Dev mock mode respects the flag (filters mock data client-side accordingly).

---

### 5. Frontend Changes

#### `src/hooks/use-facebook-ads.ts`
- Added `options.includePaused` parameter.
- SWR key now includes `include_paused=true` when set, so paused toggle causes a cache miss and refetch.

#### `src/app/dashboard/ads/page.tsx`
- `includePaused` state is now forwarded to the API (not just used for client-side filtering).
- Removed unused `formatObjective` import.

#### `src/components/dashboard/export-button.tsx`
- Added optional `accountId` prop (passed through to the PDF API routes for report metadata).
- Error toast now shows the actual error message from the API.
- Fixed `htmlFor` labels on client report dialog inputs.

---

### 6. Settings Persistence

**Metric preferences** are saved to `localStorage` via `useColumnConfig` hook (key: `fb-ads-tool-visible-metrics`). This was already correct — no changes needed.

**Selected account** persists via Zustand's `persist` middleware (key: `fb-ads-store`). This was already correct — no changes needed.

The Zustand store and `useColumnConfig` hook both persist `visibleMetrics` — to different storage keys. This is intentional: the Settings page uses the hook directly, while the Ads page uses the hook too. Both are consistent. The Zustand store's `visibleMetrics` is also persisted but not actively used by pages that import from the hook. This is benign duplication; a future cleanup could unify them.

---

### 7. Environment Configuration

**`.env.example`** updated with all required variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `FB_APP_ID` | Yes | Facebook App ID from Meta Developer Portal |
| `FB_APP_SECRET` | Yes | Facebook App Secret |
| `FB_API_VERSION` | No | Graph API version (default: `v25.0`) |
| `NEXT_PUBLIC_BASE_URL` | Yes | Full app URL for OAuth redirect |
| `NEXT_PUBLIC_APP_NAME` | No | Display name |
| `SESSION_SECRET` | Yes | 32+ char secret for iron-session encryption |
| `REPORTS_DIR` | No | Path for PDF storage (default: `.reports/`) |
| `SKIP_AUTH` | No | Set to `"false"` to force auth in dev |

---

## Backend Endpoints — Complete List

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/auth/facebook` | No | Initiates Facebook OAuth (redirect) |
| GET | `/api/auth/callback` | No | OAuth callback — exchanges code for token |
| POST | `/api/auth/logout` | No | Destroys session, redirects to home |
| GET | `/api/auth/status` | No | Returns connection status and token info |
| POST | `/api/auth/set-token` | No | Manually set a pre-obtained access token |
| GET | `/api/facebook/accounts` | Yes* | List Facebook ad accounts |
| GET | `/api/facebook/ads` | Yes* | Fetch ads with insights (account_id, since, until, include_paused) |
| GET | `/api/facebook/media` | Yes | Proxy an image URL through the server |
| POST | `/api/pdf/quick` | Yes* | Generate Quick Report PDF + save to storage |
| POST | `/api/pdf/client` | Yes* | Generate Client Report PDF + save to storage |
| GET | `/api/reports` | Yes* | List all saved reports |
| GET | `/api/reports/:id` | Yes* | Download a specific saved report PDF |
| DELETE | `/api/reports/:id` | Yes* | Delete a report and its PDF file |

\* In `NODE_ENV=development`, these routes use mock data / dev session bypass unless `SKIP_AUTH=false`.

---

## Known Limitations

1. **Single-server storage only.** The file-based report storage (`reports.json` + PDF files) does not support horizontal scaling. Replace with a database (Prisma/SQLite or Postgres) when needed.

2. **No user isolation.** Reports are stored globally — all agency users share the same report list. This is acceptable for an internal single-team tool. Add a `userId` field to `ReportRecord` and filter by `session.userId` to isolate per-user.

3. **Facebook pagination cap.** `fbFetchAll` has a `maxPages` default of 10, which fetches up to ~1000 ads per account. Accounts with more than 1000 ads will be silently truncated. Increase `maxPages` or implement cursor-based client-side pagination if needed.

4. **Media in PDFs.** The `generator.ts` fetches images at export time. Facebook CDN URLs expire (typically after hours). If a report is downloaded long after the ads ran, some thumbnails may be blank. Consider storing media locally at export time.

5. **Facebook token lifetime.** Long-lived tokens expire in ~60 days. The Settings page shows an expiry warning but does not auto-refresh. Users must manually click "Refresh token."

6. **`video_avg_time_watched_actions` not requested.** The `insights.ts` INSIGHT_FIELDS list does not include this field. Add it if average video watch time is needed.

---

## Areas to Test

### Critical paths
- [ ] Facebook OAuth login → redirect to `/dashboard/ads`
- [ ] Account selector populates from `/api/facebook/accounts`
- [ ] Selecting account + date range fetches real ads from `/api/facebook/ads`
- [ ] `include_paused=true` correctly returns PAUSED ads (Facebook and mock)
- [ ] Quick PDF export generates and downloads
- [ ] Client PDF export generates with cover page and metrics
- [ ] Both PDF exports appear in the Reports page after generation
- [ ] Reports page Download button streams the correct PDF
- [ ] Reports page Delete button removes the record and file
- [ ] Settings page shows correct token expiry countdown
- [ ] Metric preference changes in Settings persist across page reload

### Edge cases
- [ ] Account with zero ads (should show empty state, not an error)
- [ ] Very large account (>100 ads) — verify pagination works across pages
- [ ] Expired token → API returns 401 → session destroyed → redirect to login
- [ ] Rate limited by Facebook API → retry with backoff, surface error after max retries
- [ ] PDF export with no media URLs (text-only ads) — placeholders should appear
- [ ] PDF export with 50+ ads — verify proper pagination in PDF output
- [ ] `.reports/` directory auto-created on first PDF export
- [ ] `REPORTS_DIR` env var correctly overrides storage path

### Development mode
- [ ] Mock accounts load without a token
- [ ] Mock ads load without a token
- [ ] PDF export works without a token (uses `isAuthenticated()` which returns `true` in dev)
- [ ] Reports page shows mock data when no real reports saved yet

---

## Dependencies Added

No new npm packages were added. All functionality uses existing project dependencies:
- `@react-pdf/renderer` — PDF generation (already installed)
- `iron-session` — Session management (already installed)
- `swr` — Data fetching hooks (already installed)
- Node.js built-ins: `fs/promises`, `path`, `crypto` — for report storage

---

## Files Changed / Created

### New
- `src/lib/reports/storage.ts` — File-based report persistence layer

### Modified
- `src/lib/facebook/ads.ts` — Added `fetchAds()` with status options
- `src/lib/pdf/quick-template.tsx` — Multi-page pagination fix
- `src/lib/pdf/client-template.tsx` — Multi-page pagination fix + visual polish
- `src/app/api/facebook/ads/route.ts` — `include_paused` param support
- `src/app/api/pdf/quick/route.ts` — Auth fix + report persistence
- `src/app/api/pdf/client/route.ts` — Auth fix + report persistence
- `src/app/api/reports/route.ts` — Real storage instead of mock data
- `src/app/api/reports/[id]/route.ts` — Real PDF streaming + delete
- `src/hooks/use-facebook-ads.ts` — `includePaused` option
- `src/app/dashboard/ads/page.tsx` — Forward `includePaused` to API
- `src/components/dashboard/export-button.tsx` — `accountId` prop + error handling
- `.env.example` — Complete variable documentation
