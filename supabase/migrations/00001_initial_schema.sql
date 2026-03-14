-- ============================================
-- Onyx Labs — Database Schema
-- ============================================

-- ============================================
-- 1. USERS (extends auth.users)
-- ============================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  plan text not null default 'free'
    check (plan in ('free', 'starter', 'growth', 'business', 'agency')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- ============================================
-- 2. BRANDS
-- ============================================
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  voice_tone text not null default 'profesional'
    check (voice_tone in ('profesional', 'casual', 'inspirador', 'educativo', 'vendedor')),
  industry text,
  primary_color text,
  secondary_color text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.brands enable row level security;

create policy "Users can read own brands"
  on public.brands for select
  using (auth.uid() = user_id);

create policy "Users can insert own brands"
  on public.brands for insert
  with check (auth.uid() = user_id);

create policy "Users can update own brands"
  on public.brands for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own brands"
  on public.brands for delete
  using (auth.uid() = user_id);

-- ============================================
-- 3. CONTENT_GENERATIONS
-- ============================================
create table public.content_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  input_idea text not null,
  platform text not null
    check (platform in ('instagram', 'tiktok', 'linkedin', 'facebook', 'twitter')),
  generated_content text not null,
  hashtags text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.content_generations enable row level security;

create policy "Users can read own content"
  on public.content_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own content"
  on public.content_generations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own content"
  on public.content_generations for delete
  using (auth.uid() = user_id);

-- ============================================
-- 4. IMAGE_GENERATIONS
-- ============================================
create table public.image_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  prompt text not null,
  style text not null default 'minimalista'
    check (style in ('minimalista', 'bold', 'elegante', 'creativo')),
  image_url text not null,
  platform_size text not null,
  created_at timestamptz not null default now()
);

alter table public.image_generations enable row level security;

create policy "Users can read own images"
  on public.image_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own images"
  on public.image_generations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own images"
  on public.image_generations for delete
  using (auth.uid() = user_id);

-- ============================================
-- 5. USAGE_TRACKING
-- ============================================
create table public.usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  month date not null,
  content_count integer not null default 0,
  image_count integer not null default 0,
  unique (user_id, month)
);

alter table public.usage_tracking enable row level security;

create policy "Users can read own usage"
  on public.usage_tracking for select
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.usage_tracking for insert
  with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.usage_tracking for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- 6. Auto-create user profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 7. Indexes for performance
-- ============================================
create index idx_brands_user_id on public.brands(user_id);
create index idx_content_generations_user_id on public.content_generations(user_id);
create index idx_content_generations_brand_id on public.content_generations(brand_id);
create index idx_image_generations_user_id on public.image_generations(user_id);
create index idx_image_generations_brand_id on public.image_generations(brand_id);
create index idx_usage_tracking_user_id on public.usage_tracking(user_id);
create index idx_usage_tracking_month on public.usage_tracking(user_id, month);
