# CUbuddy: Deployment Guide

```
 Admin panel (Vercel)  ──writes──►  Supabase (database + posters)  ◄──reads──  Student app (phone)
```

Posting an event doesn't need a redeploy. An admin saves it in the admin panel, it goes straight into Supabase, and the app shows it on the next refresh. You only redeploy when the **code** changes.

| Part | Where it lives | Status |
|---|---|---|
| Backend | Supabase project `jmosfnsmjykqxsahkojm` | ✅ Live |
| Admin panel | Your laptop now → Vercel (step 1) | To do |
| Student app | Expo Go now → APK / Play Store (step 2) | To do |

---

## Step 1: Put the admin panel online (Vercel, free)

1. Push this repo to GitHub.
2. Go to https://vercel.com, sign in with GitHub, then choose **Add New → Project** and pick the repo.
3. Set **Root Directory** to `admin`. The framework (Vite) is detected automatically.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://jmosfnsmjykqxsahkojm.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = the publishable key, which is in `admin/.env.local`
5. Click **Deploy**. You get a URL like `cubuddy-admin.vercel.app`.
6. In Supabase, go to **Authentication → URL Configuration** and set **Site URL** to that Vercel URL.

From now on, every push to GitHub redeploys the admin panel automatically.

**Posting an event:**
1. Open the Vercel URL and log in.
2. Go to **Events → New event**.
3. Upload the poster and fill in the details. Leave the registration link empty if the details are on the poster.
4. Click **Save**.

On phones the event appears when the app is opened, on pull-down-to-refresh, or when switching tabs (if more than 30 seconds have passed).

---

## Step 2: Ship the student app

### While developing: Expo Go

```powershell
cd D:\Dev\Projects\CUbuddy\native-app
npx expo start          # scan the QR code with Expo Go
npx expo start --tunnel # if phone and laptop can't see each other (e.g. college Wi-Fi)
```

Code changes appear on the phone instantly. If a change doesn't show up, stop the server and run `npx expo start --clear`.

### Sharing with testers: Android APK (free)

A real installable app. No Expo Go needed and no Play Store needed.

```powershell
cd D:\Dev\Projects\CUbuddy\native-app
npx eas-cli@latest login                                  # free account at expo.dev
npx eas-cli@latest build --platform android --profile preview
```

The first time, it asks to create a project and an Android signing key: answer **yes** to both. The build runs in Expo's cloud and takes about 10–20 minutes. It ends with a **link and QR code to download the `.apk`**. Share that link: people open it on Android and tap Install. Android will ask them to allow installing apps from that source.

### Public launch: Google Play Store

1. Create a Google Play Console account at https://play.google.com/console. It's a one-time $25 fee.
2. Build the store version:
   ```powershell
   npx eas-cli@latest build --platform android --profile production
   ```
3. Upload it. Either run `npx eas-cli@latest submit --platform android`, which needs a Google service-account key (Expo's docs walk through it), or download the `.aab` from expo.dev and upload it by hand in Play Console.
4. In Play Console, fill in the store listing, privacy policy and content rating, then release. Google's first review usually takes a few days.

**iPhone:** this needs an Apple Developer account ($99/year). Then run `npx eas-cli@latest build --platform ios --profile production` and `npx eas-cli@latest submit --platform ios`. To test on iPhones before that, Expo Go works.

### Updating the app after launch

- **Content** (events, clubs, banners, settings): the admin panel only. No app update.
- **Small code fixes** (screens, text, styling): you can push them over the air without a store review. Set it up once:
  ```powershell
  npx expo install expo-updates
  npx eas-cli@latest update:configure
  ```
  Then rebuild once with `eas build`. After that, ship fixes with:
  ```powershell
  npx eas-cli@latest update --channel production --message "Fix card layout"
  ```
- **New native packages, a new app icon or app.json changes**: these need a new `eas build` and a new store upload. Bump `"version"` in `native-app/app.json`.

---

## Emergency switches (admin panel → App settings)

| Setting | Effect |
|---|---|
| `maintenance_mode` = `true` | The app shows `maintenance_message` instead of events |
| `past_days` / `upcoming_days` | How far back and forward the Past and Upcoming tabs look |

Hide a single event by unticking **Published** on it.

---

## Checklist before going public

- [ ] Both real admin accounts created, with strong passwords (`backend/README.md`).
- [ ] `node --env-file=.env scripts/smoke-test.mjs <admin> <password>` in `backend/` shows all PASS.
- [ ] Real clubs and event types added in the admin panel.
- [ ] Admin panel deployed on Vercel, and Site URL set in Supabase.
- [ ] Supabase upgraded to **Pro** (about $25/month; check current pricing) before heavy use. The free tier pauses projects after a week of inactivity and has no daily backups.
- [ ] App icon and splash image replaced. They're in `native-app/assets/images/` and are still Expo's defaults.
- [ ] `com.cubuddy.app` in `native-app/app.json` is the app ID you want. It **can't change** after the first Play Store upload.
