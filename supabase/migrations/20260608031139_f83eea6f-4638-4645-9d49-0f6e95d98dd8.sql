GRANT SELECT ON public.tools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tools TO authenticated;
GRANT ALL ON public.tools TO service_role;

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

GRANT INSERT ON public.messages TO anon;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND (
        _role <> 'admin'::app_role
        OR lower(p.email) = lower('Daniyalmarketingplan@gmail.com')
      )
  )
$$;

CREATE OR REPLACE FUNCTION public.enforce_single_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  account_email text;
BEGIN
  IF NEW.role = 'admin'::app_role THEN
    SELECT email INTO account_email
    FROM public.profiles
    WHERE id = NEW.user_id;

    IF lower(coalesce(account_email, '')) <> lower('Daniyalmarketingplan@gmail.com') THEN
      RAISE EXCEPTION 'Only the Daniyal Marketing Planner account can be admin';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_single_admin_role_trigger ON public.user_roles;
CREATE TRIGGER enforce_single_admin_role_trigger
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_single_admin_role();

DROP POLICY IF EXISTS "Anyone can submit a message" ON public.messages;
CREATE POLICY "Anyone can submit a message"
ON public.messages
FOR INSERT
TO anon, authenticated
WITH CHECK ((auth.uid() IS NULL AND user_id IS NULL) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users view own messages" ON public.messages;
CREATE POLICY "Users view own messages"
ON public.messages
FOR SELECT
TO authenticated
USING ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update messages" ON public.messages;
CREATE POLICY "Admins update messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders"
ON public.orders
FOR SELECT
TO authenticated
USING ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
CREATE POLICY "Users create own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING ((id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND lower(email) = lower((auth.jwt() ->> 'email')));

DROP POLICY IF EXISTS "Admins update profiles" ON public.profiles;
CREATE POLICY "Admins update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view active tools" ON public.tools;
CREATE POLICY "Anyone can view active tools"
ON public.tools
FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage tools" ON public.tools;
CREATE POLICY "Admins can manage tools"
ON public.tools
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));