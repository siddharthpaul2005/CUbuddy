-- CUbuddy core schema
-- Everything the student app shows lives in these tables, so the admin panel
-- can change any of it without shipping a new app build.

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admins: the only accounts in the system. Rows are created by
-- scripts/create-admins.mjs (or by hand from the dashboard).
-- ---------------------------------------------------------------------------

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  name       text,
  created_at timestamptz not null default now()
);

-- security definer so RLS policies can call it without the caller needing
-- read access to the admins table.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Clubs
-- ---------------------------------------------------------------------------

create table public.clubs (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique check (length(trim(name)) > 0),
  short_name    text,
  description   text,
  logo_url      text,
  logo_path     text,          -- storage path inside the "media" bucket, for cleanup
  instagram_url text,
  website_url   text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger clubs_set_updated_at
  before update on public.clubs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Categories (event types: Technical, Cultural, Sports, ...)
-- ---------------------------------------------------------------------------

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (length(trim(name)) > 0),
  icon       text,             -- optional icon name for the app to map
  color      text,             -- optional hex colour, e.g. #c7f32c
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Events
-- No in-app registration: registration_url is optional, otherwise the
-- details are on the poster itself.
-- ---------------------------------------------------------------------------

create table public.events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null check (length(trim(title)) > 0),
  description      text,
  club_id          uuid references public.clubs (id) on delete set null,
  category_id      uuid references public.categories (id) on delete set null,
  organized_by     text,
  venue            text,
  starts_at        timestamptz not null,
  ends_at          timestamptz,
  rewards          text,
  registration_url text,
  poster_url       text,
  poster_path      text,       -- storage path inside the "media" bucket, for cleanup
  is_published     boolean not null default true,
  is_featured      boolean not null default false,
  created_by       uuid references auth.users (id) on delete set null default auth.uid(),
  updated_by       uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint events_ends_after_start check (ends_at is null or ends_at >= starts_at),
  constraint events_registration_url_http check (
    registration_url is null or registration_url ~* '^https?://'
  )
);

create index events_starts_at_idx on public.events (starts_at) where is_published;
create index events_club_id_idx on public.events (club_id);
create index events_category_id_idx on public.events (category_id);
create index events_title_trgm_idx on public.events using gin (title extensions.gin_trgm_ops);

create or replace function public.events_stamp_editor()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create trigger events_stamp_editor
  before update on public.events
  for each row execute function public.events_stamp_editor();

-- ---------------------------------------------------------------------------
-- Announcements: banners / notices shown in the app.
-- ---------------------------------------------------------------------------

create table public.announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null check (length(trim(title)) > 0),
  body       text,
  link_url   text,
  image_url  text,
  image_path text,
  is_active  boolean not null default true,
  starts_at  timestamptz,      -- null = visible immediately
  ends_at    timestamptz,      -- null = never expires
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- App config: key/value settings the app reads at startup.
-- ---------------------------------------------------------------------------

create table public.app_config (
  key         text primary key,
  value       jsonb not null,
  description text,
  updated_at  timestamptz not null default now()
);

create trigger app_config_set_updated_at
  before update on public.app_config
  for each row execute function public.set_updated_at();

insert into public.app_config (key, value, description) values
  ('timezone',          '"Asia/Kolkata"',  'Timezone used to decide what counts as today'),
  ('past_days',         '4',               'How many days back the Past tab shows'),
  ('upcoming_days',     '15',              'How many days ahead the Upcoming tab shows'),
  ('maintenance_mode',  'false',           'If true the app shows maintenance_message instead of content'),
  ('maintenance_message','"We are updating CUbuddy. Back soon!"', 'Message shown in maintenance mode'),
  ('min_app_version',   '"1.0.0"',         'App builds older than this should ask users to update'),
  ('contact_email',     'null',            'Shown in the app for queries');
