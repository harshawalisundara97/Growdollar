-- Growdollar Supabase schema
-- Run this in Supabase Dashboard > SQL Editor (or via `supabase db push`)

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, mirrors what used to live in Firestore
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default 'User',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- plants: replaces the AsyncStorage-only plant collection
-- ---------------------------------------------------------------------------
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  color text not null,
  name text not null,
  purchased_at timestamptz not null default now(),
  growth_stage integer not null default 0,
  growth_history jsonb not null default '[]'::jsonb,
  health_metrics jsonb not null default '{}'::jsonb,
  environmental_impact jsonb not null default '{}'::jsonb,
  location jsonb,
  photos jsonb not null default '[]'::jsonb,
  ai_insights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plants_user_id_idx on public.plants (user_id);

alter table public.plants enable row level security;

create policy "Users can view their own plants"
  on public.plants for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plants"
  on public.plants for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own plants"
  on public.plants for update
  using (auth.uid() = user_id);

create policy "Users can delete their own plants"
  on public.plants for delete
  using (auth.uid() = user_id);

-- keep updated_at fresh on every write
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_plants_updated_at on public.plants;
create trigger set_plants_updated_at
  before update on public.plants
  for each row execute procedure public.set_updated_at();
