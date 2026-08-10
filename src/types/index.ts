// ============================================================================
// Bank Sampah Desa Rowotamtu — TypeScript Type Definitions
// Matches the Supabase PostgreSQL schema (001_initial_schema.sql)
// ============================================================================

// ============================================================================
// ENUMS (match PostgreSQL ENUM types)
// ============================================================================

/** Maps to PostgreSQL: public.user_role ENUM */
export type UserRole = 'admin' | 'nasabah' | 'guest';

/** Maps to PostgreSQL: public.nasabah_status ENUM */
export type NasabahStatus = 'active' | 'inactive';

/** Unit types for waste measurement */
export type WasteUnit = 'kg' | 'liter' | 'pcs';

// ============================================================================
// TABLE TYPES (1:1 mapping to database tables)
// ============================================================================

/**
 * Maps to: public.profiles
 * Linked 1:1 to auth.users via id.
 */
export interface Profile {
  id: string;           // UUID, references auth.users.id
  role: 'admin' | 'nasabah';
  full_name: string;
  phone: string;
  photo_url: string;
  is_active: boolean;
  created_at: string;   // TIMESTAMPTZ as ISO string
  updated_at: string;
}

/**
 * Maps to: public.nasabah
 * Customer-specific data. Not every profile is a nasabah.
 */
export interface Nasabah {
  id: string;           // UUID, primary key
  profile_id: string;   // UUID, references profiles.id
  member_number: string | null; // Auto-generated, e.g. "BS-0001"
  nik: string;          // 16-digit NIK
  address: string;
  rt_rw: string;
  dusun: string;
  join_date: string;    // DATE as ISO string
  status: NasabahStatus;
  notes: string;
  created_at: string;
}

/**
 * Maps to: public.waste_categories
 * Master table for waste category groups.
 */
export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  created_at?: string;
  // Legacy fields for backward compatibility during component migration
  pricePerKg?: number;
  unit?: 'kg' | 'liter' | 'pcs' | string;
  group?: string;
  tips?: string;
}

/**
 * Maps to: public.waste_types
 * Individual waste types with pricing. Each belongs to one category.
 */
export interface WasteType {
  id: string;
  category_id: string;  // references waste_categories.id
  name: string;
  price_per_kg: number;
  unit: WasteUnit;
  is_active: boolean;
  created_at?: string;
}

/**
 * Maps to: public.deposits
 * Transaction header for waste deposits.
 */
export interface Deposit {
  id: string;
  customer_id: string;  // references nasabah.id
  recorded_by: string;  // references profiles.id (admin)
  notes: string;
  created_at: string;
}

/**
 * Maps to: public.deposit_items
 * Line items within a deposit. Stores historical price.
 */
export interface DepositItem {
  id: string;
  deposit_id: string;    // references deposits.id
  waste_type_id: string; // references waste_types.id
  weight: number;
  price_per_kg: number;  // historical price at time of transaction
  subtotal: number;      // GENERATED: weight × price_per_kg
  // Revenue sharing — historical snapshot at time of transaction
  nasabah_share_pct: number;   // % credited to customer savings
  nasabah_amount: number;      // GENERATED: subtotal × nasabah_share_pct / 100
  pengurus_share_pct: number;  // % operator commission
  pengurus_amount: number;     // GENERATED: subtotal × pengurus_share_pct / 100
  kas_share_pct: number;       // % operational fund
  kas_amount: number;          // GENERATED: subtotal × kas_share_pct / 100
}

/**
 * Maps to: public.withdrawals
 * Cash withdrawal records (offline, physical cash).
 */
export interface Withdrawal {
  id: string;
  customer_id: string;   // references nasabah.id
  amount: number;
  recorded_by: string;   // references profiles.id (admin)
  notes: string;
  created_at: string;
}

/**
 * Maps to: public.settings
 * Single-row company profile configuration.
 */
