-- LiteLaunch: users and subscriptions.
-- Run this file once in the Supabase SQL editor.

create type public.subscription_status as enum (
  'on_trial',
  'active',
  'paused',
  'past_due',
  'unpaid',
  'cancelled',
  'expired'
);

-- Keeps updated_at current on every update.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- One row per Clerk user, written by the syncUser Server Action.
create table public.users (
  id text primary key, -- Clerk user ID
  email text not null,
  name text,
  image_url text,
  locale text not null default 'en', -- last language used; for emails sent outside a request
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- One row per Lemon Squeezy subscription, written by the billing webhook.
create table public.subscriptions (
  id text primary key, -- Lemon Squeezy subscription ID
  user_id text not null references public.users (id) on delete cascade,
  status public.subscription_status not null,
  variant_id text not null,
  variant_name text not null,
  customer_id text not null,
  renews_at timestamptz,
  ends_at timestamptz,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- Access model: signed-in users can read their own rows and nothing else.
-- All writes go through the server with the secret key, which bypasses RLS.
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;

revoke all on public.users, public.subscriptions from anon, authenticated;
grant select on public.users, public.subscriptions to authenticated;
grant all on public.users, public.subscriptions to service_role;

-- The Clerk session token carries the Clerk user ID in its "sub" claim.
create policy "Users can read their own profile"
on public.users
for select
to authenticated
using ((select auth.jwt() ->> 'sub') = id);

create policy "Users can read their own subscriptions"
on public.subscriptions
for select
to authenticated
using ((select auth.jwt() ->> 'sub') = user_id);
