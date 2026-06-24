DROP POLICY IF EXISTS "Anyone can view active tools" ON public.tools;
CREATE POLICY "Anyone can view active tools"
ON public.tools
FOR SELECT
TO anon, authenticated
USING (is_active = true OR lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can manage tools" ON public.tools;
CREATE POLICY "Admins can manage tools"
ON public.tools
FOR ALL
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (is_active = true OR lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Users view own messages" ON public.messages;
CREATE POLICY "Users view own messages"
ON public.messages
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins update messages" ON public.messages;
CREATE POLICY "Admins update messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins update profiles" ON public.profiles;
CREATE POLICY "Admins update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can manage faqs" ON public.faqs;
CREATE POLICY "Admins can manage faqs"
ON public.faqs
FOR ALL
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'))
WITH CHECK (lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can upload cms" ON storage.objects;
CREATE POLICY "Admins can upload cms"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms' AND lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can list cms" ON storage.objects;
CREATE POLICY "Admins can list cms"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'cms' AND lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can update cms" ON storage.objects;
CREATE POLICY "Admins can update cms"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cms' AND lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

DROP POLICY IF EXISTS "Admins can delete cms" ON storage.objects;
CREATE POLICY "Admins can delete cms"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cms' AND lower(auth.jwt() ->> 'email') = lower('Daniyalmarketingplan@gmail.com'));

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon;