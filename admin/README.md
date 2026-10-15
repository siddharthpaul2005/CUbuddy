# CUbuddy Admin Panel

A web app for the 2 admins to manage everything the student app shows:

- **Events:** create, edit, delete, hide/publish, feature, with poster upload.
- **Clubs:** with logo upload.
- **Event types** (categories).
- **Announcements:** banners or notices with optional start/end dates.
- **App settings:** past/upcoming windows, maintenance mode, and so on.

Changes are live as soon as you save. The student app picks them up on its next refresh.

Posters are compressed in the browser (max 1080px, WebP) before upload, which keeps bandwidth costs low.

## Run locally

```bash
cd admin
npm install
cp .env.example .env.local   # URL + anon key (local: from `npm run db:start` in ../backend)
npm run dev                  # http://localhost:5173
```

## Deploy (Vercel, free)

1. Push the repo to GitHub, then import it at https://vercel.com/new.
2. Set **Root Directory** to `admin`. The framework preset is Vite.
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the hosted project's values.
4. Deploy.
5. In Supabase, go to **Authentication → URL Configuration** and set the Site URL to the Vercel URL.

`vercel.json` already handles page refreshes on routes like `/events/123`.

Only accounts listed in the `admins` table can sign in. Create them with `npm run admin:create` in `../backend`.
