/*
# Update Super Admin Email

1. Changes
   - Update super admin email from samuelresearchafrica@gmail.com to samuelresearch@gmail.com
   - Ensure admin role is properly assigned
   - Update existing functions to use the new email

2. Security
   - Maintain admin privileges for the new email
   - Update triggers and functions accordingly
*/

-- Update the super admin email in existing functions
CREATE OR REPLACE FUNCTION public.setup_super_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the new user is the super admin, set their role to admin
  IF NEW.email = 'samuelresearch@gmail.com' THEN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Update the ensure super admin function
CREATE OR REPLACE FUNCTION public.ensure_super_admin_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id IN (
    SELECT id FROM auth.users
    WHERE email = 'samuelresearch@gmail.com'
  );
END;
$$;

-- Update any existing profile for the new super admin email
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'samuelresearch@gmail.com'
);

-- Run the function to ensure current super admin has admin role
SELECT public.ensure_super_admin_role();