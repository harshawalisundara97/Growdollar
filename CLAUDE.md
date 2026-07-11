# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

No lint or test scripts are configured. There is no testing infrastructure in this project.

## Architecture

**Plant Growing App** — an Expo (SDK 49) React Native app for virtual plant cultivation with Supabase auth and a Supabase Postgres database.

### Navigation

Manual stack navigation via `@react-navigation/native-stack`. `App.js` is the entry point and renders a `RootNavigator` that conditionally shows one of two stacks based on auth state:

- **AuthStack**: Login → SignUp
- **AppStack**: Home → Purchase → PlantDetail

### State Management

Two React Contexts (no Redux/Zustand):

- **`context/AuthContext.js`** — Supabase Auth state (login, signup, logout, user profile from the `profiles` table). Exposes `useAuth()`.
- **`context/PlantContext.js`** — Plant collection synced to the Supabase `plants` table, scoped to the signed-in user via Row Level Security. Growth stages auto-advance based on elapsed time; an interval runs every 60 seconds and persists any stage changes back to Supabase. Exposes `usePlants()`.

Both contexts wrap the entire app in `App.js` (`ThemeProvider > AuthProvider > PlantProvider`), so `PlantProvider` can read the signed-in user from `useAuth()`.

### Supabase

Config lives in `config/supabase.js` (copy from `config/supabase.example.js` if missing) — see [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for full setup steps. Exports `supabase` client and `isSupabaseConfigured`. Supabase is used for:
- Authentication: email/password via Supabase Auth (`supabase.auth`)
- User profiles: `public.profiles` table (auto-created on signup via a Postgres trigger, see `supabase/schema.sql`)
- Plant data: `public.plants` table, one row per plant, RLS-scoped to `auth.uid()`

`context/PlantContext.js` maps between the app's camelCase plant shape and the table's snake_case columns (`rowToPlant` / `plantToRow`).

### Plant Growth Model

- 11 stages (Seed → Masterpiece), each stage takes 2 hours (20 hours total)
- Growth stage is computed from time elapsed since purchase
- Health metrics (water, sunlight, care) each decay over time and can be restored by the user
- Environmental impact (CO₂ offset, oxygen) is calculated per plant type and stage

### Plant Data Shape

Each plant object (as used in app code, mapped from the `plants` table row) has: `id`, `type`, `color`, `name`, `purchasedAt` (Unix ms), `growthStage` (0–10), `growthHistory` (array of `{stage, timestamp}`), `healthMetrics` (`water`, `sunlight`, `care` 0–100 + `lastWatered/lastSunlight/lastCared` timestamps), `environmentalImpact` (`carbonOffset`, `oxygenProduced`, `treesEquivalent`), `location` (`latitude`, `longitude`, `address`), `photos` (array of `{uri, timestamp, growthStage}`), `aiInsights` (array, reserved for the planned AI plant-scan feature).

Health metrics decay rates: water −2%/hr, sunlight −1.5%/hr, care −1%/hr. Carbon offset rates per growth stage: Tree 2.5 kg, Cherry Blossom 1.0 kg, Cactus 0.2 kg, Rose 0.15 kg, Sunflower/Tulip 0.1 kg. Oxygen = carbonOffset × 0.73; treesEquivalent = carbonOffset / 22.

### Components

- `PlantCard` — plant summary card used in `HomeScreen` (FlatList)
- `PlantVisualization` — SVG-based plant rendering that reflects growth stage (used in `PlantDetailScreen`)
- `GrowthTimeline` — horizontal 11-stage scrollable timeline (used in `PlantDetailScreen`)
- `PlantHealthMetrics` — water/sunlight/care progress bars with action buttons (used in `PlantDetailScreen`)
- `PhotoGallery` — camera/gallery photo capture via `expo-image-picker` (used in `PlantDetailScreen`)
- `LocationMap` — `react-native-maps` showing purchase location with reverse geocoding (used in `PlantDetailScreen`)
- `EnvironmentalImpact` — carbon offset and oxygen production metrics (used in `PlantDetailScreen`)

### Payment

Purchase is **simulated** (1.5 s fake delay, no real charge). To add real payments, replace the `await new Promise(resolve => setTimeout(resolve, 1500))` block in `PurchaseScreen.js` with Stripe (`@stripe/stripe-react-native`), `expo-in-app-purchases`, or a similar provider.