export interface Settings {
  id: number;
  bank_name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  maps_url: string;
  operating_hours: Record<string, string>;
  instagram: string;
  facebook: string;
  // Revenue sharing global percentages (must sum to 100)
  nasabah_share_pct: number;   // default 85 — credited to customer savings
  pengurus_share_pct: number;  // default 10 — operator commission
  kas_share_pct: number;       // default  5 — operational fund
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// JOINED / COMPOSITE TYPES (for UI consumption)
// ============================================================================

/** Nasabah joined with its profile data */
export interface NasabahWithProfile extends Nasabah {
  profile: Profile;
}

/** WasteType joined with its category data */
export interface WasteTypeWithCategory extends WasteType {
  category: WasteCategory;
}

/** Deposit with all line items and resolved names */
export interface DepositWithItems extends Deposit {
  items: (DepositItem & {
    waste_type_name?: string;
  })[];
  // Computed from items
  total_amount: number;           // total bruto (weight × price)
  total_kg: number;
  // Revenue sharing totals
  total_nasabah_amount: number;   // total credited to customer
  total_pengurus_amount: number;  // total operator commission
  total_kas_amount: number;       // total operational fund
  // Resolved names (from joins)
  customer_name?: string;
  customer_nik?: string;
  recorded_by_name?: string;
}

/** Withdrawal with resolved names */
export interface WithdrawalWithDetails extends Withdrawal {
  customer_name?: string;
  customer_nik?: string;
  recorded_by_name?: string;
}

/**
 * Nasabah summary with calculated balance.
 * Balance = SUM(deposit_items.subtotal) - SUM(withdrawals.amount)
 * NEVER stored in database — always calculated.
 */
export interface NasabahSummary {
  // From nasabah table
  id: string;             // nasabah.id
  profile_id: string;
  member_number: string | null;
  nik: string;
  address: string;
  rt_rw: string;
  dusun: string;
  join_date: string;
  status: NasabahStatus;
  // From profile table
  full_name: string;
  phone: string;
  photo_url: string;
  is_active: boolean;
  // Calculated fields
  total_deposit_amount: number;     // total bruto deposits
  total_nasabah_amount: number;     // total bersih (bagian nasabah)
  total_withdrawal_amount: number;
  balance: number;                  // total_nasabah_amount - total_withdrawal
  total_kg: number;
}

// ============================================================================
// REPORTS TYPE
// ============================================================================

export interface BankSampahReports {
  totalNasabahCount: number;
  totalDepositRp: number;              // total bruto
  totalNasabahShareRp: number;         // total bagian nasabah
  totalPengurusShareRp: number;        // total komisi pengurus
  totalKasShareRp: number;             // total kas operasional
  totalWithdrawalRp: number;
  currentBalanceDisbursedRp: number;   // Net: nasabah_share - withdrawals
  totalWasteKgCollected: number;
  totalTransactionsCount: number;
  wasteByCategory: {
    category_id: string;
    category_name: string;
    totalKg: number;
    totalRp: number;
  }[];
}

// ============================================================================
// EDUCATIONAL ARTICLES (static/CMS content — not in Supabase yet)
// ============================================================================

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Edukasi' | 'Panduan' | 'Berita KKN' | 'Tips Lingkungan';
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
}

// ============================================================================
// INPUT TYPES (for creating/updating records)
// ============================================================================

/** Input for creating a new nasabah (admin action) */
export interface CreateNasabahInput {
  full_name: string;
  phone: string;
  nik: string;
  address: string;
  rt_rw?: string;
  dusun?: string;
  password: string;    // will be used for Supabase Auth
}

/** Input for creating a deposit transaction */
export interface CreateDepositInput {
  customer_id: string; // nasabah.id
  items: {
    waste_type_id: string;
    weight: number;
    price_per_kg: number;
  }[];
  notes?: string;
}

/** Input for creating a withdrawal */
export interface CreateWithdrawalInput {
  customer_id: string; // nasabah.id
  amount: number;
  notes?: string;
}

// ============================================================================
// AUTH HELPER CONSTANTS
// ============================================================================

/** Email domain appended to NIK for Supabase Auth */
export const NIK_EMAIL_DOMAIN = '@banksampah.local';

/** Convert NIK to Supabase Auth email format */
export function nikToEmail(nik: string): string {
  return `${nik}${NIK_EMAIL_DOMAIN}`;
}

/** Extract NIK from Supabase Auth email */
export function emailToNik(email: string): string {
  return email.replace(NIK_EMAIL_DOMAIN, '');
}

// ============================================================================
// BACKWARD COMPATIBILITY ALIASES (temporary for seamless phase migration)
// ============================================================================

export type WasteGroup = string;

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  rtRw?: string;
  dusun?: string;
  nik: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface DepositTransaction {
  id: string;
  nasabahId: string;
  nasabahName: string;
  nik: string;
  items: {
    categoryId: string;
    categoryName: string;
    weight: number;
    pricePerKg: number;
    subtotal: number;
  }[];
  totalAmount: number;
  totalKg: number;
  recordedBy: string;
  createdAt: string;
  notes?: string;
}

export interface WithdrawalTransaction {
  id: string;
  nasabahId: string;
  nasabahName: string;
  nik: string;
  amount: number;
  recordedBy: string;
  createdAt: string;
  notes?: string;
}



