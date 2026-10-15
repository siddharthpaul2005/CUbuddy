# CUbuddy: Student App (Expo)

Shows campus events from the CUbuddy backend in three tabs: **Today**, **Past** (last 4 days) and **Upcoming** (next 15 days). Events can be filtered by club and event type. Tapping an event opens its details, the full poster, a **Save poster** button and a **Register** button (only when the event has a link). No login.

All content comes from the admin panel, so nothing about events is hardcoded here.

## Run it

```bash
npm install
npx expo start            # phone and laptop on the same Wi-Fi: scan the QR with Expo Go
npm run tunnel            # anything else (wired laptop, college network): Cloudflare tunnel
```

`.env` holds the public Supabase URL and publishable key. It's committed on purpose: those values ship inside the app anyway.

`npm run tunnel` needs cloudflared once: `winget install Cloudflare.cloudflared`. Use it instead of `expo start --tunnel`, whose ngrok connection is often blocked on college networks.

## Structure

```
src/app/            routes (expo-router): _layout.tsx (splash, providers), index.tsx (tabs)
src/screens/        FeedScreen: one screen used by all three tabs
src/components/     EventCard, EventDetail, FilterBar, Announcements, StateView
src/hooks/          useRemote (fetch + refetch on focus), useBootstrap (settings/clubs/types)
src/lib/            api.ts (backend calls), dates.ts (IST formatting), poster.ts (save to gallery), theme.ts
```

Backend API reference: `../backend/README.md`. Shipping the app: `../DEPLOYMENT.md`.

## Checks

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
```
