# MyWallet — Project Plan

## 1. Tech Stack

| Layer      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Next.js (App Router)                          |
| Auth       | WorkOS                                        |
| Database   | PostgreSQL — Supabase (prod) / Docker (local) |
| ORM        | Prisma                                        |
| Design     | Stitch MCP                                    |
| Deployment | Vercel                                        |
| Charts     | Recharts                                      |
| UI base    | Tailwind CSS + shadcn/ui                      |

---

## 2. Database Schema

### `users`

| Column         | Type        | Notes      |
| -------------- | ----------- | ---------- |
| id             | uuid PK     |            |
| workos_user_id | text unique |            |
| home_currency  | text        | e.g. "PEN" |
| created_at     | timestamptz |            |

### `expense_categories`

User-defined budget buckets. Independent of versions.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| name | text | e.g. "Food", "Transport" |
| is_savings | boolean | marks the savings bucket |
| is_mixed | boolean | auto-created remainder bucket |
| is_active | boolean | soft delete |
| created_at | timestamptz | |

### `allocation_versions`

A snapshot of allocation percentages, effective from a date.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| effective_from | date | dashboard uses the version active on this date |
| created_at | timestamptz | |

### `allocation_entries`

Percentage assigned to each category within a version.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| version_id | uuid FK → allocation_versions | |
| category_id | uuid FK → expense_categories | |
| percentage | numeric(5,2) | |

### `income_entries`

All income, all types.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| type | enum: fixed_salary, hourly, occasional | |
| month | date (day=1) | for salary and hourly |
| date | date | for occasional |
| amount | numeric(14,2) | calculated for hourly |
| hourly_rate | numeric(14,2) | nullable, hourly only |
| hours_worked | numeric(8,2) | nullable, hourly only |
| currency | text | |
| description | text | nullable, occasional only |
| occasion_type | text | nullable, occasional only (e.g. "Freelance") |
| is_recurring | boolean | salary repeats monthly |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `expenses`

| Column      | Type                         | Notes |
| ----------- | ---------------------------- | ----- |
| id          | uuid PK                      |       |
| user_id     | uuid FK → users              |       |
| category_id | uuid FK → expense_categories |       |
| description | text                         |       |
| amount      | numeric(14,2)                |       |
| currency    | text                         |       |
| date        | date                         |       |
| created_at  | timestamptz                  |       |
| updated_at  | timestamptz                  |       |

### `exchange_rates`

Manually entered by user per month.
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| month | date (day=1) | |
| from_currency | text | |
| to_currency | text | always home_currency |
| rate | numeric(18,6) | |
| created_at | timestamptz | |

---

## 3. Pages & Routes

```
/                          → Landing / login (WorkOS)
/onboarding                → Step 1: home currency. Step 2: allocation categories
/dashboard                 → Monthly overview (default: current month)
/income                    → List all income. Add/edit/delete
/expenses                  → List all expenses. Add/edit/delete
/settings/categories       → Manage allocation categories + percentages (creates new version)
/settings/exchange-rates   → Enter monthly exchange rates
/settings/profile          → Home currency, account info
```

### API Route Handlers (`/app/api/`)

```
POST   /api/auth/[...workos]         ← WorkOS callback
GET    /api/income                   ← list by month
POST   /api/income                   ← create entry
PUT    /api/income/[id]              ← edit
DELETE /api/income/[id]              ← delete

GET    /api/expenses                 ← list by month
POST   /api/expenses                 ← create
PUT    /api/expenses/[id]            ← edit
DELETE /api/expenses/[id]            ← delete

GET    /api/categories               ← list user's categories
POST   /api/categories               ← create category
PUT    /api/categories/[id]          ← rename / toggle active
DELETE /api/categories/[id]          ← soft delete

POST   /api/allocations              ← save new allocation version (w/ all entries)
GET    /api/allocations/active       ← get version active at a given month

GET    /api/exchange-rates           ← list by month
POST   /api/exchange-rates           ← create or update a rate for a month

GET    /api/dashboard/[year]/[month] ← aggregated monthly view
```

