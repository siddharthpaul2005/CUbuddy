-- Local/dev sample data. Runs on `supabase db reset` (local only, never on prod).
-- Event dates are relative to "today" so every tab has something in it.

insert into public.categories (name, icon, color, sort_order) values
  ('Technical', 'code',        '#38bdf8', 1),
  ('Cultural',  'music',       '#f472b6', 2),
  ('Sports',    'trophy',      '#c7f32c', 3),
  ('Workshop',  'wrench',      '#fb923c', 4),
  ('Seminar',   'mic',         '#a78bfa', 5),
  ('Esports',   'gamepad',     '#f87171', 6);

insert into public.clubs (name, short_name, description, sort_order) values
  ('Coding Club',    'CC',  'Competitive programming, hackathons and dev talks.', 1),
  ('Dance Club',     'DC',  'Western, classical and street dance crews.',          2),
  ('Robotics Club',  'RC',  'Bots, drones and everything with a servo.',           3),
  ('Sports Council', 'SPC', 'Inter-hostel and inter-college sports.',              4),
  ('Gaming Guild',   'GG',  'Valorant, BGMI and LAN nights.',                      5);

with
  tz as (select public.app_timezone() as name),
  day0 as (select (date_trunc('day', now() at time zone tz.name)) at time zone tz.name as start from tz),
  c as (select id, name from public.clubs),
  k as (select id, name from public.categories)
insert into public.events
  (title, description, club_id, category_id, organized_by, venue, starts_at, ends_at,
   rewards, registration_url, is_featured)
select
  v.title, v.description,
  (select id from c where c.name = v.club),
  (select id from k where k.name = v.category),
  v.organized_by, v.venue,
  day0.start + v.starts_offset,
  day0.start + v.starts_offset + v.duration,
  v.rewards, v.registration_url, v.is_featured
from day0, (values
  -- today
  ('AI Hackfest 2026',        'A 12-hour overnight hackathon. Teams of up to 4.', 'Coding Club',    'Technical', 'Coding Club core team', 'Auditorium B',      interval '18 hours',            interval '12 hours', 'Rs 5,000 pool + certificates', 'https://forms.gle/example-hackfest', true),
  ('Hostel Derby: Valorant',  '5v5 inter-hostel elimination bracket.',            'Gaming Guild',   'Esports',   'Gaming Guild',          'Gaming Lounge, Block C', interval '20 hours 30 minutes', interval '4 hours', 'Rs 8,000 + trophy', null, false),
  -- past
  ('Freshers Dance-Off',      'Solo and crew rounds.',                            'Dance Club',     'Cultural',  'Dance Club',            'Open Air Theatre',  interval '-1 day 18 hours',     interval '3 hours',  'Trophies for top 3', null, false),
  ('Line Follower Sprint',    'Fastest line follower wins.',                      'Robotics Club',  'Technical', 'Robotics Club',         'Mech Block Lab 2',  interval '-3 days 14 hours',    interval '3 hours',  'Rs 3,000 + kits', null, false),
  -- upcoming
  ('Intro to Git Workshop',   'Hands-on, bring a laptop.',                        'Coding Club',    'Workshop',  'Coding Club',           'CSE Lab 4',         interval '2 days 16 hours',     interval '2 hours',  'Participation certificate', 'https://forms.gle/example-git', false),
  ('Inter-Hostel Football',   'Knockout format, 7-a-side.',                       'Sports Council', 'Sports',    'Sports Council',        'Main Ground',       interval '6 days 7 hours',      interval '6 hours',  'Trophy + medals', null, true),
  ('Robotics Expo',           'Showcase of student-built robots.',                'Robotics Club',  'Seminar',   'Robotics Club',         'Central Atrium',    interval '12 days 11 hours',    interval '5 hours',  null, null, false)
) as v(title, description, club, category, organized_by, venue, starts_offset, duration, rewards, registration_url, is_featured);

insert into public.announcements (title, body, sort_order) values
  ('Welcome to CUbuddy', 'All campus events in one place. Pull down to refresh.', 1);
