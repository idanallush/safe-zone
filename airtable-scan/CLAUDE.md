# Finance Tracker — Web App Architecture

## Overview

Standalone personal finance web app for Idan and Yuval (couple), replacing a previous Airtable-based system. Tracks income, expenses, credit card charges, fixed monthly costs, recurring transactions, and financial savings (pension, education fund, provident fund). Deployed on Vercel with Supabase PostgreSQL backend.

**Live URL:** https://finance-tracker-roan-eight.vercel.app

### Users
- **Idan** — admin user, full access to all pages and settings
- **Yuval (Yubi)** — limited view; sees her own transactions + shared card (shared_3370); no access to settings/automations

### Auth
- Simple password-based login (env var `APP_PASSWORD`)
- Cookie-based sessions: `finance_auth` (httpOnly, server-side) + `finance_user` (client-readable for UI)
- `useAuth()` hook reads the `finance_user` cookie
- API key auth for Apple Shortcut endpoint (`API_KEY` env var)
- Yuval filter: `user_view=yuval` triggers composite SQL `(owner='yuval' OR paymentMethod='shared_3370')`

### Core Concept
Expenses are tracked per **credit card billing cycle** (15th to 14th of next month). The `billing_month` field (format `YYYY-MM`) determines which cycle a transaction belongs to. Computed by `computeBillingMonth()` in `src/lib/billing-month.ts`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, custom components (no shadcn/ui) |
| Database | Supabase PostgreSQL (project: `brmhwvsosirbhyejxqiy`) |
| ORM | Drizzle ORM |
| Charts | Recharts v3.8 |
| Excel parsing | SheetJS (xlsx) |
| PDF parsing | pdfjs-dist (dynamic import, worker in public/) |
| Deploy | Vercel |
| Auth | Middleware + env var cookie-based session |

### Design System Colors
- `#1A1A1A` — primary text / dark
- `#D97857` — accent (terracotta)
- `#6B7280` — secondary text
- `#9CA3AF` — muted text
- `#F5F4EF` — background hover / subtle bg
- `#E5E7EB` — borders
- `#FBF0EC` — accent light bg

---

## Project Structure

```
finance-tracker/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Login/logout
│   │   │   ├── transactions/       # CRUD + Apple Shortcut POST
│   │   │   ├── categories/         # Categories CRUD
│   │   │   ├── subcategories/      # Subcategories CRUD
│   │   │   ├── fixed-expenses/     # Fixed expenses CRUD
│   │   │   ├── savings/            # Savings products + deposits
│   │   │   ├── payment-methods/    # Payment methods CRUD
│   │   │   ├── recurring-transactions/ # Recurring tx CRUD + execute
│   │   │   ├── automation-logs/    # Execution log query
│   │   │   ├── reconciliation/
│   │   │   │   ├── match/          # Bank↔system transaction matching engine
│   │   │   │   └── batch-add/      # Batch create transactions from bank import
│   │   │   ├── stats/
│   │   │   │   ├── monthly/        # Monthly aggregation
│   │   │   │   ├── yearly/         # Yearly aggregation
│   │   │   │   ├── trends/         # Multi-month trends + category breakdowns
│   │   │   │   └── top-expenses/   # Top N expenses
│   │   │   └── cron/
│   │   │       └── monthly-savings/ # Cron: savings deposits + recurring execution
│   │   ├── (dashboard)/            # Dashboard route group
│   │   │   ├── layout.tsx          # Shell with Sidebar
│   │   │   ├── expenses/           # Expenses overview
│   │   │   ├── income/             # Income overview
│   │   │   ├── last-month/         # Previous month summary
│   │   │   ├── yearly/             # Annual summary
│   │   │   ├── fixed/              # Fixed expenses reference
│   │   │   ├── insights/           # Charts & analytics dashboard
│   │   │   ├── all-transactions/   # Full transaction list with filters
│   │   │   ├── add-expense/        # Quick add expense form
│   │   │   ├── add-income/         # Quick add income form
│   │   │   ├── savings/            # Savings products gallery
│   │   │   ├── deposits/           # Deposit log
│   │   │   ├── yuval/              # Yuval's expense view
│   │   │   ├── budget/             # Budget vs actual comparison
│   │   │   ├── reconciliation/     # Bank statement reconciliation (Excel + PDF)
│   │   │   ├── automations/        # Cron jobs + recurring transactions management
│   │   │   └── settings/           # Categories, subcategories, fixed expenses, payment methods
│   │   └── login/                  # Login page
│   ├── components/
│   │   ├── dashboard/              # Shared dashboard components
│   │   │   ├── Sidebar.tsx         # Navigation sidebar (RTL)
│   │   │   ├── StatCard.tsx        # KPI card with optional click
│   │   │   ├── TransactionList.tsx # Reusable transaction list
│   │   │   ├── DrilldownPanel.tsx  # Click-to-filter slide panel
│   │   │   ├── TransactionEditPanel.tsx # Edit/delete transaction
│   │   │   ├── SlidePanel.tsx      # Generic slide-in panel
│   │   │   ├── BillingMonthPicker.tsx # Month selector
│   │   │   ├── QuickAddButtons.tsx # Floating add buttons
│   │   │   └── ClickHint.tsx       # Visual affordance chevron
│   │   └── charts/                 # Recharts components (used in /insights)
│   │       ├── MonthlyTrendChart.tsx    # Line chart: expenses vs income
│   │       ├── TopExpensesChart.tsx     # Horizontal bar: top 10 expenses
│   │       ├── CategoryStackedChart.tsx # Stacked bar: categories over time
│   │       └── AnnualMonthlyChart.tsx   # 12-month bars with average line
│   ├── db/
│   │   ├── schema.ts              # Drizzle schema (all tables)
│   │   └── index.ts               # DB connection
│   ├── hooks/
│   │   └── useAuth.ts             # Auth hook (reads finance_user cookie)
│   ├── lib/
│   │   ├── billing-month.ts       # Billing cycle computation (15th-14th)
│   │   └── currency.ts            # ILS formatting helpers
│   └── middleware.ts              # Auth middleware (cookie check)
├── drizzle.config.ts
└── .env.local
```