---

## 4. Feature Specifications

### 4.1 Onboarding

1. User signs in via WorkOS → redirected to `/onboarding` if no profile exists.
2. **Step 1:** Choose home currency (searchable dropdown of ISO 4217 codes).
3. **Step 2:** Create expense categories and assign percentages. Running total shown. If < 100%: prompt user to confirm remainder goes to "Savings" or "Mixed".
4. First `allocation_version` is created with `effective_from = today`.

### 4.2 Income Management

- **Fixed salary:** amount + currency + month. Toggle "recurring" → auto-appears in future months.
- **Hourly:** hourly rate + hours worked + currency + month. App shows computed total.
- **Occasional:** type (e.g. Freelance, Bonus, Gift) + description + amount + currency + date.
- All entries are editable and deletable.

### 4.3 Expense Management

- Fields: description, category (select from active user categories), amount, currency, date.
- Editable and deletable.

### 4.4 Allocation Management (`/settings/categories`)

- User sees current allocation with category name + percentage.
- Can add/rename/remove categories and change percentages.
- On save → new `allocation_version` is created with `effective_from = today`. Past months are unaffected.
- Total percentage validated ≤ 100% before save.

### 4.5 Exchange Rates (`/settings/exchange-rates`)

- User selects a month, then enters a rate for each foreign currency used that month.
- Rate is from `X → home_currency`.
- If no rate is entered for a currency used that month, dashboard shows a warning prompting the user to add it.

### 4.6 Dashboard (`/dashboard`)

- Month selector (prev/next arrows).
- **Top cards:** Total income (in home currency) | Total spent | Remaining.
- **Per-category rows** (using the allocation version active that month):
  - Category name
  - Budget: `total_income × percentage` (converted to home currency)
  - Spent: sum of expenses in that category (converted via monthly rate)
  - Progress bar (green → yellow → red as it approaches 100%)
  - `%` consumed shown numerically
  - **Overspend:** red flag badge + alert banner if spent > budget
- **Chart:** Bar or pie chart showing budget vs. spent per category.
- **No income state:** message prompting user to log income for the month.
- **Missing exchange rate state:** warning badge on affected categories.

---

## 5. Business Rules Summary

| Rule                    | Behavior                                                   |
| ----------------------- | ---------------------------------------------------------- |
| Allocation total < 100% | Remainder → "Savings" (if defined) or auto-created "Mixed" |
| Allocation change       | Creates new version; past months unchanged                 |
| Hourly income           | `amount = hourly_rate × hours_worked`                      |
| Recurring salary        | Appears automatically each month from start date           |
| Currency conversion     | All amounts → home currency using the month's manual rate  |
| Missing exchange rate   | Dashboard warns; category shows "rate missing"             |
| Overspend               | Red flag on category + alert banner                        |
| Edit/delete             | Allowed on all income and expense entries                  |

---

## 6. Development Phases

### Phase 1 — Foundation

- [ ] Init Next.js project, configure Prisma + local Docker Postgres
- [ ] WorkOS auth integration (sign in, session, middleware guard)
- [ ] Database migrations for all tables
- [ ] Onboarding flow (currency + categories)

### Phase 2 — Core Data Entry

- [ ] Income CRUD (all 3 types, recurring salary logic)
- [ ] Expense CRUD
- [ ] Allocation version management
- [ ] Exchange rate entry

### Phase 3 — Dashboard

- [ ] Dashboard API aggregation logic (convert currencies, version lookup, budget vs. spent)
- [ ] Dashboard UI (cards, per-category rows, progress bars, charts)
- [ ] Overspend alerts and missing rate warnings

### Phase 4 — Design Pass

- [ ] Stitch MCP design system setup
- [ ] Apply design across all pages

### Phase 5 — Deploy

- [ ] Configure Supabase (prod DB, env vars)
- [ ] Deploy to Vercel
- [ ] Smoke test end-to-end
