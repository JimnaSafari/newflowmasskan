/*
# Add Admin Policies for Content Management

1. New Policies
   - Admin can view, create, update, and delete all properties
   - Admin can view, create, update, and delete all marketplace items
   - Admin can view, create, update, and delete all moving services
   - Admin can update booking, purchase, and quote statuses

2. Security
   - Only users with admin role can perform these operations
   - Moderators can view but not modify
*/

-- Admin policies for properties
CREATE POLICY "Admin can view all properties"
  ON public.properties
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can create properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update all properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete all properties"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for marketplace items
CREATE POLICY "Admin can view all marketplace items"
  ON public.marketplace_items
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can create marketplace items"
  ON public.marketplace_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update all marketplace items"
  ON public.marketplace_items
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete all marketplace items"
  ON public.marketplace_items
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for moving services
CREATE POLICY "Admin can view all moving services"
  ON public.moving_services
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can create moving services"
  ON public.moving_services
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update all moving services"
  ON public.moving_services
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete all moving services"
  ON public.moving_services
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for bookings management
CREATE POLICY "Admin can update all bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for purchases management
CREATE POLICY "Admin can update all purchases"
  ON public.purchases
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for quotes management
CREATE POLICY "Admin can update all quotes"
  ON public.mover_quotes
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Moderator policies (view-only access)
CREATE POLICY "Moderator can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderator can view all purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderator can view all quotes"
  ON public.mover_quotes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator'));