---

## Database Schema (PostgreSQL / Supabase)

### Tables

**categories** — 11 records
- `id` serial PK, `name` text UNIQUE, `icon` text (emoji), `sort_order` int

**subcategories** — ~64 records
- `id` serial PK, `name` text, `category_id` FK → categories, `sort_order` int

**transactions** — ~700+ records (both Idan & Yuval in one table)
- `id` serial PK, `date` timestamptz, `amount` decimal(10,2), `category_id` FK, `subcategory_id` FK
- `description` text, `type` text ('expense'|'income'), `billing_month` text ('YYYY-MM')
- `payment_method` text (slug), `owner` text ('idan'|'yuval'), `created_at` timestamptz

**fixed_expenses** — ~24 records
- `id` serial PK, `name` text, `amount` decimal(10,2), `category_id` FK
- `owner` text ('idan'|'yuval'|'shared'), `is_active` boolean

**savings_products** — 3 records
- `id` serial PK, `name` text, `institution` text, `track` text
- `starting_balance`, `monthly_employee`, `monthly_employer`, `monthly_severance` decimal
- `fee_monthly_pct`, `fee_annual_pct` decimal, `employer_name` text, `banner_url` text

**savings_deposits** — deposit log
- `id` serial PK, `deposit_date` date, `product_id` FK → savings_products
- `employee_amount`, `employer_amount`, `severance_amount` decimal, `created_at` timestamptz

**payment_methods** — dynamic payment method list
- `id` serial PK, `slug` text UNIQUE, `label` text, `sort_order` int, `is_active` boolean

**recurring_transactions** — recurring expense/income definitions
- `id` serial PK, `name` text, `amount` decimal, `type` text, `category_id` FK, `subcategory_id` FK
- `description` text, `payment_method` text, `owner` text
- `frequency` text ('monthly'|'bi-monthly'|'quarterly'|'yearly'), `day_of_month` int
- `start_date` date, `end_date` date nullable, `is_active` boolean
- `total_payments` int nullable, `payments_made` int, `last_executed` date, `next_execution` date
- `created_at`, `updated_at` timestamptz

**automation_logs** — execution history
- `id` serial PK, `automation_name` text, `executed_at` timestamptz, `status` text
- `details` jsonb (rich execution details), `error_message` text

### Payment Method Slugs
`visa_6346`, `shared_0439`, `shared_3370`, `cal_6660`, `visa_2847`, `bit`, `bank_transfer`, `cash`, `check`, `standing_order`, `other`

---

## API Endpoints

### Transactions
- `GET /api/transactions` — List with filters (billing_month, owner, user_view, type, category_id, subcategory_id, payment_method, search, from, to, limit, offset)
- `POST /api/transactions` — Create (also Apple Shortcut endpoint, auth via API_KEY)
- `PUT /api/transactions/[id]` — Update
- `DELETE /api/transactions/[id]` — Delete

