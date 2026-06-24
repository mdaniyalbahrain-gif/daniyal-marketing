
-- ============ ROLES ============
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create policy "Admins can manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Auto-promote first user to admin
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ TOOLS ============
create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null default '',
  price numeric not null default 0,
  duration text not null default '1 Month',
  features text[] not null default '{}',
  badge text,
  emoji text not null default '✨',
  color text not null default 'from-primary to-accent',
  image_url text,
  whatsapp_link text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.tools to anon, authenticated;
grant all on public.tools to authenticated, service_role;

alter table public.tools enable row level security;
create policy "Anyone can view active tools" on public.tools for select using (is_active = true);
create policy "Admins can manage tools" on public.tools for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============ SERVICES ============
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  eyebrow text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  image_url text,
  cta_text text not null default 'Discuss your project',
  cta_link text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

grant select on public.services to anon, authenticated;
grant all on public.services to authenticated, service_role;

alter table public.services enable row level security;
create policy "Anyone can view active services" on public.services for select using (is_active = true);
create policy "Admins can manage services" on public.services for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============ TESTIMONIALS ============
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  quote text not null,
  rating int not null default 5,
  avatar_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on public.testimonials to anon, authenticated;
grant all on public.testimonials to authenticated, service_role;

alter table public.testimonials enable row level security;
create policy "Anyone can view active testimonials" on public.testimonials for select using (is_active = true);
create policy "Admins can manage testimonials" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============ FAQS ============
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  sort_order int not null default 0,
  is_active boolean not null default true
);

grant select on public.faqs to anon, authenticated;
grant all on public.faqs to authenticated, service_role;

alter table public.faqs enable row level security;
create policy "Anyone can view active faqs" on public.faqs for select using (is_active = true);
create policy "Admins can manage faqs" on public.faqs for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE ============
insert into storage.buckets (id, name, public) values ('cms', 'cms', true);

