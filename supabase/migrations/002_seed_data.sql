-- ============================================================================
-- Bank Sampah Desa Rowotamtu — Seed Data
-- Version 1.0 — KKN-K ROWOTAMTU 2026
-- ============================================================================
-- IMPORTANT: This file uses Supabase Auth Admin API to create users.
-- Run this AFTER 001_initial_schema.sql has been applied.
--
-- The auth.users entries are created via supabase_admin functions.
-- The profiles are auto-created by the on_auth_user_created trigger.
-- 
-- Login convention:
--   NIK → email: {nik}@banksampah.local
--   Default password: 123456
-- ============================================================================

-- ============================================================================
-- 1. SEED: WASTE CATEGORIES
-- ============================================================================

INSERT INTO public.waste_categories (id, name, description) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Plastik',     'Berbagai jenis sampah plastik daur ulang'),
  ('11111111-0000-0000-0000-000000000002', 'Kertas',      'Kardus, kertas HVS, buku, dan majalah bekas'),
  ('11111111-0000-0000-0000-000000000003', 'Logam',       'Kaleng alumunium, besi, dan seng bekas'),
  ('11111111-0000-0000-0000-000000000004', 'Kaca',        'Botol kaca utuh dan pecahan kaca aman'),
  ('11111111-0000-0000-0000-000000000005', 'Minyak',      'Minyak jelantah (Used Cooking Oil)'),
  ('11111111-0000-0000-0000-000000000006', 'Elektronik',  'Sampah elektronik kecil dan komponen')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. SEED: WASTE TYPES
-- ============================================================================

INSERT INTO public.waste_types (id, category_id, name, price_per_kg, unit, is_active) VALUES
  -- Plastik
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001',
   'Botol Plastik Bening (PET)', 3500, 'kg', TRUE),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001',
   'Plastik HD / Emberan', 2500, 'kg', TRUE),

  -- Kertas
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002',
   'Kardus Bekas (Gelombang)', 2000, 'kg', TRUE),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002',
   'Kertas HVS / Buku / Majalah', 2800, 'kg', TRUE),

  -- Logam
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003',
   'Kaleng Alumunium Minuman', 13000, 'kg', TRUE),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003',
   'Besi Padat / Seng Bekas', 4500, 'kg', TRUE),

  -- Kaca
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000004',
   'Botol Kaca Bening / Kecap', 1200, 'kg', TRUE),

  -- Minyak
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000005',
   'Minyak Jelantah (UCO)', 6000, 'liter', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. SEED: AUTH USERS + PROFILES + NASABAH
-- ============================================================================
-- NOTE: Creating auth users requires using Supabase Dashboard or the
-- supabase.auth.admin API. The SQL below creates the profile and nasabah
-- rows, assuming the auth.users entries are created separately.
--
-- Use the following credentials in Supabase Dashboard > Authentication:
--
-- Admin:
--   Email: 3213010101950001@banksampah.local
--   Password: 123456
--   user_metadata: {"role": "admin", "full_name": "Pengurus KKN-K ROWOTAMTU", "phone": "081234567890"}
--
-- Nasabah 1:
--   Email: 3213015408850001@banksampah.local
--   Password: 123456
--   user_metadata: {"role": "nasabah", "full_name": "Ibu Siti Aminah", "phone": "085712345678"}
--
-- Nasabah 2:
--   Email: 3213011204780002@banksampah.local
--   Password: 123456
--   user_metadata: {"role": "nasabah", "full_name": "Pak Budi Santoso", "phone": "081987654321"}
--
-- Nasabah 3:
--   Email: 3213012109920003@banksampah.local
--   Password: 123456
--   user_metadata: {"role": "nasabah", "full_name": "Teh Rina Karlina", "phone": "082199887766"}
--
-- After creating users in Supabase Dashboard, the on_auth_user_created
-- trigger will auto-create profiles. Then run the nasabah INSERT below.
-- ============================================================================

-- ============================================================================
-- 3a. NASABAH RECORDS (run after auth users + profiles exist)
-- ============================================================================
-- Replace the profile_id values below with the actual UUIDs from auth.users
-- after you create them in Supabase Dashboard.
--
-- Example (placeholder UUIDs — replace with real ones):