### Categories & Subcategories
- `GET /api/categories` — List with nested subcategories
- `POST/PUT/DELETE /api/categories/[id]`
- `GET /api/subcategories`, `POST/PUT/DELETE /api/subcategories/[id]`

### Stats
- `GET /api/stats/monthly?billing_month=YYYY-MM` — Monthly aggregation (expenses, income, balance, byCategory, byPaymentMethod)
- `GET /api/stats/yearly?year=YYYY` — Yearly aggregation (same + monthlyBreakdown)
- `GET /api/stats/trends?months=12&date_from=&date_to=&category_id=&payment_method=` — Multi-month trends, category breakdowns, category totals for pie chart
- `GET /api/stats/top-expenses?limit=10&date_from=&date_to=&category_id=` — Top N expenses by amount

### Savings
- `GET /api/savings` — List products with computed totals
- `PUT /api/savings/[id]` — Update product
- `GET/POST /api/savings/deposits` — Deposit log

### Fixed Expenses
- `GET /api/fixed-expenses` — List
- `POST/PUT/DELETE /api/fixed-expenses/[id]`

### Payment Methods
- `GET /api/payment-methods` — List
- `POST/PUT/DELETE /api/payment-methods/[id]`

### Recurring Transactions
- `GET /api/recurring-transactions` — List with category/subcategory joins
- `POST /api/recurring-transactions` — Create with auto-computed next_execution
- `PUT/DELETE /api/recurring-transactions/[id]`
- `POST /api/recurring-transactions/execute?id=` — Execute due items (or single by ID)

### Cron
- `POST /api/cron/monthly-savings` — Creates savings deposits + executes recurring transactions (auth: CRON_SECRET or cookie)

### Reconciliation
- `POST /api/reconciliation/match` — Match bank transactions against system DB (accepts `transactions[]` + optional `billing_month`)
- `POST /api/reconciliation/batch-add` — Batch create transactions from unmatched bank imports

### Automation Logs
- `GET /api/automation-logs?name=&limit=` — Query execution history

---

## Pages & Navigation

### Sidebar (RTL, right-side fixed)
```
מבט-על (Overview):
  ├── הוצאות        /expenses
  ├── הכנסות        /income
  ├── חודש שעבר     /last-month
  ├── סיכום שנתי    /yearly
  ├── הוצאות קבועות /fixed
  └── תובנות        /insights        ← Charts & analytics

תנועות (Transactions):
  ├── כל התנועות    /all-transactions
  ├── הוספת הוצאה   /add-expense
  ├── הוספת הכנסה   /add-income
  └── סנכרון חשבון  /reconciliation  (admin only)

חסכונות (Savings):
  ├── מוצרי חיסכון  /savings
  └── הפקדות        /deposits

עוד (More):
  ├── יובי           /yuval          (hidden for yuval)
  ├── תקציב מול ביצוע /budget
  ├── אוטומציות      /automations    (admin only)
  └── הגדרות         /settings       (admin only)
```

### Key Page Features

**Insights (/insights)** — Dedicated analytics dashboard:
- Advanced filters: date range, category (cascading subcategory), payment method, owner
- 6 KPI summary cards (total expenses/income, balance, monthly avg, biggest expense, top category)
- Daily spending average with period comparison (arrow up/down indicator)
- Monthly trend line chart (expenses + income, clickable points filter other charts)
- Category pie/donut chart (clickable segments filter by category)
- Category stacked bar chart over time
- Top 10 expenses horizontal bar chart (clickable → edit panel)

**Automations (/automations)** — Cron & recurring management:
- Savings automation card with editable deposit amounts per product
- Recurring transactions CRUD with grid cards, add/edit/view slide panels
- Expandable execution log with detailed breakdown per run:
  - Savings: mini-table showing each product's employee/employer/severance/total deposits
  - Recurring: mini-table showing each created transaction's name/amount/payment/owner/billing month
  - Error details if any items failed

**Reconciliation (/reconciliation)** — Bank statement reconciliation (admin only):
- Upload Excel (.xlsx) or PDF bank statements (Bank Leumi format supported)
- BillingMonthPicker at top — filters system transactions by billing_month when matching
- Matching engine: exact (amount ≤₪1, date ≤3 days) and possible (amount ≤₪5, date ≤7 days) matches
- 4 tabbed results: matched, unmatched, possible matches, pending (bank info-only)
- All tabs have expandable inline forms with smooth animations:
  - Matched: view details, edit via TransactionEditPanel, unmatch
  - Unmatched/Pending: full editable form (category, subcategory, payment method, description, amount, date, owner) with add/dismiss
  - Possible: confirm match or reject back to unmatched
