# Product Roadmap

## Phase 1: Foundation (MVP)

- Initialize Next.js project with Prisma and local Docker Postgres
- WorkOS auth integration (sign in, session, middleware guard)
- Database migrations for all tables
- Onboarding flow: home currency selection + initial allocation categories

## Phase 2: Core Data Entry (MVP)

- Income CRUD — fixed salary, hourly (rate × hours), and occasional income types
- Recurring salary logic (auto-appears in future months)
- Expense CRUD — description, category, amount, currency, date
- Allocation version management (new version on change; past months unaffected)
- Exchange rate entry per month per currency pair

## Phase 3: Dashboard (MVP)

- Dashboard API: currency conversion, allocation version lookup, budget vs. spent aggregation
- Dashboard UI: monthly summary cards, per-category rows with progress bars
- Overspend alerts (red flag + banner) and missing exchange rate warnings
- Bar/pie chart of budget vs. spent per category

## Phase 4: Design Pass

- Stitch MCP design system setup
- Apply consistent design across all pages

## Phase 5: Deploy

- Configure Supabase as production database
- Deploy to Vercel with production environment variables
- End-to-end smoke test
