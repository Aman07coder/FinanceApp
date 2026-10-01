# FinanceApp

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)
![Postgres](https://img.shields.io/badge/Database-Neon%20Postgres-336791?logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/ORM-Drizzle-C5F74F?logo=drizzle&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)

A personal budgeting and expense-tracking app built with the Next.js App Router, Clerk authentication, and a Neon Postgres database accessed through Drizzle ORM. Users create budgets, log expenses against them, and see spending summarized on a dashboard with a bar chart.

## Features

- Sign in / sign up with Clerk-managed authentication.
- Route protection at the middleware level — dashboard routes require a session, marketing and auth pages stay public.
- Create budgets with a name, amount, and an emoji icon.
- Edit and delete existing budgets.
- Log expenses against a specific budget and delete individual expense entries.
- Auto-redirect new users with zero budgets straight into budget creation.
- Dashboard summary cards for total budget, total spent, and number of budgets.
- Bar chart (Recharts) comparing budgeted amount vs. amount spent, per budget.
- Per-budget detail page with its own expense list, edit dialog, and delete-with-confirmation flow.
- Skeleton loading states while budget data is being fetched.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Authentication | Clerk |
| Database | Neon (serverless Postgres) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS, shadcn/ui (Dialog, AlertDialog, Skeleton) |
| Charts | Recharts |
| Icons / misc | lucide-react, emoji-picker-react, sonner (toasts), moment |

## Architecture

Unlike a typical client/server split with a dedicated API layer, data access currently happens directly from client components:

```
React Client Component ('use client')
    -> Drizzle ORM query (db.select / .insert / .update / .delete)
    -> Neon serverless Postgres
```

Authentication and route protection run ahead of every request:

```
Request
    -> middleware.ts (clerkMiddleware)
    -> isPublicRoute(request)?
         yes -> render page
         no  -> auth.protect() -> valid session: render page
                                -> no session: redirect to /sign-in
    -> ClerkProvider (app/layout.jsx) makes the session available app-wide
    -> useUser() reads { user, isSignedIn } in any client component
```

There is no dedicated API route or service layer yet — see **Known Limitations** below.

## Folder Structure

```
├── app/
│   ├── page.jsx                        Landing page (Header + Hero)
│   ├── layout.jsx                      Root layout — ClerkProvider, Toaster, font
│   ├── globals.css
│   ├── _components/
│   │   ├── Header.jsx
│   │   └── Hero.jsx
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   └── (routes)/dashboard/
│       ├── layout.jsx                  SideNav + DashboardHeader shell
│       ├── page.jsx                    Main dashboard (cards, chart, latest budgets)
│       ├── _components/
│       │   ├── CardInfo.jsx
│       │   ├── BarChartDash.jsx
│       │   ├── SideNav.jsx
│       │   └── DashboardHeader.jsx
│       ├── budgets/
│       │   ├── page.jsx
│       │   └── _components/
│       │       ├── BudgetList.jsx      Fetches + aggregates budgets
│       │       ├── BudgetItem.jsx      Budget card + progress bar
│       │       └── CreateBudget.jsx
│       ├── expense/page.jsx            All-expenses view
│       └── expenses/
│           ├── AddExpenses/page.jsx
│           ├── [id]/page.jsx           Single budget detail + delete
│           └── _components/
│               ├── ExpenseListTable.jsx
│               └── Editbudget.jsx
├── components/ui/                      shadcn/ui components (owned, not a dependency)
├── utils/
│   ├── dbConfig.jsx                    Neon + Drizzle client
│   └── schema.jsx                      Budgets and Expenses table definitions
├── lib/utils.js                        cn() helper (clsx + tailwind-merge)
├── middleware.ts                       Clerk route protection
├── drizzle.config.js
├── tailwind.config.mjs
└── package.json
```

## Setup

Prerequisites:
- Node.js 18 or newer
- A Neon (or any Postgres) connection string
- A Clerk application (publishable + secret key)

Install dependencies:

```
npm install
```

Set up the database schema:

```
npm run db:push
```

Run the dev server:

```
npm run dev
```

App: http://localhost:3000

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_DATABASE_URL` | Postgres/Neon connection string | `postgresql://user:pass@host/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route | `/sign-up` |

## Database Schema

**Budgets**

| Field | Type | Purpose |
|---|---|---|
| `id` | serial, PK | |
| `name` | varchar(255) | Budget name |
| `amount` | varchar(20) | Budget cap — stored as text (see Known Limitations) |
| `icon` | varchar(255) | Emoji, stored as a string |
| `createdBy` | varchar(255) | Owner's Clerk email — no separate Users table |

**Expenses**

| Field | Type | Purpose |
|---|---|---|
| `id` | serial, PK | |
| `name` | varchar | Expense description |
| `amount` | numeric, default 0 | Expense amount |
| `budgetId` | integer, references `Budgets.id` | Parent budget |
| `createdAt` | varchar | Formatted date string (see Known Limitations) |

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run Next.js lint |
| `npm run db:push` | Push the Drizzle schema to the database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:generate` | Generate Drizzle migration files |

## Known Limitations / Roadmap

- **DB calls run client-side.** `dbConfig.jsx` uses `NEXT_PUBLIC_DATABASE_URL`, which inlines the connection string into the browser bundle. Planned fix: move all reads/writes into Server Actions and use a server-only env variable.
- **Missing `and()` on a scoped query.** The single-budget page chains two `.where()` calls instead of combining them with Drizzle's `and()`, which drops the ownership filter. Needs a fix to prevent viewing another user's budget by ID.
- **String/number mismatch in the overspend check.** Expense amount comes from the input as a string and is compared without casting to `Number`, which can produce incorrect results.
- **Inconsistent amount types.** `Budgets.amount` is `varchar` while `Expenses.amount` is `numeric` — planned migration to `numeric` on both.
- **`createdAt` is a formatted string, not a timestamp**, which limits sorting and date-range filtering. Planned migration to a proper `timestamp` column.
- No dedicated API route or service layer yet — data access is currently embedded in client components.
- No automated test suite yet.

## Testing

No test suite is set up yet. Manual verification is done through the dev server.
