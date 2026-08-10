-- Raw inquiries from any channel
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('whatsapp', 'website')),
  customer_name text,
  customer_contact text not null, -- phone number or email
  message text not null,
  status text not null default 'new' check (status in ('new', 'auto_handled', 'escalated', 'resolved')),
  created_at timestamptz not null default now()
);

-- AI's attempt at each inquiry
create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references inquiries(id) not null,
  ai_reply text not null,
  confidence text not null check (confidence in ('high', 'low')),
  reason_if_low text,
  auto_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Escalations needing client action
create table escalations (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references inquiries(id) not null,
  ai_draft_reply text, -- pre-filled draft client can edit
  resolved boolean not null default false,
  client_reply text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- Digest run log (avoid duplicate sends, allow debugging)
create table digest_log (
  id uuid primary key default gen_random_uuid(),
  sent_at timestamptz not null default now(),
  channel text not null check (channel in ('whatsapp', 'email')),
  summary jsonb not null
);

-- Enable RLS (Service role can bypass, add policies if needed for admin users later)
alter table inquiries enable row level security;
alter table ai_conversations enable row level security;
alter table escalations enable row level security;
alter table digest_log enable row level security;

-- Simple permissive policies for authenticated admin users
create policy "Allow all actions for authenticated admins on inquiries" on inquiries for all to authenticated using (true);
create policy "Allow all actions for authenticated admins on ai_conversations" on ai_conversations for all to authenticated using (true);
create policy "Allow all actions for authenticated admins on escalations" on escalations for all to authenticated using (true);
create policy "Allow all actions for authenticated admins on digest_log" on digest_log for all to authenticated using (true);
