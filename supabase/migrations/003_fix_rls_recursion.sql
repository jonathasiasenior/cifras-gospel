-- Fix infinite recursion in profiles RLS policies
-- The old policies queried the profiles table inside RLS, causing loops.

-- Drop ALL existing policies on profiles
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

-- Re-enable RLS (in case it was disabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple non-recursive policies:
-- Users can always read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role (admin API) can do everything — handled by service_role bypass

-- Fix same recursion issue on other tables if they reference profiles
-- requests: users can insert/select their own
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'requests' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.requests', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "requests_insert_own"
  ON public.requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "requests_select_own"
  ON public.requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "requests_update_own"
  ON public.requests FOR UPDATE
  USING (auth.uid() = user_id);

-- song_edits: users can manage their own edits
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'song_edits' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.song_edits', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.song_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "song_edits_all_own"
  ON public.song_edits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_preferences: users can manage their own
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_preferences' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_preferences', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_preferences_all_own"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
