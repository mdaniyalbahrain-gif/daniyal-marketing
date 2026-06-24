REVOKE ALL ON FUNCTION public.enforce_single_admin_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_single_admin_role() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_single_admin_role() FROM authenticated;
REVOKE ALL ON FUNCTION public.enforce_single_admin_role() FROM service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;