ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS is_trending boolean;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS is_hot boolean;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS is_featured boolean;

UPDATE public.tools
SET
  is_trending = COALESCE(is_trending, false) OR COALESCE(badge = 'Trending', false),
  is_hot = COALESCE(is_hot, false) OR COALESCE(badge = 'Hot', false),
  is_featured = COALESCE(is_featured, false) OR COALESCE(badge = 'Featured', false);

ALTER TABLE public.tools ALTER COLUMN is_trending SET DEFAULT false;
ALTER TABLE public.tools ALTER COLUMN is_hot SET DEFAULT false;
ALTER TABLE public.tools ALTER COLUMN is_featured SET DEFAULT false;
ALTER TABLE public.tools ALTER COLUMN is_trending SET NOT NULL;
ALTER TABLE public.tools ALTER COLUMN is_hot SET NOT NULL;
ALTER TABLE public.tools ALTER COLUMN is_featured SET NOT NULL;