-- ============================================================================
-- Bank Sampah Desa Rowotamtu — Initial Database Schema
-- Version 1.0 — KKN-K ROWOTAMTU 2026
-- ============================================================================
-- This migration creates all tables, RLS policies, triggers, and helper
-- functions required by the Bank Sampah application.
--
-- Tables:
--   1. profiles        — user profile for every auth.users entry
--   2. nasabah          — customer-specific data (extends profiles)
--   3. waste_categories — master: waste category groups
--   4. waste_types      — master: individual waste types with prices
--   5. deposits         — transaction header for waste deposits
--   6. deposit_items    — line items within a deposit
--   7. withdrawals      — cash withdrawal records
--   8. settings         — single-row company profile (for future use)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'nasabah');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.nasabah_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 1. PROFILES
-- ============================================================================
-- Stores application profile info for every authenticated user.
-- Linked 1:1 to auth.users via id.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        public.user_role NOT NULL DEFAULT 'nasabah',
  full_name   TEXT NOT NULL DEFAULT '',
  phone       TEXT DEFAULT '',
  photo_url   TEXT DEFAULT '',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Application profile for every authenticated user';

-- Auto-create a profile row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'nasabah'::public.user_role),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger: fire after a new user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- SECURITY DEFINER Helper function to check if current user is admin without triggering RLS infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (public transparency for village bank dashboard)
CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (TRUE);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================================================
-- 2. NASABAH
-- ============================================================================
-- Customer-specific information. Not every profile is a nasabah.

