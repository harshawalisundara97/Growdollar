# Supabase Setup

Growdollar uses [Supabase](https://supabase.com) for authentication and as its
Postgres database (replacing the previous Firebase Auth + local AsyncStorage
setup). Follow these steps to connect your own project.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in / sign up.
2. Click **New project**, pick an organization, name it (e.g. `growdollar`),
   set a database password, and choose a region.
3. Wait for provisioning to finish (~2 minutes).

## 2. Run the database schema

1. In your project, open **SQL Editor**.
2. Paste the contents of [supabase/schema.sql](supabase/schema.sql) and run it.
   This creates:
   - `profiles` — one row per user (name, email), auto-populated on signup.
   - `plants` — replaces the AsyncStorage-only plant collection; one row per
     plant, scoped to `user_id` via Row Level Security so users only ever see
     their own plants.

## 3. Get your API keys

1. Go to **Project Settings > API**.
2. Copy the **Project URL** and the **anon / public** key.

## 4. Configure the app

1. Open [config/supabase.js](config/supabase.js).
2. Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with the
   values from step 3.
3. (Optional) Uncomment `# config/supabase.js` in `.gitignore` if you don't
   want your real keys committed — the anon key is safe to ship in a mobile
   client (RLS enforces access control), but many teams still keep it out of
   git.

## 5. (Optional) Email confirmation

By default Supabase requires email confirmation before a user can log in.
For local development you can disable this under **Authentication > Providers
> Email > Confirm email** to make signup instantly usable.

## 6. Run the app

```bash
npm start
```

Sign up with a new account — a matching row should appear in **Table Editor
> profiles**, and any plants you buy will appear in **Table Editor > plants**.
