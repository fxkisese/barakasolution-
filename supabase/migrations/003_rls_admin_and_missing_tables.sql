-- 003: Row-level security, server-side admin check, storage policies,
--      the content tables the site reads but never had, and the order
--      columns written by the web checkout.
--
-- Run after 001 and 002. Afterwards add the admin login (must match
-- VITE_ADMIN_EMAIL):
--
--     insert into public.admin_users (email) values ('admin@example.com');
--
-- Edge Functions use the service role key and are not affected by RLS.

-- ── Admin identity ──────────────────────────────────────────────────────────
create table if not exists public.admin_users (
    email      text primary key,
    created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1 from public.admin_users
        where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins can read admin_users" on public.admin_users;
create policy "admins can read admin_users" on public.admin_users
    for select to authenticated using (public.is_admin());

-- ── Content tables the app already queries ──────────────────────────────────
create table if not exists public.about_slides (
    id         uuid primary key default gen_random_uuid(),
    image_url  text not null,
    active     boolean not null default true,
    "order"    integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
    id         uuid primary key default gen_random_uuid(),
    title      text not null,
    excerpt    text,
    content    text,
    image      text,
    category   text,
    author     text,
    date       text,
    published  boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists public.gallery (
    id         uuid primary key default gen_random_uuid(),
    name       text,
    image      text not null,
    category   text,
    created_at timestamptz not null default now()
);

-- ── Orders: columns written by the web checkout ─────────────────────────────
alter table public.orders
    add column if not exists customer_phone text,
    add column if not exists subtotal       numeric,
    add column if not exists delivery_fee   numeric,
    add column if not exists delivery       jsonb;

-- ── Enable RLS on every public table ────────────────────────────────────────
alter table public.products          enable row level security;
alter table public.categories        enable row level security;
alter table public.hero_slides       enable row level security;
alter table public.about_slides      enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.gallery           enable row level security;
alter table public.orders            enable row level security;
alter table public.sales             enable row level security;
alter table public.credit            enable row level security;
alter table public.expenses          enable row level security;
alter table public.inquiries         enable row level security;
alter table public.ai_conversations  enable row level security;
alter table public.escalations       enable row level security;
alter table public.digest_log        enable row level security;
alter table public.delivery_settings enable row level security;

-- ── Remove the old permissive policies ──────────────────────────────────────
-- These granted every signed-in customer full access.
drop policy if exists "admin_delete_products" on public.products;
drop policy if exists "Admins can update delivery settings" on public.delivery_settings;
drop policy if exists "Allow all actions for authenticated admins on inquiries" on public.inquiries;
drop policy if exists "Allow all actions for authenticated admins on ai_conversations" on public.ai_conversations;
drop policy if exists "Allow all actions for authenticated admins on escalations" on public.escalations;
drop policy if exists "Allow all actions for authenticated admins on digest_log" on public.digest_log;

-- ── Public catalogue: anyone can read ───────────────────────────────────────
-- (delivery_settings keeps its existing "Anyone can read delivery settings")
do $$
declare t text;
begin
    foreach t in array array['products','categories','hero_slides','about_slides','blog_posts','gallery'] loop
        execute format('drop policy if exists "public read %1$s" on public.%1$I', t);
        execute format('create policy "public read %1$s" on public.%1$I for select to anon, authenticated using (true)', t);
    end loop;
end $$;

-- ── Admin: full access to every table ───────────────────────────────────────
do $$
declare t text;
begin
    foreach t in array array['products','categories','hero_slides','about_slides','blog_posts','gallery',
                             'orders','sales','credit','expenses','inquiries','ai_conversations',
                             'escalations','digest_log','delivery_settings'] loop
        execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
        execute format('create policy "admin all %1$s" on public.%1$I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    end loop;
end $$;

-- ── Web checkout: anyone may create a new order, nobody else may read it ────
drop policy if exists "public create order" on public.orders;
create policy "public create order" on public.orders
    for insert to anon, authenticated
    with check (status = 'new');

-- ── Storage: public can view images, only admins can upload/replace/delete ──
drop policy if exists "Allow Public Uploads"       on storage.objects;
drop policy if exists "Allow Public Update/Delete" on storage.objects;
drop policy if exists "Allow Public Delete"        on storage.objects;
drop policy if exists "public read images"         on storage.objects;
drop policy if exists "admin insert images"        on storage.objects;
drop policy if exists "admin update images"        on storage.objects;
drop policy if exists "admin delete images"        on storage.objects;

create policy "public read images"  on storage.objects
    for select to anon, authenticated using (bucket_id = 'images');
create policy "admin insert images" on storage.objects
    for insert to authenticated with check (bucket_id = 'images' and public.is_admin());
create policy "admin update images" on storage.objects
    for update to authenticated using (bucket_id = 'images' and public.is_admin()) with check (bucket_id = 'images' and public.is_admin());
create policy "admin delete images" on storage.objects
    for delete to authenticated using (bucket_id = 'images' and public.is_admin());

-- ── Linter follow-ups ───────────────────────────────────────────────────────
alter function public.touch_updated_at() set search_path = public;

do $$
begin
    if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
               where n.nspname = 'public' and p.proname = 'rls_auto_enable') then
        execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
    end if;
end $$;
