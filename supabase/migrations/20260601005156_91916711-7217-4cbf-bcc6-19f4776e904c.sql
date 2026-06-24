
-- Public bucket files are still served via public URL; only admins can list via the API
drop policy if exists "Public can read cms" on storage.objects;
create policy "Admins can list cms" on storage.objects for select to authenticated
  using (bucket_id = 'cms' and public.has_role(auth.uid(), 'admin'));

-- Restrict EXECUTE on internal SECURITY DEFINER functions
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