CREATE TABLE IF NOT EXISTS public.nasabah (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id     UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_number  TEXT UNIQUE,
  nik            TEXT NOT NULL UNIQUE,
  address        TEXT DEFAULT '',
  rt_rw          TEXT DEFAULT '',
  dusun          TEXT DEFAULT '',
  join_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  status         public.nasabah_status NOT NULL DEFAULT 'active',
  notes          TEXT DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.nasabah IS 'Customer-specific data extending profiles';

-- Auto-generate member number
CREATE OR REPLACE FUNCTION public.generate_member_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(member_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.nasabah
  WHERE member_number IS NOT NULL AND member_number ~ '^BS-\d+$';

  NEW.member_number = 'BS-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER nasabah_auto_member_number
  BEFORE INSERT ON public.nasabah
  FOR EACH ROW
  WHEN (NEW.member_number IS NULL)
  EXECUTE FUNCTION public.generate_member_number();

-- RLS for nasabah
ALTER TABLE public.nasabah ENABLE ROW LEVEL SECURITY;

-- Anyone can read nasabah records (for village stats and admin forms)
CREATE POLICY "Anyone can read nasabah"
  ON public.nasabah FOR SELECT
  USING (TRUE);

-- Admins have full write access to nasabah
CREATE POLICY "Admins can manage nasabah"
  ON public.nasabah FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 3. WASTE_CATEGORIES
-- ============================================================================
-- Master table for waste category groups (e.g., Plastik, Kertas, Logam).

CREATE TABLE IF NOT EXISTS public.waste_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.waste_categories IS 'Master waste category groups';

-- RLS: public read, admin write
ALTER TABLE public.waste_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read waste categories"
  ON public.waste_categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage waste categories"
  ON public.waste_categories FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 4. WASTE_TYPES
-- ============================================================================
-- Individual waste types with pricing. Each belongs to one category.

CREATE TABLE IF NOT EXISTS public.waste_types (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id  UUID NOT NULL REFERENCES public.waste_categories(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  price_per_kg NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price_per_kg >= 0),
  unit         TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'liter', 'pcs')),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.waste_types IS 'Individual waste types with current pricing';

-- RLS: public read, admin write
ALTER TABLE public.waste_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read waste types"
  ON public.waste_types FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage waste types"
  ON public.waste_types FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 5. DEPOSITS
-- ============================================================================
-- Transaction header for waste deposits.
-- One deposit can contain multiple waste items (in deposit_items).

CREATE TABLE IF NOT EXISTS public.deposits (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.nasabah(id) ON DELETE RESTRICT,
  recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  notes       TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.deposits IS 'Deposit transaction headers';

-- RLS for deposits
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Anyone can read deposits (for public dashboard rekapitulasi)
CREATE POLICY "Anyone can read deposits"
  ON public.deposits FOR SELECT
  USING (TRUE);

-- Admins have full access
CREATE POLICY "Admins can manage deposits"
  ON public.deposits FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 6. DEPOSIT_ITEMS
-- ============================================================================
-- Line items within a deposit. Stores historical price at time of transaction.

CREATE TABLE IF NOT EXISTS public.deposit_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deposit_id   UUID NOT NULL REFERENCES public.deposits(id) ON DELETE CASCADE,
  waste_type_id UUID NOT NULL REFERENCES public.waste_types(id) ON DELETE RESTRICT,
  weight       NUMERIC(10, 2) NOT NULL CHECK (weight > 0),
  price_per_kg NUMERIC(12, 2) NOT NULL CHECK (price_per_kg >= 0),
  subtotal     NUMERIC(14, 2) NOT NULL GENERATED ALWAYS AS (weight * price_per_kg) STORED
);

COMMENT ON TABLE public.deposit_items IS 'Line items within a deposit transaction';
COMMENT ON COLUMN public.deposit_items.price_per_kg IS 'Historical price at time of transaction — never changes';
COMMENT ON COLUMN public.deposit_items.subtotal IS 'Auto-calculated: weight × price_per_kg';

-- RLS for deposit_items (inherits from deposits)
ALTER TABLE public.deposit_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read deposit items
CREATE POLICY "Anyone can read deposit items"
  ON public.deposit_items FOR SELECT
  USING (TRUE);

-- Admins have full access
CREATE POLICY "Admins can manage deposit items"
  ON public.deposit_items FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 7. WITHDRAWALS
-- ============================================================================
-- Cash withdrawal records. Physical cash given offline by admin.

CREATE TABLE IF NOT EXISTS public.withdrawals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.nasabah(id) ON DELETE RESTRICT,
  amount      NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  recorded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  notes       TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.withdrawals IS 'Offline cash withdrawal records';

-- RLS for withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Anyone can read withdrawals
CREATE POLICY "Anyone can read withdrawals"
  ON public.withdrawals FOR SELECT
  USING (TRUE);

-- Admins have full access
CREATE POLICY "Admins can manage withdrawals"
  ON public.withdrawals FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 8. SETTINGS
-- ============================================================================
-- Single-row company profile. Reserved for future use.

CREATE TABLE IF NOT EXISTS public.settings (
  id              SERIAL PRIMARY KEY,
  bank_name       TEXT NOT NULL DEFAULT 'Bank Sampah Desa Rowotamtu',
  description     TEXT DEFAULT '',
  address         TEXT DEFAULT '',
  phone           TEXT DEFAULT '',
  email           TEXT DEFAULT '',
  logo_url        TEXT DEFAULT '',
  maps_url        TEXT DEFAULT '',
  operating_hours JSONB DEFAULT '{}',
  instagram       TEXT DEFAULT '',
  facebook        TEXT DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.settings IS 'Single-row company profile configuration';

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- RLS: public read, admin write
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON public.settings FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can manage settings"
  ON public.settings FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- 9. HELPER FUNCTIONS
-- ============================================================================

-- Calculate nasabah balance (Total Deposits - Total Withdrawals)
CREATE OR REPLACE FUNCTION public.get_nasabah_balance(p_nasabah_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(
      (SELECT SUM(di.subtotal)
       FROM public.deposits d
       JOIN public.deposit_items di ON di.deposit_id = d.id
       WHERE d.customer_id = p_nasabah_id),
      0
    )
    -
    COALESCE(
      (SELECT SUM(w.amount)
       FROM public.withdrawals w
       WHERE w.customer_id = p_nasabah_id),
      0
    );
$$;

COMMENT ON FUNCTION public.get_nasabah_balance IS 'Calculate real-time balance: SUM(deposit_items.subtotal) - SUM(withdrawals.amount)';

-- Get nasabah total weight deposited
CREATE OR REPLACE FUNCTION public.get_nasabah_total_kg(p_nasabah_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (SELECT SUM(di.weight)
     FROM public.deposits d
     JOIN public.deposit_items di ON di.deposit_id = d.id
     WHERE d.customer_id = p_nasabah_id),
    0
  );
$$;

COMMENT ON FUNCTION public.get_nasabah_total_kg IS 'Calculate total weight (kg) deposited by a nasabah';

-- ============================================================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_nasabah_profile_id ON public.nasabah(profile_id);
CREATE INDEX IF NOT EXISTS idx_nasabah_nik ON public.nasabah(nik);
CREATE INDEX IF NOT EXISTS idx_waste_types_category_id ON public.waste_types(category_id);
CREATE INDEX IF NOT EXISTS idx_deposits_customer_id ON public.deposits(customer_id);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON public.deposits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deposit_items_deposit_id ON public.deposit_items(deposit_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_customer_id ON public.withdrawals(customer_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON public.withdrawals(created_at DESC);
