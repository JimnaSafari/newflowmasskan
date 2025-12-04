-- Set up super admin user
-- This migration ensures samuelresearchafrica@gmail.com has admin privileges

-- First, update any existing profile for the super admin email
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'samuelresearchafrica@gmail.com'
);

-- Create a function to automatically assign admin role to super admin email
CREATE OR REPLACE FUNCTION public.setup_super_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the new user is the super admin, set their role to admin
  IF NEW.email = 'samuelresearchafrica@gmail.com' THEN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to automatically set super admin role on user creation
DROP TRIGGER IF EXISTS setup_super_admin_trigger ON auth.users;
CREATE TRIGGER setup_super_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.setup_super_admin();

-- Also create a function to ensure super admin role is maintained
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
    WHERE email = 'samuelresearchafrica@gmail.com'
  );
END;
$$;

-- Run the function to ensure current super admin has admin role
SELECT public.ensure_super_admin_role();