-- INSERT INTO public.nasabah (id, profile_id, nik, address, rt_rw, dusun, join_date, status) VALUES
--   ('n0000001-0000-0000-0000-000000000001',
--    '<ADMIN_USER_UUID — skip this, admin is not a nasabah>',
--    ...),
--   ('n0000001-0000-0000-0000-000000000001',
--    '<NASABAH_1_AUTH_UUID>',
--    '3213015408850001',
--    'Dusun Rowotamtu Mekar, RT 03 / RW 01',
--    '03/01',
--    'Rowotamtu Mekar',
--    '2026-07-10',
--    'active'),
--   ('n0000001-0000-0000-0000-000000000002',
--    '<NASABAH_2_AUTH_UUID>',
--    '3213011204780002',
--    'Dusun Rowotamtu Asri, RT 01 / RW 02',
--    '01/02',
--    'Rowotamtu Asri',
--    '2026-07-15',
--    'active'),
--   ('n0000001-0000-0000-0000-000000000003',
--    '<NASABAH_3_AUTH_UUID>',
--    '3213012109920003',
--    'Dusun Rowotamtu Rahayu, RT 04 / RW 02',
--    '04/02',
--    'Rowotamtu Rahayu',
--    '2026-07-18',
--    'active')
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3b. ALTERNATIVE: Create users via SQL (requires supabase_admin role)
-- ============================================================================
-- If running this migration in a context where you have service_role access,
-- you can create users directly. Otherwise, use Supabase Dashboard.

-- The function below automates user + nasabah creation:

