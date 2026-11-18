/*
# Create profiles table with role-based access control

## Overview
Creates the `profiles` table that extends Supabase's built-in `auth.users` table
with application-specific user information: full name, assigned role, and
active status. Five roles are supported via a CHECK constraint:
admin, salesman, production_supervisor, owner, accountant.

## New Tables
### profiles
- `id` (uuid, primary key) — matches the auth.users id (one-to-one).
- `email` (text, not null) — mirrored from auth.users for convenient querying.
- `full_name` (text, not null) — display name shown across the app.
- `role` (text, not null) — one of: admin, salesman, production_supervisor, owner, accountant.
- `is_active` (boolean, default true) — lets an admin deactivate a user without deleting the auth account.
- `created_at` (timestamptz, default now()).
- `updated_at` (timestamptz, default now()).

## Functions
### public.handle_new_user()
Trigger function fired on INSERT into auth.users. It creates a matching
profiles row so every signed-up user has a profile. The role defaults to
'salesman' (least-privileged) and can be changed later by an admin.

### public.update_updated_at()
Trigger function that keeps `profiles.updated_at` in sync on every UPDATE.

## Triggers
- `on_auth_user_created` — AFTER INSERT on auth.users → calls handle_new_user().
- `profiles_updated_at` — BEFORE UPDATE on profiles → calls update_updated_at().

## Security
- RLS ENABLED on profiles.
- GRANT SELECT, UPDATE to authenticated (no INSERT/DELETE — profiles are
  created only by the trigger, and users cannot delete their own profile row).
- SELECT policy: an authenticated user can read ALL profiles (needed so users
  can see names of colleagues who created/verified orders, for example). The
  role column itself is not sensitive in this app.
- UPDATE policy: a user may only update their OWN profile (e.g. display name).
  Role changes are performed by admins via a SECURITY DEFINER function added
  in a later migration, not via direct table updates.
- The `handle_new_user` function is SECURITY DEFINER so it can insert into
  profiles even though authenticated users do not have INSERT privilege.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'salesman'
    CHECK (role IN ('admin','salesman','production_supervisor','owner','accountant')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- SELECT: any authenticated user can read profiles (names/roles are shared across the ERP)
DROP POLICY IF EXISTS "profiles_select_all_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_all_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated USING (true);

-- UPDATE: a user can update only their own profile row
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Function to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function that runs when a new auth.users row is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- The SECURITY DEFINER function needs to insert into profiles; grant it explicitly.
GRANT INSERT ON public.profiles TO service_role;