- Batch actions: checkbox select all, add all selected, dismiss all selected
- Description field pre-filled from bank business name, user can override
- PDF parser: Bank Leumi credit card format, X-position-based column detection, cross-page deduplication
- Excel parser: SheetJS-based, auto-detects card type from last-4 digits
- Payment method auto-mapping: last-4 digits → slug (6346→visa_6346, 0439/3370→shared_0439, 6660→cal_6660, 2847→visa_2847)

**Settings (/settings)** — 4 tabs:
- קטגוריות: Add/edit/delete categories with icons
- תת-קטגוריות: Add/edit/delete subcategories (linked to category)
- הוצאות קבועות: Add/edit/delete fixed monthly expenses
- אמצעי תשלום: Add/edit/toggle/delete payment methods

---

## Shared Components

- **StatCard** — KPI card with optional onClick, ClickHint chevron on hover
- **TransactionList** — Reusable list with category icon, description, amount, date
- **DrilldownPanel** — Slide panel that fetches filtered transactions on demand
- **TransactionEditPanel** — Full edit/delete form in slide panel
- **SlidePanel** — Generic right-side slide-in panel (RTL aware)
- **BillingMonthPicker** — Month selector with left/right arrows
- **QuickAddButtons** — Floating "add expense" / "add income" buttons
- **ClickHint** — SVG chevron component for visual affordance (hover-visible on cards, rows)

---

## Business Logic

### Billing Cycle
- Runs 15th → 14th of next month
- `billing_month` stored as `YYYY-MM` (the target month)
- Computed by `computeBillingMonth(date)`: if day >= 15, month + 1

### User Filtering
- Idan (default): `owner=idan`
- Yuval composite view: `user_view=yuval` → SQL `(owner='yuval' OR paymentMethod='shared_3370')`
- Admin (idan) sees yuval tab; yuval can't see settings/automations

### Recurring Transactions
- Frequency: monthly, bi-monthly, quarterly, yearly
- `next_execution` auto-computed from start_date + frequency
- Execute creates a transaction + advances `payments_made`, `next_execution`
- Deactivates when `total_payments` reached or past `end_date`

### Savings Automation
- Cron runs 3rd of each month (Vercel Cron)
- Creates 3 deposit records from savings_products table amounts (not hardcoded)
- Also executes all due recurring transactions in same cron run
- Rich JSONB details stored in automation_logs for expandable log UI

### Bank Reconciliation
- Supports Excel (.xlsx) and PDF (Bank Leumi credit card format) uploads
- PDF parsing uses pdfjs-dist with dynamic import (avoids SSR DOMMatrix error)
- Bank Leumi PDF format: X-position column detection, DD/MM/YY dates, two sections (charged + pending)
- Cross-page deduplication using signed amount comparison to handle page-boundary row duplication
- Matching engine scores by amount proximity + date proximity, requires payment method match
- 1:1 matching with `usedSystemIds` set to prevent double-matching
- Batch add creates transactions via `/api/reconciliation/batch-add` with auto-computed billing_month

---

## Environment Variables

```
DATABASE_URL=postgresql://...          # Supabase connection string
APP_PASSWORD=...                       # Browser login password
API_KEY=...                            # Apple Shortcut API key
CRON_SECRET=...                        # Vercel cron auth secret
```

---

## Apple Shortcut API Contract

```
POST /api/transactions
Headers:
  Authorization: Bearer <API_KEY>
  Content-Type: application/json

Body:
{
  "amount": 150.00,
  "category": "אוכל",
  "subcategory": "סופר",
  "type": "expense",
  "payment_method": "visa_6346",
  "description": "סופר סבן",
  "owner": "idan",
  "date": "2026-03-19T14:30:00"
}

Response 201:
{ "id": 701, "billing_month": "2026-04", "created_at": "..." }
```

---

## Deployment

- **Platform:** Vercel
- **Workaround:** `.git` must be temporarily moved before deploy: `mv .git .git_backup && npx vercel --prod; mv .git_backup .git`
- **Supabase MCP:** DDL migrations via `apply_migration` tool, SQL via `execute_sql`
- **Build:** `next build` with Turbopack, TypeScript strict mode

---

## Development

```bash
cd finance-tracker
npm run dev          # Next.js dev server (port 3000)
npx tsc --noEmit     # Type check
npx vercel --prod    # Deploy (after git workaround)
```