CREATE OR REPLACE FUNCTION public.seed_demo_user(
  p_email TEXT,
  p_password TEXT,
  p_role public.user_role,
  p_full_name TEXT,
  p_phone TEXT,
  p_nik TEXT DEFAULT NULL,
  p_address TEXT DEFAULT '',
  p_rt_rw TEXT DEFAULT '',
  p_dusun TEXT DEFAULT '',
  p_join_date DATE DEFAULT CURRENT_DATE,
  p_status public.nasabah_status DEFAULT 'active'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Create auth user
  v_user_id := (
    SELECT id FROM auth.users WHERE email = p_email
  );

  -- If user doesn't exist yet, we cannot create via normal SQL.
  -- This function assumes the user was already created via Dashboard/API.
  -- It just ensures the profile and nasabah records exist.

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User % not found in auth.users. Create via Supabase Dashboard first.', p_email;
    RETURN NULL;
  END IF;

  -- Ensure profile exists and is up to date
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (v_user_id, p_role, p_full_name, p_phone)
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone;

  -- Create nasabah record if role is nasabah
  IF p_role = 'nasabah' AND p_nik IS NOT NULL THEN
    INSERT INTO public.nasabah (profile_id, nik, address, rt_rw, dusun, join_date, status)
    VALUES (v_user_id, p_nik, p_address, p_rt_rw, p_dusun, p_join_date, p_status)
    ON CONFLICT (profile_id) DO UPDATE SET
      nik = EXCLUDED.nik,
      address = EXCLUDED.address,
      rt_rw = EXCLUDED.rt_rw,
      dusun = EXCLUDED.dusun,
      status = EXCLUDED.status;
  END IF;

  RETURN v_user_id;
END;
$$;

-- ============================================================================
-- 4. SEED: DEFAULT SETTINGS
-- ============================================================================

INSERT INTO public.settings (id, bank_name, description, address, phone, email) VALUES
  (1,
   'Bank Sampah Desa Rowotamtu',
   'Buku Kas Digital & Penimbangan Sampah KKN-K ROWOTAMTU 2026',
   'Posko Utama KKN-K ROWOTAMTU, Balai Desa Rowotamtu, Kec. Sumberbaru, Kab. Jember',
   '081234567890',
   'banksampah.rowotamtu@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. SEED USAGE INSTRUCTIONS
-- ============================================================================
--
-- STEP-BY-STEP to seed demo users:
--
-- 1. Go to Supabase Dashboard > Authentication > Users
--
-- 2. Click "Add User" > "Create New User" for each:
--
--    User 1 (Admin):
--      Email:    3213010101950001@banksampah.local
--      Password: 123456
--      Auto Confirm: ✅ ON
--      User Metadata (JSON):
--      {"role": "admin", "full_name": "Pengurus KKN-K ROWOTAMTU", "phone": "081234567890"}
--
--    User 2 (Nasabah):
--      Email:    3213015408850001@banksampah.local
--      Password: 123456
--      Auto Confirm: ✅ ON
--      User Metadata (JSON):
--      {"role": "nasabah", "full_name": "Ibu Siti Aminah", "phone": "085712345678"}
--
--    User 3 (Nasabah):
--      Email:    3213011204780002@banksampah.local
--      Password: 123456
--      Auto Confirm: ✅ ON
--      User Metadata (JSON):
--      {"role": "nasabah", "full_name": "Pak Budi Santoso", "phone": "081987654321"}
--
--    User 4 (Nasabah):
--      Email:    3213012109920003@banksampah.local
--      Password: 123456
--      Auto Confirm: ✅ ON
--      User Metadata (JSON):
--      {"role": "nasabah", "full_name": "Teh Rina Karlina", "phone": "082199887766"}
--
-- 3. After creating all 4 users, run the seed_demo_user function:
--
--    SELECT public.seed_demo_user(
--      '3213010101950001@banksampah.local', '123456',
--      'admin', 'Pengurus KKN-K ROWOTAMTU', '081234567890'
--    );
--
--    SELECT public.seed_demo_user(
--      '3213015408850001@banksampah.local', '123456',
--      'nasabah', 'Ibu Siti Aminah', '085712345678',
--      '3213015408850001',
--      'Dusun Rowotamtu Mekar, RT 03 / RW 01', '03/01', 'Rowotamtu Mekar',
--      '2026-07-10'
--    );
--
--    SELECT public.seed_demo_user(
--      '3213011204780002@banksampah.local', '123456',
--      'nasabah', 'Pak Budi Santoso', '081987654321',
--      '3213011204780002',
--      'Dusun Rowotamtu Asri, RT 01 / RW 02', '01/02', 'Rowotamtu Asri',
--      '2026-07-15'
--    );
--
--    SELECT public.seed_demo_user(
--      '3213012109920003@banksampah.local', '123456',
--      'nasabah', 'Teh Rina Karlina', '082199887766',
--      '3213012109920003',
--      'Dusun Rowotamtu Rahayu, RT 04 / RW 02', '04/02', 'Rowotamtu Rahayu',
--      '2026-07-18'
--    );
--
-- 4. After nasabah records exist, seed sample transactions:
--    (Replace nasabah IDs below with actual UUIDs from nasabah table)
--
--    -- Check nasabah IDs:
--    SELECT id, nik, profile_id FROM public.nasabah;
--
--    -- Then insert sample deposits and withdrawals using those IDs.
--    -- See section 6 below for the template.

-- ============================================================================
-- 6. SAMPLE TRANSACTIONS (run after nasabah exist)
-- ============================================================================
-- Uncomment and adjust the UUIDs after seeding users.

-- -- Get admin profile ID for recorded_by
-- -- SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1;
-- -- → use this as <ADMIN_PROFILE_ID>

-- -- Get nasabah IDs
-- -- SELECT id, nik FROM public.nasabah;
-- -- → use these as <NASABAH_1_ID>, <NASABAH_2_ID>

-- -- Deposit 1: Ibu Siti Aminah — Plastik + Kardus
-- INSERT INTO public.deposits (id, customer_id, recorded_by, notes, created_at) VALUES
--   ('44444444-0000-0000-0000-000000000001',
--    '<NASABAH_1_ID>',
--    '<ADMIN_PROFILE_ID>',
--    'Penimbangan Posko Dusun Rowotamtu Mekar',
--    '2026-08-01T09:30:00+07:00');
--
-- INSERT INTO public.deposit_items (deposit_id, waste_type_id, weight, price_per_kg) VALUES
--   ('44444444-0000-0000-0000-000000000001',
--    '22222222-0000-0000-0000-000000000001', 5.0, 3500),
--   ('44444444-0000-0000-0000-000000000001',
--    '22222222-0000-0000-0000-000000000003', 10.0, 2000);
--
-- -- Deposit 2: Pak Budi Santoso — Alumunium + Minyak Jelantah
-- INSERT INTO public.deposits (id, customer_id, recorded_by, notes, created_at) VALUES
--   ('44444444-0000-0000-0000-000000000002',
--    '<NASABAH_2_ID>',
--    '<ADMIN_PROFILE_ID>',
--    'Penimbangan Posko Utama',
--    '2026-08-02T14:15:00+07:00');
--
-- INSERT INTO public.deposit_items (deposit_id, waste_type_id, weight, price_per_kg) VALUES
--   ('44444444-0000-0000-0000-000000000002',
--    '22222222-0000-0000-0000-000000000005', 2.0, 13000),
--   ('44444444-0000-0000-0000-000000000002',
--    '22222222-0000-0000-0000-000000000008', 5.0, 6000);
--
-- -- Deposit 3: Ibu Siti Aminah — Plastik HD + Kertas HVS
-- INSERT INTO public.deposits (id, customer_id, recorded_by, notes, created_at) VALUES
--   ('44444444-0000-0000-0000-000000000003',
--    '<NASABAH_1_ID>',
--    '<ADMIN_PROFILE_ID>',
--    'Penimbangan Rutin Dusun 01',
--    '2026-08-03T11:00:00+07:00');
--
-- INSERT INTO public.deposit_items (deposit_id, waste_type_id, weight, price_per_kg) VALUES
--   ('44444444-0000-0000-0000-000000000003',
--    '22222222-0000-0000-0000-000000000002', 8.0, 2500),
--   ('44444444-0000-0000-0000-000000000003',
--    '22222222-0000-0000-0000-000000000004', 15.0, 2800);
--
-- -- Withdrawal 1: Ibu Siti Aminah — Rp 50.000
-- INSERT INTO public.withdrawals (customer_id, amount, recorded_by, notes, created_at) VALUES
--   ('<NASABAH_1_ID>',
--    50000,
--    '<ADMIN_PROFILE_ID>',
--    'Penarikan tunai fisik di Posko Balai Desa',
--    '2026-08-03T13:00:00+07:00');

-- ============================================================================
-- DONE. Run seed_demo_user calls after creating auth users via Dashboard.
-- ============================================================================
