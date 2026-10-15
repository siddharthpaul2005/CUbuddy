# CUbuddy Backend (Supabase)

There is no server to run or host. The backend is a Supabase project:

- **Postgres** stores clubs, event types, events, announcements and app settings.
- **Row Level Security** means anyone can read published content and only the 2 admins can change anything.
- **Storage** has a public `media` bucket for posters, club logos and banners.
- **Auth** holds the 2 admin logins. Public sign-up is disabled.

The student app reads data directly with `@supabase/supabase-js` using the public anon key. The admin panel (`../admin`) writes using an admin login.

```
supabase/
  migrations/   schema, security rules, API functions (source of truth)
  seed.sql      sample data, LOCAL ONLY
  config.toml   local dev config (signups disabled)
scripts/
  create-admin.mjs   create/reset an admin login
  smoke-test.mjs     checks reads, writes and security end to end
types/database.ts    generated TypeScript types for the app
```

---

## API for the student app

Setup (Expo app):

```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 1. On app start: `get_app_bootstrap`

```ts
const { data } = await supabase.rpc('get_app_bootstrap');
// data = {
//   server_time: '2026-10-15T...',
//   config: { past_days: 4, upcoming_days: 15, timezone: 'Asia/Kolkata',
//             maintenance_mode: false, maintenance_message: '...',
//             min_app_version: '1.0.0', contact_email: null, ... },
//   announcements: [{ id, title, body, link_url, image_url, is_active, starts_at, ends_at, sort_order }],
//   clubs:      [{ id, name, short_name, description, logo_url, instagram_url, website_url }],
//   categories: [{ id, name, icon, color }]
// }
```

Use `clubs` and `categories` for the filter chips. If `config.maintenance_mode` is true, show `config.maintenance_message`.

### 2. Today / Past / Upcoming tabs: `get_event_feed`

```ts
const { data, error } = await supabase.rpc('get_event_feed', {
  p_bucket: 'today',          // 'today' | 'past' | 'upcoming'   (required)
  p_club_id: null,            // filter by club (uuid)
  p_category_id: null,        // filter by event type (uuid)
  p_search: null,             // matches title, club name, venue
  p_limit: 50,                // max 200
  p_offset: 0,                // for paging
});
```

Each row looks like this:

| field | type | notes |
|---|---|---|
| `id` | uuid | |
| `title`, `description` | text | |
| `organized_by`, `venue` | text \| null | |
| `starts_at`, `ends_at` | ISO timestamp | `ends_at` may be null |
| `rewards` | text \| null | |
| `registration_url` | text \| null | **Null means "details are on the poster"**, so hide the Register button |
| `poster_url` | text \| null | public image URL; the download button saves this |
| `is_featured` | boolean | featured events are already sorted first |
| `club_id`, `club_name`, `club_short_name`, `club_logo_url` | | |
| `category_id`, `category_name`, `category_icon`, `category_color` | | |
| `days_from_today` | int | `0` today, `-1` yesterday, `2` day after tomorrow. Use it for the "Yesterday / 2d ago" chips and the "Tomorrow / This week" groups |

Sorting:
- **Today and Upcoming:** earliest first.
- **Past:** newest first.

The windows come from `app_config`: `past_days` (default 4) and `upcoming_days` (default 15). Admins can change them without an app update. "Today" is calculated in IST on the server, so a phone set to the wrong timezone still gets the right list.

### 3. Single event (deep link / detail screen)

```ts
const { data } = await supabase.from('event_feed').select('*').eq('id', eventId).maybeSingle();
```

### 4. Seeing admin changes

Fetch again on app open, on tab focus and on pull-to-refresh. That's enough for event listings.

For instant updates, the `events`, `announcements` and `app_config` tables are enabled for Supabase Realtime. Realtime keeps a live connection open for every user, so only add it if you really need it:

```ts
supabase.channel('events')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => refetch())
  .subscribe();
```

### 5. Poster download

`poster_url` is a public URL. On Expo, download it with `expo-file-system`, then save it with `expo-media-library`'s `saveToLibraryAsync`.

### TypeScript types

`types/database.ts` is generated from the schema. Copy it into the app and use `createClient<Database>(...)`. Regenerate it after any schema change:

```bash
npm run db:types          # from local
npm run db:types:remote   # from the linked hosted project
```

---

## Local development

Requires Docker Desktop to be running.

```bash
cd backend
npm install
npm run db:start            # prints API URL + anon/service keys
cp .env.example .env        # paste the keys printed above
npm run db:reset            # re-applies migrations + seed.sql
npm run admin:create -- admin1@cubuddy.local localpass123 "Admin One"
npm run test:api -- admin1@cubuddy.local localpass123
```

`db:reset` wipes the local database, including admins, so run `admin:create` again afterwards.

## Going live (hosted Supabase)

1. Create a project at https://supabase.com:
   - Region: **Mumbai (ap-south-1)**.
   - Save the database password in a password manager.
2. Link this folder and push the schema. This does **not** run `seed.sql`.
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npm run db:push
   ```
3. In the dashboard, go to **Authentication → Sign In / Providers**:
   - Turn **off** "Allow new users to sign up".
   - Keep **Email** enabled.
4. Put the hosted values into `backend/.env`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

   They're under **Project Settings → API**.
5. Create the 2 real admins with strong passwords:
   ```bash
   npm run admin:create -- first.admin@college.edu '<strong password>' "Name"
   npm run admin:create -- second.admin@college.edu '<strong password>' "Name"
   ```
6. Run `npm run test:api -- <admin email> <password>`. Every line should be PASS.
7. Add the real clubs and event types from the admin panel.

### Changing the schema later

Never edit a migration that has already been pushed. Instead:

1. Add a new one with `npx supabase migration new <name>`.
2. Test it locally with `npm run db:reset`.
3. Push it with `npm run db:push`.

### Keys: what is secret

| Key | Where it goes | Secret? |
|---|---|---|
| Project URL + **anon** key | student app, admin panel | No. It ships inside the app. Security comes from the database rules. |
| **service_role** key | `backend/.env` on your machine only | **Yes.** It bypasses all rules. Never put it in the app, the admin panel or git. |
| Database password | password manager | **Yes** |
