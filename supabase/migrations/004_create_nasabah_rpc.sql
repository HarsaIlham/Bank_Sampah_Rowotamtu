-- ============================================================================
-- Bank Sampah Desa Rowotamtu — Migration 004: Direct Nasabah Registration RPC
-- ============================================================================
-- This function allows admins to register new nasabah directly in PostgreSQL.
-- It inserts into auth.users without triggering Supabase Auth's email mailer,
-- completely eliminating the "over_email_send_rate_limit" issue.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.create_nasabah_user(
  p_nik TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_password TEXT,
  p_dusun TEXT DEFAULT '',
  p_rt_rw TEXT DEFAULT '',
  p_address TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_user_id UUID := gen_random_uuid();
  v_email TEXT;
  v_encrypted_pw TEXT;
  v_result JSONB;
BEGIN
  -- 1. Check if NIK is already in nasabah table
  IF EXISTS (SELECT 1 FROM public.nasabah WHERE nik = p_nik) THEN
    RAISE EXCEPTION 'NIK % sudah terdaftar sebagai nasabah.', p_nik;
  END IF;

  v_email := p_nik || '@banksampah.local';
  
  -- Check if email already in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
    RAISE EXCEPTION 'Akun dengan NIK % sudah ada di sistem autentikasi.', p_nik;
  END IF;

  v_encrypted_pw := crypt(p_password, gen_salt('bf'));

  -- 2. Insert into auth.users directly (Bypasses email mailer completely)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    v_email,
    v_encrypted_pw,
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'role', 'nasabah',
      'full_name', p_full_name,
      'phone', p_phone
    ),
    'authenticated',
    'authenticated',
    NOW(),
    NOW()
  );

  -- 3. The profiles table is automatically populated by on_auth_user_created trigger.
  -- Now insert into nasabah table
  INSERT INTO public.nasabah (
    profile_id,
    nik,
    address,
    rt_rw,
    dusun,
    status
  ) VALUES (
    v_user_id,
    p_nik,
    p_address,
    p_rt_rw,
    p_dusun,
    'active'
  );

  -- 4. Return created record
  SELECT jsonb_build_object(
    'id', n.id,
    'profile_id', n.profile_id,
    'member_number', n.member_number,
    'nik', n.nik,
    'address', n.address,
    'rt_rw', n.rt_rw,
    'dusun', n.dusun,
    'join_date', n.join_date,
    'status', n.status,
    'profile', jsonb_build_object(
      'id', p.id,
      'role', p.role,
      'full_name', p.full_name,
      'phone', p.phone,
      'photo_url', p.photo_url,
      'is_active', p.is_active
    )
  ) INTO v_result
  FROM public.nasabah n
  JOIN public.profiles p ON p.id = n.profile_id
  WHERE n.profile_id = v_user_id;

  RETURN v_result;
END;
$$;

-- Grant execution to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.create_nasabah_user(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