create policy "Public can read cms" on storage.objects for select using (bucket_id = 'cms');
create policy "Admins can upload cms" on storage.objects for insert to authenticated
  with check (bucket_id = 'cms' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can update cms" on storage.objects for update to authenticated
  using (bucket_id = 'cms' and public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete cms" on storage.objects for delete to authenticated
  using (bucket_id = 'cms' and public.has_role(auth.uid(), 'admin'));

-- ============ SEED DATA ============
insert into public.services (slug, title, eyebrow, description, features, image_url, sort_order) values
  ('digital-marketing', 'Digital Marketing that compounds', 'Digital Marketing', 'Full-funnel growth — strategy, creative, media buying, analytics and optimization, all under one roof.', array['Meta Ads','Google Ads','SEO','Lead Generation','Retargeting','Analytics & CRO'], 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', 1),
  ('graphic-design', 'Brand systems people remember', 'Graphic Designing', 'From logo to launch — identity systems, social assets and packaging that earn attention and trust.', array['Logo Design','Brand Identity','Social Posts','Web Banners','Packaging Design','Business Cards'], 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80', 2),
  ('video-editing', 'Videos that stop the scroll', 'Video Editing', 'Reels, ads and long-form — edited with rhythm, color and motion that keeps eyes glued and CTRs climbing.', array['Instagram Reels','TikTok Shorts','YouTube Videos','Performance Ads','Motion Graphics','Color Grading'], 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80', 3),
  ('photography', 'Photos that sell at first glance', 'Photography', 'Product, brand and social photography directed for commerce — every frame engineered to convert.', array['Product Photography','Brand Photography','Social Media Shoots','Lifestyle','Studio & On-location','Post-production'], 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&q=80', 4);

insert into public.tools (name, category, description, price, features, badge, emoji, color, sort_order) values
  ('Canva Pro', 'Design', 'Full Canva Pro suite with premium templates, brand kits, and background remover.', 4, array['Premium templates','Brand kit','Background remover','100GB storage'], 'Hot', '🎨', 'from-sky-400 to-indigo-500', 1),
  ('CapCut Pro', 'Video', 'Pro video editing with premium effects, transitions, and cloud rendering.', 5, array['Premium effects','4K export','Cloud space','AI tools'], 'Trending', '🎬', 'from-fuchsia-500 to-pink-500', 2),
  ('ChatGPT Plus', 'AI', 'GPT-4o, advanced reasoning, image generation and priority access.', 14, array['GPT-4o','DALL·E','Voice mode','Priority'], 'Featured', '🤖', 'from-emerald-400 to-teal-500', 3),
  ('Adobe Creative Cloud', 'Design', 'Photoshop, Illustrator, Premiere Pro, After Effects and more.', 18, array['All apps','100GB cloud','Fonts','Stock'], 'Hot', '🅰️', 'from-rose-500 to-orange-500', 4),
  ('Envato Elements', 'Design', 'Unlimited downloads — videos, music, templates, fonts and graphics.', 9, array['Unlimited DLs','Commercial license','Stock video','Premium fonts'], null, '🧩', 'from-lime-400 to-emerald-500', 5),
  ('SEMrush', 'SEO', 'Industry-leading SEO, PPC and competitor research toolkit.', 29, array['Keyword research','Site audit','Backlinks','Competitor data'], 'Featured', '📈', 'from-orange-400 to-amber-500', 6),
  ('Ahrefs', 'SEO', 'Premium SEO suite with backlinks, rank tracking and content explorer.', 35, array['Site explorer','Content gap','Rank tracker','Alerts'], 'Trending', '🔍', 'from-blue-500 to-cyan-500', 7),
  ('Notion AI', 'Productivity', 'AI-powered notes, docs and workspace for teams and solo creators.', 6, array['AI writing','Unlimited blocks','Collab','Templates'], null, '📝', 'from-zinc-400 to-zinc-600', 8),
  ('Midjourney', 'AI', 'World-class AI image generation — perfect for ads, branding and content.', 12, array['Fast hours','Commercial use','Stealth mode','200 imgs'], 'Hot', '🖼️', 'from-violet-500 to-purple-600', 9),
  ('Grammarly Premium', 'Productivity', 'Advanced writing assistant — tone, clarity and plagiarism checks.', 5, array['Tone detector','Plagiarism','Rewrites','Vocabulary'], null, '✍️', 'from-green-500 to-emerald-600', 10),
  ('LinkedIn Premium', 'Marketing', 'Unlock InMail, advanced search and business insights.', 15, array['InMail','Who viewed','Insights','Learning'], null, '💼', 'from-blue-600 to-sky-700', 11),
  ('ElevenLabs Pro', 'AI', 'Hyper-realistic AI voice generation for reels, ads and dubbing.', 10, array['Voice clone','Multilingual','Pro voices','Commercial'], 'Trending', '🎙️', 'from-pink-500 to-rose-500', 12);

insert into public.testimonials (name, role, quote, rating, sort_order) values
  ('Sarah Khan', 'Founder, BloomBeauty', 'Daniyal scaled our Meta ads from $2k to $50k/month with a 6x ROAS. Best investment we made.', 5, 1),
  ('James Carter', 'CEO, NorthPeak Apparel', 'The creative team is unreal. Our reels exploded and revenue doubled in 90 days.', 5, 2),
  ('Aisha Patel', 'Marketing Director, LumeHome', 'Strategy + execution under one roof. Our SEO traffic is up 312% YoY.', 5, 3),
  ('Marco Silva', 'Founder, GymPulse', 'They get performance marketing AND brand. Hard to find that combo.', 5, 4);

insert into public.faqs (question, answer, category, sort_order) values
  ('How long does account delivery take?', 'Most accounts are delivered within 1–4 hours of payment confirmation. Adobe and rare tools may take up to 24 hours.', 'tools', 1),
  ('Are the subscriptions secure and legit?', 'Yes. All subscriptions are sourced through official channels or verified partners. You get full access — no shady workarounds.', 'tools', 2),
  ('What if my account stops working?', 'We offer a 100% replacement guarantee for the entire rental period. Just message us on WhatsApp.', 'tools', 3),
  ('Can I extend my rental?', 'Absolutely. Message us 2–3 days before expiry and we''ll renew with a loyalty discount.', 'tools', 4),
  ('Do you offer bundle discounts?', 'Yes — rent 2+ tools and get 10–20% off. Message us on WhatsApp for a custom bundle quote.', 'tools', 5),
  ('Do you offer monthly retainers?', 'Yes — monthly retainers are our most popular option. We also do one-time projects and performance-based pricing for select clients.', 'services', 1),
  ('How do you measure success?', 'We agree on KPIs upfront (ROAS, CPL, CTR, rankings). Every report ties back to those metrics — no vanity numbers.', 'services', 2),
  ('Can I hire you for a single service?', 'Absolutely. Many clients start with one service and grow into a full package as trust builds.', 'services', 3),
  ('What industries do you specialize in?', 'E-commerce, SaaS, real estate, education, beauty, fashion, hospitality and personal brands.', 'services', 4);
