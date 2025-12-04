/*
# Add Storage Buckets for Admin Image Uploads

1. New Buckets
   - moving-service-images for moving service photos
   - admin-uploads for general admin uploads

2. Security
   - Public read access for all images
   - Admin can upload, update, and delete images
*/

-- Create additional storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('moving-service-images', 'moving-service-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('admin-uploads', 'admin-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for moving service images
CREATE POLICY "Moving service images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'moving-service-images');

CREATE POLICY "Admin can upload moving service images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'moving-service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update moving service images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'moving-service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete moving service images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'moving-service-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for admin uploads
CREATE POLICY "Admin uploads are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'admin-uploads');

CREATE POLICY "Admin can upload to admin bucket"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'admin-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update admin uploads"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete admin uploads"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.has_role(auth.uid(), 'admin'));