/*
  # Fix Profiles Table

  This migration removes the email column from profiles table
  since email is already stored in auth.users table.

  ## Changes

  1. Remove email column from profiles table (user email is in auth.users)
*/

-- The email column doesn't exist in the profiles table as per our original migration
-- This migration is just a placeholder to document that we're using auth.users.email
-- instead of storing email in profiles

SELECT 1;