GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

DROP POLICY IF EXISTS "Users can insert own user role" ON public.user_roles;
CREATE POLICY "Users can insert own user role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'user'::app_role);

DROP POLICY IF EXISTS "Designated admin can insert own admin role" ON public.user_roles;
CREATE POLICY "Designated admin can insert own admin role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'admin'::app_role
  AND lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com')
);

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() AND lower(email) = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Admins can upload cms" ON storage.objects;
CREATE POLICY "Admins can upload cms"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can list cms" ON storage.objects;
CREATE POLICY "Admins can list cms"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'cms' AND public.has_role(auth.uid(), 'admin'::app_role));