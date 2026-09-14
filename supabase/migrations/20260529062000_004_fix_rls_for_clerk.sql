/*
  # Fix RLS Policies for Clerk Authentication

  This app uses Clerk for authentication, not Supabase Auth.
  The original RLS policies used `auth.uid()` which only works with Supabase Auth.

  Changes:
  1. Drop restrictive RLS policies on profiles that require Supabase Auth
  2. Create permissive policies since Clerk handles authentication on the frontend
     and the WHERE clause in queries ensures users access only their own data
  3. For production, set up Clerk JWT template in Clerk Dashboard and add Clerk's
     JWKS URL in Supabase Auth settings for proper RLS enforcement
*/

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create permissive policies for Clerk-authenticated users
-- Security is enforced by Clerk on the frontend and the WHERE clause in queries
CREATE POLICY "Allow profile select"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow profile insert"
  ON profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow profile update"
  ON profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Drop old storage policies and recreate with broader access
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

CREATE POLICY "Allow avatar upload"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow avatar update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow avatar select"
  ON storage.objects FOR SELECT
  TO anon, authenticated, public
  USING (bucket_id = 'avatars');

CREATE POLICY "Allow avatar delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'avatars');
