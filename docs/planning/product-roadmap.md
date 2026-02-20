# BudgetApp — Product Development Roadmap

**Last updated:** 2026-02-20
**Status:** Phase 6 complete (Phase 5 deferred)

---

## Vision

BudgetApp is a secure, self-hosted personal budgeting application designed for deployment on Unraid. The long-term goal is a feature-complete, offline-capable PWA that can synchronize with real bank accounts via SimpleFIN, track and amortize debt, forecast budget outcomes, and generate actionable financial reports — all while keeping sensitive financial data encrypted and under the user's direct control.

---

## Completed Phases

### Phase 1 — Foundation
**Status:** Complete

- Project scaffolding: Express + TypeScript backend, React + Vite frontend
- Docker setup for development and production (Unraid)
- MariaDB 11 + Redis 7 via Docker Compose
- Knex migration infrastructure
- Tailwind CSS 3.4 + Shadcn/ui component library
- ESLint + Prettier configuration (strict TypeScript, no `any`)
- Winston logger, centralized env validation, secret loading from Docker secrets
- Vitest + React Testing Library (frontend), Jest + ts-jest (backend)

### Phase 2 — Authentication
**Status:** Complete

- User registration and login with Argon2id password hashing
- JWT dual-token authentication: 15-min access tokens (Zustand memory), 30-day refresh tokens (httpOnly cookies)
- Refresh token rotation with reuse detection (revoked token kills all sessions)
- TOTP 2FA with QR code setup, backup codes
- WebAuthn / Passkey registration and authentication
- Security settings page: manage passkeys, TOTP, active sessions
- All secrets AES-256-GCM encrypted at rest (email, TOTP secret)

### Phase 3 — Core Financial Domain
**Status:** Complete

- **Accounts:** 7 types (checking, savings, credit card, loan, mortgage, investment, other), asset/liability flag, atomic balance updates
- **Categories:** Income/expense categorization, parent/child hierarchy, 20 default categories seeded on registration, soft-delete
- **Transactions:** CRUD with atomic balance side-effects; AES-256-GCM encrypted description/payee/notes; transfer detection (±3 days, equal/opposite amounts); transfer linking (transfer/payment/refund types); transfer pair unlinking
- **Budgets:** Date-range budgets with per-category allocation; `getBudgetProgress` aggregates spending per category excluding transfers
- Full validation via Joi (backend) and Zod (frontend)
- TanStack Query hooks for all four domains

### Phase 4 — Dashboard & Polish
**Status:** Complete (2026-02-19)

- **AppLayout:** Shared sidebar navigation (Dashboard, Accounts, Transactions, Budgets, Settings), responsive with mobile hamburger drawer
- **DashboardPage:** Net worth card, income/expenses this month, account cards row, monthly chart, recent transactions, budget snapshot
- **Reports endpoint:** `GET /api/v1/reports/monthly-summary?months=N` — aggregates income and expenses per calendar month, excludes transfers
- **MonthlyChart:** Recharts bar chart (income green / expenses pink), responsive, formatted dollar values
- **Backend fixes:** `GET /categories/:id` endpoint; `createBatch()` UUID alignment; removed unimplementable `search` filter (ciphertext not searchable)

### Phase 6 — Debt Tracking & Budget Forecasting
**Status:** Complete (2026-02-20) — Phase 5 deferred

- **6.1 Loan Amortization:** `debt_schedules` table; amortization schedule computed server-side (standard P&I math); `transaction_splits` table stores principal/interest breakdown per payment; `autoSplitPayment` triggered non-fatally after each loan/mortgage/credit_card payment
- **6.2 Payoff Projections:** `GET /api/v1/debt/what-if/:accountId?extraMonthly=N` — returns months saved and interest saved vs. baseline; DebtDetailPage shows amortization table (24-row preview, "Show all" toggle) and live what-if calculator
- **6.3 Budget Forecasting:** `GET /api/v1/reports/forecast?months=N` — median of last 6 months of income/expenses projected N months forward; Dashboard MonthlyChart shows forecast bars dimmed via Recharts Cell fillOpacity
- **6.4 Savings Goals:** `savings_goals` table; progress computed from linked account's currentBalance vs. targetAmount; projectedDate and daysToGoal derived at runtime; SavingsGoalsPage with create/edit/delete; Dashboard widget showing top 3 goals

