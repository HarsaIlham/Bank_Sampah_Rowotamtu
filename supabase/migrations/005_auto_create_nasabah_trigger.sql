-- ============================================================================
-- Bank Sampah Desa Rowotamtu — Migration 005: Auto-create Nasabah & Fix RLS
-- ============================================================================
-- 1. Updates handle_new_user() trigger to automatically create nasabah rows.
-- 2. Allows users to manage/read their own nasabah row.
-- 3. Auto-repairs existing accounts that are missing rows in public.nasabah.
-- ============================================================================

-- 1. Allow users to insert/update their own nasabah record
DROP POLICY IF EXISTS "Users can manage own nasabah" ON public.nasabah;
CREATE POLICY "Users can manage own nasabah"
  ON public.nasabah FOR ALL
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- 2. Update handle_new_user() trigger to auto-create nasabah row whenever a nasabah signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role public.user_role;
  v_nik TEXT;
  v_full_name TEXT;
  v_phone TEXT;
BEGIN
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'nasabah'::public.user_role);
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  
  -- Extract NIK from metadata or from email (e.g. 3509...@banksampah.local)
  v_nik := COALESCE(
    NEW.raw_user_meta_data->>'nik',
    NULLIF(SPLIT_PART(NEW.email, '@', 1), '')
  );

  -- 1. Insert Profile
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (NEW.id, v_role, v_full_name, v_phone)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone;

  -- 2. If role is nasabah, automatically create nasabah table row
  IF v_role = 'nasabah' AND v_nik IS NOT NULL AND v_nik != '' THEN
    INSERT INTO public.nasabah (
      profile_id,
      nik,
      address,
      rt_rw,
      dusun,
      status
    ) VALUES (
      NEW.id,
      v_nik,
      COALESCE(NEW.raw_user_meta_data->>'address', 'Desa Rowotamtu'),
      COALESCE(NEW.raw_user_meta_data->>'rt_rw', '01/01'),
      COALESCE(NEW.raw_user_meta_data->>'dusun', 'Rowotamtu'),
      'active'
    )
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Auto-fix existing orphan users (profiles with role 'nasabah' that don't have a row in nasabah table)
INSERT INTO public.nasabah (profile_id, nik, address, rt_rw, dusun, status)
SELECT 
  p.id,
  COALESCE(NULLIF(SPLIT_PART(u.email, '@', 1), ''), 'NIK-' || SUBSTRING(p.id::TEXT, 1, 8)),
  COALESCE(u.raw_user_meta_data->>'address', 'Desa Rowotamtu'),
  COALESCE(u.raw_user_meta_data->>'rt_rw', '01/01'),
  COALESCE(u.raw_user_meta_data->>'dusun', 'Rowotamtu'),
  'active'::public.nasabah_status
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'nasabah'
  AND NOT EXISTS (
    SELECT 1 FROM public.nasabah n WHERE n.profile_id = p.id
  )
ON CONFLICT (profile_id) DO NOTHING;
