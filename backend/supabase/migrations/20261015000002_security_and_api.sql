-- Row Level Security, the public read API used by the app, and poster storage.
--
-- Rule of thumb:
--   * anon (the student app, no login) can only READ what is published/active
--   * only rows in public.admins can WRITE anything

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.admins        enable row level security;
alter table public.clubs         enable row level security;
alter table public.categories    enable row level security;
alter table public.events        enable row level security;
alter table public.announcements enable row level security;
alter table public.app_config    enable row level security;

-- admins: admins can see the list; changes go through the service role only.
create policy "admins: admins read"
  on public.admins for select to authenticated
  using ((select public.is_admin()));

-- clubs
create policy "clubs: public read active"
  on public.clubs for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "clubs: admin insert"
  on public.clubs for insert to authenticated
  with check ((select public.is_admin()));
create policy "clubs: admin update"
  on public.clubs for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "clubs: admin delete"
  on public.clubs for delete to authenticated
  using ((select public.is_admin()));

-- categories
create policy "categories: public read"
  on public.categories for select to anon, authenticated
  using (true);
create policy "categories: admin insert"
  on public.categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "categories: admin update"
  on public.categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "categories: admin delete"
  on public.categories for delete to authenticated
  using ((select public.is_admin()));

-- events
create policy "events: public read published"
  on public.events for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "events: admin insert"
  on public.events for insert to authenticated
  with check ((select public.is_admin()));
create policy "events: admin update"
  on public.events for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "events: admin delete"
  on public.events for delete to authenticated
  using ((select public.is_admin()));

-- announcements
create policy "announcements: public read live"
  on public.announcements for select to anon, authenticated
  using (
    (is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at > now()))
    or (select public.is_admin())
  );
create policy "announcements: admin insert"
  on public.announcements for insert to authenticated
  with check ((select public.is_admin()));
create policy "announcements: admin update"
  on public.announcements for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "announcements: admin delete"
  on public.announcements for delete to authenticated
  using ((select public.is_admin()));

-- app_config
create policy "app_config: public read"
  on public.app_config for select to anon, authenticated
  using (true);
create policy "app_config: admin insert"
  on public.app_config for insert to authenticated
  with check ((select public.is_admin()));
create policy "app_config: admin update"
  on public.app_config for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "app_config: admin delete"
  on public.app_config for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Public read API
-- ---------------------------------------------------------------------------

create or replace function public.app_timezone()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select value #>> '{}' from public.app_config where key = 'timezone'),
    'Asia/Kolkata'
  );
$$;

-- What a student sees for one event: event + club + category, published only.
create or replace view public.event_feed
with (security_invoker = true)
as
select
  e.id,
  e.title,
  e.description,
  e.organized_by,
  e.venue,
  e.starts_at,
  e.ends_at,
  e.rewards,
  e.registration_url,
  e.poster_url,
  e.is_featured,
  e.club_id,
  c.name       as club_name,
  c.short_name as club_short_name,
  c.logo_url   as club_logo_url,
  e.category_id,
  cat.name     as category_name,
  cat.icon     as category_icon,
  cat.color    as category_color,
  ((e.starts_at at time zone public.app_timezone())::date
    - (now() at time zone public.app_timezone())::date) as days_from_today,
  e.updated_at
from public.events e
left join public.clubs c       on c.id = e.club_id
left join public.categories cat on cat.id = e.category_id
where e.is_published;

-- The main endpoint for the Today / Past / Upcoming tabs.
--   p_bucket: 'today' | 'past' | 'upcoming'
-- Past and upcoming windows come from app_config (past_days, upcoming_days),
-- so admins can change them without an app update.
create or replace function public.get_event_feed(
  p_bucket      text,
  p_club_id     uuid    default null,
  p_category_id uuid    default null,
  p_search      text    default null,
  p_limit       integer default 100,
  p_offset      integer default 0
)
returns setof public.event_feed
language plpgsql
stable
set search_path = ''
as $$
declare
  tz            text    := public.app_timezone();
  today_start   timestamptz := (date_trunc('day', now() at time zone tz)) at time zone tz;
  past_days     integer := coalesce((select (value #>> '{}')::int from public.app_config where key = 'past_days'), 4);
  upcoming_days integer := coalesce((select (value #>> '{}')::int from public.app_config where key = 'upcoming_days'), 15);
  range_from    timestamptz;
  range_to      timestamptz;
  newest_first  boolean := false;
  search        text    := nullif(trim(p_search), '');
begin
  case lower(p_bucket)
    when 'today' then
      range_from := today_start;
      range_to   := today_start + interval '1 day';
    when 'past' then
      range_from := today_start - make_interval(days => past_days);
      range_to   := today_start;
      newest_first := true;
    when 'upcoming' then
      range_from := today_start + interval '1 day';
      range_to   := today_start + make_interval(days => upcoming_days + 1);
    else
      raise exception 'p_bucket must be one of today, past, upcoming (got %)', p_bucket
        using errcode = '22023';
  end case;

  return query
    select f.*
    from public.event_feed f
    where f.starts_at >= range_from
      and f.starts_at <  range_to
      and (p_club_id is null or f.club_id = p_club_id)
      and (p_category_id is null or f.category_id = p_category_id)
      and (search is null
           or f.title ilike '%' || search || '%'
           or f.club_name ilike '%' || search || '%'
           or f.venue ilike '%' || search || '%')
    order by
      f.is_featured desc,
      case when newest_first then f.starts_at end desc,
      case when not newest_first then f.starts_at end asc
    limit least(greatest(p_limit, 1), 200)
    offset greatest(p_offset, 0);
end;
$$;

-- One call the app makes at startup: settings, banners, filter options.
create or replace function public.get_app_bootstrap()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'server_time', now(),
    'config', coalesce(
      (select jsonb_object_agg(key, value) from public.app_config), '{}'::jsonb),
    'announcements', coalesce(
      (select jsonb_agg(to_jsonb(a) - 'image_path' - 'created_at' - 'updated_at'
                        order by a.sort_order, a.created_at desc)
       from public.announcements a
       where a.is_active
         and (a.starts_at is null or a.starts_at <= now())
         and (a.ends_at is null or a.ends_at > now())), '[]'::jsonb),
    'clubs', coalesce(
      (select jsonb_agg(jsonb_build_object(
                'id', c.id, 'name', c.name, 'short_name', c.short_name,
                'description', c.description, 'logo_url', c.logo_url,
                'instagram_url', c.instagram_url, 'website_url', c.website_url)
              order by c.sort_order, c.name)
       from public.clubs c where c.is_active), '[]'::jsonb),
    'categories', coalesce(
      (select jsonb_agg(jsonb_build_object(
                'id', k.id, 'name', k.name, 'icon', k.icon, 'color', k.color)
              order by k.sort_order, k.name)
       from public.categories k), '[]'::jsonb)
  );
$$;

grant select on public.event_feed to anon, authenticated;
grant execute on function public.get_event_feed(text, uuid, uuid, text, integer, integer) to anon, authenticated;
grant execute on function public.get_app_bootstrap() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Realtime (optional for the app to subscribe to; respects RLS)
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.events, public.announcements, public.app_config;

-- ---------------------------------------------------------------------------
-- Storage: one public bucket for posters, club logos and banner images.
-- Public bucket = anyone can download by URL; only admins can upload/change.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media: admin read"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "media: admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
