# AGENTS.md

## Project context

React + Vite storefront and admin panel for Luxe Craft Furniture, backed by
Supabase (Postgres, Auth, Storage, Edge Functions) and hosted on Vercel.
Treat it as user-owned application code, keep changes focused on the request,
and preserve existing conventions. Start with `README.md` for setup, environment
variables and the migration list.

## Key files

- `src/api/supabaseClient.js` — the only backend client; import it everywhere.
- `src/pages/admin/AdminPanel.jsx` — admin shell (nav in `NAV`, pages in `renderPage`).
- `src/utils/deliveryUtils.js`, `src/utils/routing.js` — delivery fee maths and OSRM routing.
- `src/lib/siteData.js` — social links, menu, shared content.
- `supabase/migrations/` — schema and RLS policies, applied in numeric order.
- `supabase/functions/` — Edge Functions (service role; secrets in the dashboard).
- `.env.local` — local-only values; never commit secrets.

## Working notes

- `npm run dev` for the frontend against the hosted Supabase project.
- Schema changes go in a new numbered migration file; never edit an applied one.
- Every table in `public` must have RLS enabled. Storefront reads use public
  SELECT policies; admin writes rely on `public.is_admin()`.
- Any `VITE_*` variable is public in the bundle; secrets belong in Edge Functions.
- Run `npm run lint`, `npm run build` and `npm test` before finishing code changes.
