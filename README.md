# Luxe Craft Furniture — storefront and admin

A React + Vite e-commerce site for a Nairobi furniture business, with a Supabase
backend (Postgres, Auth, Storage, Edge Functions) and Vercel hosting. Orders are
confirmed over WhatsApp; the admin panel at `/admin` manages products, slides,
sales, credit, expenses, inquiries and delivery pricing.

## Stack

| Layer | What |
| --- | --- |
| Frontend | React 18, Vite, Tailwind, Radix UI, React Router, TanStack Query |
| Data / auth / files | Supabase (project `barakasolution-`), bucket `images` |
| Serverless | Supabase Edge Functions in `supabase/functions` |
| Delivery quotes | Road distance from OSRM, fee rules in the `delivery_settings` table |
| Hosting | Vercel (`vercel.json` rewrites every path to `index.html`) |

## Local setup

```bash
npm install
cp .env.example .env.local   # or create it by hand, see below
npm run dev
```

`.env.local` (never commit it):

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_ADMIN_EMAIL=<email allowed into /admin>

# Optional
VITE_ADMIN_WHATSAPP=2547XXXXXXXX        # order notifications go here
VITE_GA_MEASUREMENT_ID=G-XXXXXXX        # Google Analytics 4
VITE_META_PIXEL_ID=XXXXXXXXXXXX         # Meta Pixel
VITE_GOOGLE_MAPS_KEY=...                # static map image in WhatsApp orders
VITE_OSRM_BASE_URL=https://router.project-osrm.org   # self-hosted router if needed
VITE_BRANCH_WHITEHOUSE_LAT / _LNG, VITE_BRANCH_KYUMVI_LAT / _LNG   # fallback pins only
```

The same variables go into the Vercel project settings for production.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc` over the JS sources (`checkJs`) |
| `npm test` | Vitest unit tests |

## Database

Schema and policies live in `supabase/migrations/`, numbered in order. Apply them
in the Supabase SQL editor (or with `supabase db push` if the CLI is linked):

1. `001_delivery_settings.sql` — delivery pricing table
2. `002_delivery_rate_200_and_branch_coords.sql` — current rate and branch pins
3. `003_rls_admin_and_missing_tables.sql` — row-level security, server-side admin
   check, storage policies, and the `about_slides`, `blog_posts` and `gallery` tables

Admin access is decided server-side by the `admin_users` table (checked through
`public.is_admin()`), and client-side by `VITE_ADMIN_EMAIL`. Both must contain the
admin's email. Add an admin with:

```sql
insert into public.admin_users (email) values ('admin@example.com');
```

## Edge Functions

`handle-inquiry` (contact form + AI chat), `whatsapp-webhook` and `daily-digest`
are deployed with the Supabase CLI:

```bash
supabase functions deploy handle-inquiry
```

They use the service role key and their own secrets, set in the Supabase dashboard.

## Deploying

Pushing to `main` deploys through Vercel. Check that the Vercel environment
variables match `.env.local`, then confirm `/shop`, checkout and `/admin` after
each deploy.
