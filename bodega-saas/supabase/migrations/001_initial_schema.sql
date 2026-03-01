-- ============================================================
-- Bodega Control SaaS — Initial Schema
-- Multi-tenant restaurant inventory management
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- Organizations (tenants)
-- ============================================================
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  plan text not null default 'trial' check (plan in ('trial', 'starter', 'pro', 'enterprise')),
  plan_status text not null default 'trialing' check (plan_status in ('active', 'past_due', 'cancelled', 'trialing')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  trial_ends_at timestamptz default (now() + interval '14 days'),
  max_products int not null default 50,
  max_users int not null default 2,
  max_locations int not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================================
-- User profiles (linked to auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  org_id uuid not null references public.organizations(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner', 'admin', 'manager', 'staff')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Products
-- ============================================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  sku text not null,
  category text not null check (category in ('carnes', 'pescados', 'lacteos', 'verduras', 'frutas', 'abarrotes', 'bebidas', 'congelados', 'condimentos', 'limpieza')),
  unit text not null default 'kg' check (unit in ('kg', 'lt', 'unidad', 'caja', 'botella', 'bolsa')),
  storage_zone text not null default 'ambiente' check (storage_zone in ('refrigerado', 'congelado', 'seco', 'ambiente')),
  current_stock numeric not null default 0,
  min_stock numeric not null default 0,
  max_stock numeric not null default 100,
  cost_per_unit numeric not null default 0,
  supplier text not null default '',
  shelf_life_days int not null default 7,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, sku)
);

-- ============================================================
-- Stock batches (for expiration tracking)
-- ============================================================
create table public.stock_batches (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  lot_number text not null,
  quantity numeric not null default 0,
  expiration_date date not null,
  received_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Stock movements
-- ============================================================
create table public.stock_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  type text not null check (type in ('entrada', 'salida', 'ajuste', 'merma')),
  quantity numeric not null,
  date timestamptz not null default now(),
  responsible text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Loss records
-- ============================================================
create table public.loss_records (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  quantity numeric not null,
  reason text not null check (reason in ('vencimiento', 'deterioro', 'robo', 'error_conteo', 'mal_almacenamiento', 'devolucion_proveedor', 'otro')),
  cost_impact numeric not null default 0,
  date timestamptz not null default now(),
  responsible text not null default '',
  preventable boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_profiles_org on public.profiles(org_id);
create index idx_products_org on public.products(org_id);
create index idx_products_category on public.products(org_id, category);
create index idx_stock_batches_product on public.stock_batches(product_id);
create index idx_stock_batches_expiry on public.stock_batches(org_id, expiration_date);
create index idx_stock_movements_product on public.stock_movements(product_id);
create index idx_stock_movements_date on public.stock_movements(org_id, date desc);
create index idx_loss_records_product on public.loss_records(product_id);
create index idx_loss_records_date on public.loss_records(org_id, date desc);

-- ============================================================
-- Row Level Security (multi-tenancy isolation)
-- ============================================================
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.stock_batches enable row level security;
alter table public.stock_movements enable row level security;
alter table public.loss_records enable row level security;

-- Helper: get user's org_id
create or replace function public.get_user_org_id()
returns uuid
language sql
stable
security definer
as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- Organizations: users can see their own org
create policy "Users can view own org"
  on public.organizations for select
  using (id = public.get_user_org_id());

create policy "Owners can update own org"
  on public.organizations for update
  using (id = public.get_user_org_id())
  with check (id = public.get_user_org_id());

-- Profiles: users can see profiles in their org
create policy "Users can view org profiles"
  on public.profiles for select
  using (org_id = public.get_user_org_id());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Products: org-scoped CRUD
create policy "Users can view org products"
  on public.products for select
  using (org_id = public.get_user_org_id());

create policy "Users can insert org products"
  on public.products for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update org products"
  on public.products for update
  using (org_id = public.get_user_org_id())
  with check (org_id = public.get_user_org_id());

create policy "Users can delete org products"
  on public.products for delete
  using (org_id = public.get_user_org_id());

-- Stock batches: org-scoped
create policy "Users can view org batches"
  on public.stock_batches for select
  using (org_id = public.get_user_org_id());

create policy "Users can insert org batches"
  on public.stock_batches for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update org batches"
  on public.stock_batches for update
  using (org_id = public.get_user_org_id())
  with check (org_id = public.get_user_org_id());

create policy "Users can delete org batches"
  on public.stock_batches for delete
  using (org_id = public.get_user_org_id());

-- Stock movements: org-scoped
create policy "Users can view org movements"
  on public.stock_movements for select
  using (org_id = public.get_user_org_id());

create policy "Users can insert org movements"
  on public.stock_movements for insert
  with check (org_id = public.get_user_org_id());

-- Loss records: org-scoped
create policy "Users can view org losses"
  on public.loss_records for select
  using (org_id = public.get_user_org_id());

create policy "Users can insert org losses"
  on public.loss_records for insert
  with check (org_id = public.get_user_org_id());

-- ============================================================
-- Auto-update updated_at on products
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  new_org_id uuid;
begin
  -- Create a new org for the user
  insert into public.organizations (name, slug)
  values (
    coalesce(new.raw_user_meta_data->>'org_name', split_part(new.email, '@', 1)),
    lower(replace(coalesce(new.raw_user_meta_data->>'org_name', split_part(new.email, '@', 1)), ' ', '-')) || '-' || substr(new.id::text, 1, 8)
  )
  returning id into new_org_id;

  -- Create profile
  insert into public.profiles (id, email, full_name, org_id, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new_org_id,
    'owner'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
