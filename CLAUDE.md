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

**Plant Growing App** — an Expo (SDK 49) React Native app for virtual plant cultivation with Firebase auth and local plant data.

### Navigation

Manual stack navigation via `@react-navigation/native-stack`. `App.js` is the entry point and renders a `RootNavigator` that conditionally shows one of two stacks based on auth state:

- **AuthStack**: Login → SignUp
- **AppStack**: Home → Purchase → PlantDetail

### State Management

Two React Contexts (no Redux/Zustand):

- **`context/AuthContext.js`** — Firebase Auth state (login, signup, logout, user profile from Firestore). Exposes `useAuth()`.
- **`context/PlantContext.js`** — Plant collection stored locally via `AsyncStorage`. Growth stages auto-advance based on elapsed time; an interval runs every 60 seconds. Exposes `usePlants()`.

Both contexts wrap the entire app in `App.js`.

### Firebase

Config lives in `config/firebase.js` (copy from `config/firebase.example.js` if missing). Exports `auth` and `db`. Firebase is used for:
- Authentication: email/password via Firebase Auth
- User profiles: stored in Firestore at `/users/{uid}`

Plant data is **not** synced to Firestore — it stays in `AsyncStorage` on the device only.

### Plant Growth Model

- 11 stages (Seed → Masterpiece), each stage takes 2 hours (20 hours total)
- Growth stage is computed from time elapsed since purchase
- Health metrics (water, sunlight, care) each decay over time and can be restored by the user
- Environmental impact (CO₂ offset, oxygen) is calculated per plant type and stage

### Components

Reusable components in `components/` are used exclusively inside `PlantDetailScreen`:
- `PlantVisualization` — SVG-based plant rendering that reflects growth stage
- `GrowthTimeline` — horizontal 11-stage scrollable timeline
- `PlantHealthMetrics` — water/sunlight/care progress bars with action buttons
- `PhotoGallery` — camera/gallery photo capture via `expo-image-picker`
- `LocationMap` — `react-native-maps` showing purchase location with reverse geocoding
- `EnvironmentalImpact` — carbon offset and oxygen production metrics
