-- ============================================================================
-- Bank Sampah Desa Rowotamtu — Revenue Sharing (Bagi Hasil) Migration
-- Version 1.2 — KKN-K ROWOTAMTU 2026
-- ============================================================================
-- Adds revenue sharing percentages to settings (global config) and
-- historical snapshot columns to deposit_items for accurate reporting.
--
-- Split model:
--   nasabah_share_pct  → credited to customer savings
--   pengurus_share_pct → commission for bank sampah operators
--   kas_share_pct      → operational fund for the bank sampah
-- ============================================================================

-- ============================================================================
-- 1. SETTINGS — Global revenue sharing percentages
-- ============================================================================

ALTER TABLE public.settings
  ADD COLUMN IF NOT EXISTS nasabah_share_pct  NUMERIC(5,2) NOT NULL DEFAULT 85.00,
  ADD COLUMN IF NOT EXISTS pengurus_share_pct NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  ADD COLUMN IF NOT EXISTS kas_share_pct      NUMERIC(5,2) NOT NULL DEFAULT 5.00;

COMMENT ON COLUMN public.settings.nasabah_share_pct  IS 'Percentage of deposit value credited to customer savings';
COMMENT ON COLUMN public.settings.pengurus_share_pct  IS 'Percentage of deposit value as operator commission';
COMMENT ON COLUMN public.settings.kas_share_pct       IS 'Percentage of deposit value for operational fund';

-- Add CHECK constraint: the three percentages must sum to 100
ALTER TABLE public.settings
  ADD CONSTRAINT chk_share_pct_sum
  CHECK (nasabah_share_pct + pengurus_share_pct + kas_share_pct = 100.00);

-- ============================================================================
-- 2. DEPOSIT_ITEMS — Historical snapshot of revenue sharing per line item
-- ============================================================================
-- For existing (old) rows, defaults ensure backward compatibility:
--   nasabah_share_pct = 100 → all value goes to customer (legacy behavior)
--   pengurus/kas = 0        → no deductions on old data

ALTER TABLE public.deposit_items
  ADD COLUMN IF NOT EXISTS nasabah_share_pct  NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  ADD COLUMN IF NOT EXISTS pengurus_share_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS kas_share_pct      NUMERIC(5,2) NOT NULL DEFAULT 0.00;

-- Generated columns for calculated amounts
ALTER TABLE public.deposit_items
  ADD COLUMN IF NOT EXISTS nasabah_amount  NUMERIC(14,2) GENERATED ALWAYS AS (subtotal * nasabah_share_pct / 100) STORED,
  ADD COLUMN IF NOT EXISTS pengurus_amount NUMERIC(14,2) GENERATED ALWAYS AS (subtotal * pengurus_share_pct / 100) STORED,
  ADD COLUMN IF NOT EXISTS kas_amount      NUMERIC(14,2) GENERATED ALWAYS AS (subtotal * kas_share_pct / 100) STORED;

COMMENT ON COLUMN public.deposit_items.nasabah_share_pct  IS 'Historical snapshot: customer share % at time of transaction';
COMMENT ON COLUMN public.deposit_items.nasabah_amount      IS 'Generated: subtotal × nasabah_share_pct / 100';
COMMENT ON COLUMN public.deposit_items.pengurus_amount     IS 'Generated: subtotal × pengurus_share_pct / 100';
COMMENT ON COLUMN public.deposit_items.kas_amount          IS 'Generated: subtotal × kas_share_pct / 100';

-- ============================================================================
-- 3. UPDATE BALANCE FUNCTION — Use nasabah_amount instead of subtotal
-- ============================================================================
-- COALESCE(nasabah_amount, subtotal) ensures backward compatibility:
-- old rows without the column still use full subtotal.

CREATE OR REPLACE FUNCTION public.get_nasabah_balance(p_nasabah_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(
      (SELECT SUM(COALESCE(di.nasabah_amount, di.subtotal))
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

COMMENT ON FUNCTION public.get_nasabah_balance IS 'Calculate real-time balance: SUM(nasabah_amount) - SUM(withdrawals.amount)';