---

## Upcoming Phases

---

### Phase 5 — SimpleFIN Bank Sync
**Priority:** High (deferred — implement after Phase 6)
**Estimated scope:** Large

#### Overview
Integrate with [SimpleFIN Bridge](https://simplefin.org/) to pull real transaction data from connected bank accounts. Users connect their institutions once via SimpleFIN's OAuth flow; BudgetApp polls periodically and imports new transactions with smart deduplication.

#### Feature Specs

**5.1 SimpleFIN Configuration**
- Store SimpleFIN access URL per user (encrypted with `encryptionService`)
- UI: connect/disconnect SimpleFIN from Settings page
- Backend: `POST /api/v1/settings/simplefin` to store the access URL; `DELETE` to remove

**5.2 Transaction Import**
- Backend service `simplefinService.sync(userId)` — fetches accounts and transactions from SimpleFIN API
- Map SimpleFIN account types to BudgetApp account types; create accounts that don't yet exist
- Import new transactions only (deduplication by SimpleFIN transaction ID stored in a `simplefin_transaction_id` column on the `transactions` table)
- Imported transactions are AES-256-GCM encrypted before storage (same pipeline as manual entry)
- Mark imported transactions with `source: 'simplefin'` for display purposes

**5.3 Deduplication Logic**
- Primary key: `simplefin_transaction_id` (unique per user)
- Fuzzy match fallback: same account, same date, same amount, payee similarity ≥ 80% (Levenshtein distance) — flag as probable duplicate for user review rather than silently discard
- Manual review queue UI: accept/merge/discard duplicates

**5.4 Sync Scheduling**
- Configurable sync interval (default: every 4 hours) stored in user preferences
- Manual "sync now" button on Accounts page
- Background job queue (Bull/BullMQ backed by Redis) for scheduled syncs
- Sync status shown in UI: last synced time, error state if last sync failed

**5.5 Account Reconciliation**
- After sync, compare `currentBalance` against SimpleFIN's reported balance
- Flag discrepancies > $0.01 for user review
- Display "Needs reconciliation" badge on account card

#### Acceptance Criteria
- [ ] User can connect SimpleFIN and see imported accounts/transactions
- [ ] Duplicate transactions are not created on repeated syncs
- [ ] Probable duplicates are surfaced for user review
- [ ] Sync failures do not corrupt existing data
- [ ] Sensitive SimpleFIN URLs are encrypted at rest

---


### Phase 7 — Offline-First PWA
**Priority:** Medium
**Estimated scope:** Large

#### Overview
Convert BudgetApp into a fully offline-capable PWA. Transactions, accounts, and budgets are stored in IndexedDB via Dexie and sync bidirectionally with the server when connectivity is available.

#### Feature Specs

**7.1 Dexie Schema & Sync Engine**
- Define Dexie tables mirroring server schema (accounts, categories, transactions, budgets, budget_categories)
- `syncEngine.push()`: batch-upload mutations queued while offline
- `syncEngine.pull()`: fetch server state modified since last sync timestamp, merge locally
- Conflict resolution strategy: server wins for balance fields; last-write-wins by `updated_at` for text fields

**7.2 Service Worker**
- Workbox precaching for app shell (JS, CSS, fonts)
- Runtime caching for API GET requests (network-first with IndexedDB fallback)
- Background sync via `SyncManager` API for queued mutations
- Push notifications for sync completion and reconciliation flags (optional, user opt-in)

**7.3 Offline UI Indicators**
- Offline banner when `navigator.onLine === false`
- Pending mutations counter in sidebar ("3 changes pending sync")
- Optimistic UI: mutations applied locally immediately, confirmed/rolled back on sync

**7.4 Conflict Resolution UI**
- When a server merge conflict is detected (same record modified both locally and remotely), surface a diff view for user resolution
- Auto-resolve non-conflicting fields; require manual resolution for amount/date conflicts

**7.5 PWA Install & Manifest**
- `manifest.json`: app name, icons (192×192, 512×512), theme color, `display: standalone`
- Install prompt shown once after 3rd visit
- Installable on iOS, Android, and desktop Chrome/Edge

#### Acceptance Criteria
- [ ] App loads and allows transaction entry with no network connection
- [ ] Queued mutations sync automatically when connectivity returns
- [ ] No data loss on concurrent edits from two devices
- [ ] Lighthouse PWA score ≥ 90

---

### Phase 8 — Advanced Analytics & Data Export
**Priority:** Medium
**Estimated scope:** Medium

#### Overview
Add richer reporting, CSV/OFX export, recurring transaction management, and multi-currency support.

#### Feature Specs

**8.1 Enhanced Reports**
- Spending by category (pie/donut chart, configurable date range)
- Income vs. expenses trend (already in Phase 4 as 6-month bar chart; extend to custom range and CSV export)
- Net worth over time (line chart, monthly snapshots stored in `net_worth_snapshots` table)
- Top payees by spend (bar chart, configurable period)

**8.2 CSV & OFX Export**
- `GET /api/v1/transactions/export?format=csv&startDate=&endDate=` — streams CSV with decrypted payee/description
- OFX format export for import into Quicken/Mint
- All exports rate-limited and scoped to the requesting user

**8.3 Recurring Transactions**
- `recurring_transactions` table: template transaction, frequency (daily/weekly/biweekly/monthly/annually), next_due_date, end_date
- Cron job generates actual transaction records when due date is reached
- UI to define and manage recurring transactions; "Skip this occurrence" action

**8.4 Multi-Currency Support**
- Store `currency` on each account (already exists in schema)
- Fetch daily exchange rates from an open API (e.g., exchangerate.host or ECB) and store in `exchange_rates` table
- Dashboard net worth calculation converts all balances to user's base currency
- Reports display amounts in base currency with original currency notation

**8.5 Transaction Notes & Attachments**
- Encrypted `notes` field already exists; expose in transaction form (Phase 3 stored it but the UI may not expose it fully)
- Photo attachment support: upload receipt images, stored encrypted in object storage (S3-compatible, e.g., MinIO on Unraid)
- Thumbnail preview on transaction detail

#### Acceptance Criteria
- [ ] Spending by category chart is accurate and matches sum of transactions in that category for the period
- [ ] CSV export is importable into Excel/Google Sheets without modification
- [ ] Recurring transactions are created on schedule without duplication
- [ ] Net worth chart reflects balance history accurately

---

## Technical Debt & Non-Feature Work

| Item | Priority | Notes |
|------|----------|-------|
| Full-text transaction search | Medium | Requires maintaining a plaintext search index (Meilisearch or dedicated search table) alongside encrypted fields. Deferred until Phase 5+ when sync architecture is finalized. |
| Budget total validation | Low | Nothing prevents allocations from exceeding a desired ceiling. Add optional `limit` field to budgets table. |
| Category `createBatch()` return values | Low | Currently `void`; returning created categories would allow the seeded defaults to be immediately shown in the UI without a second fetch. |
| API pagination for accounts | Low | Accounts list is unbounded; add `page`/`limit` for users with many accounts. |
| Session management UI | Medium | Currently users can see active sessions but cannot see device names for refresh tokens. Add `device_name` population from User-Agent parsing. |
| Rate limit tuning | Low | Auth endpoints use 5 req/15 min; evaluate whether this needs adjustment for WebAuthn flows where multiple round-trips are expected. |
| E2E test suite | High | No end-to-end tests exist. Add Playwright tests for critical paths: registration, login, create transaction, budget progress. |
| Load testing | Medium | No load tests. Add k6 scripts for the transaction import endpoint before Phase 5 ships. |

---

## Architecture Decisions Log

See [docs/planning/architecture-decisions/](./architecture-decisions/) for full ADRs. Key decisions:

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Database | MariaDB 11 | InnoDB encryption at rest; Unraid-native; well-supported by Knex |
| Auth tokens | JWT dual-token | Stateless access token for performance; refresh token in DB for revocation |
| Field encryption | AES-256-GCM | Sensitive financial fields encrypted before storage; authenticated encryption prevents tampering |
| Offline storage | Dexie (IndexedDB) | Well-maintained; TypeScript-first; handles large datasets |
| Charts | Recharts | Already installed; React-native; sufficient for bar/line/pie charts needed |
| Search | Deferred | Encrypted fields cannot be searched with SQL LIKE; requires dedicated search index |
| SimpleFIN | Phase 5 | Requires stable account/transaction schema first |
