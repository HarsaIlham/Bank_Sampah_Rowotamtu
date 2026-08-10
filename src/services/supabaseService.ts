import { supabase } from '../lib/supabase';
import { INITIAL_ARTICLES } from './mockData';
import { 
  nikToEmail, 
  type Profile, 
  type Nasabah, 
  type NasabahWithProfile, 
  type WasteCategory, 
  type WasteType, 
  type WasteTypeWithCategory,
  type DepositWithItems, 
  type WithdrawalWithDetails, 
  type NasabahSummary, 
  type BankSampahReports, 
  type Settings,
  type EducationalArticle,
  type CreateNasabahInput,
  type CreateDepositInput,
  type CreateWithdrawalInput
} from '../types';

// ============================================================================
// SUPABASE SERVICE LAYER
// Async API interactions for Bank Sampah Desa Rowotamtu
// ============================================================================

export const supabaseService = {

  // ==========================================================================
  // 1. AUTHENTICATION & SESSION
  // ==========================================================================

  /**
   * Sign in using NIK / Email and Password.
   * Supports raw email, current domain (@resik.id), and legacy seed domain (@banksampah.local).
   */
  async signIn(identifier: string, password: string) {
    const cleanId = identifier.trim();
    
    let emailsToTry: string[] = [];
    if (cleanId.includes('@')) {
      emailsToTry = [cleanId];
    } else {
      emailsToTry = [`${cleanId}@banksampah.local`, `${cleanId}@resik.id`];
    }

    let lastError: any = null;
    for (const email of emailsToTry) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error && data?.user) {
        return data;
      }
      lastError = error;
    }

    if (lastError) {
      if (lastError.message?.includes('Invalid login credentials')) {
        throw new Error('NIK / Akun atau kata sandi tidak sesuai. Pastikan NIK dan kata sandi yang Anda masukkan sudah benar.');
      }
      throw lastError;
    }
  },

  /** Sign out active session */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /** Get active Supabase Auth session */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Fetch current authenticated user's profile and nasabah details (if applicable).
   */
  async getCurrentProfile(): Promise<{ profile: Profile; nasabah?: Nasabah } | null> {
    const session = await this.getSession();
    if (!session?.user) return null;

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) return null;

    // If nasabah, fetch nasabah record
    if (profile.role === 'nasabah') {
      let { data: nasabah } = await supabase
        .from('nasabah')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();

      // Auto-heal if nasabah row was not created previously
      if (!nasabah) {
        const rawNik = session.user.email ? session.user.email.split('@')[0] : '';
        const { data: newNasabah } = await supabase
          .from('nasabah')
          .insert({
            profile_id: profile.id,
            nik: rawNik || `NIK-${profile.id.slice(0, 8)}`,
            address: 'Desa Rowotamtu',
            rt_rw: '01/01',
            dusun: 'Rowotamtu',
            status: 'active'
          })
          .select()
          .maybeSingle();

        if (newNasabah) {
          nasabah = newNasabah;
        }
      }

      return { profile: profile as Profile, nasabah: (nasabah as Nasabah) || undefined };
    }

    return { profile: profile as Profile };
  },

  // ==========================================================================
  // 2. MASTER DATA: WASTE CATEGORIES & TYPES
  // ==========================================================================

  /** Fetch all waste categories */
  async getWasteCategories(): Promise<WasteCategory[]> {
    const { data, error } = await supabase
      .from('waste_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as WasteCategory[];
  },

  /** Fetch all waste types, optionally filtered by category */
  async getWasteTypes(categoryId?: string): Promise<WasteTypeWithCategory[]> {
    let query = supabase
      .from('waste_types')
      .select(`
        *,
        category:waste_categories(*)
      `)
      .order('name');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as WasteTypeWithCategory[];
  },

  /** Create a new waste category (Admin only) */
  async createWasteCategory(name: string, description: string): Promise<WasteCategory> {
    const { data, error } = await supabase
      .from('waste_categories')
      .insert({ name, description })
      .select()
      .single();

    if (error) throw error;
    return data as WasteCategory;
  },

  /** Create a new waste type (Admin only) */
  async createWasteType(input: {
    category_id: string;
    name: string;
    price_per_kg: number;
    unit: 'kg' | 'liter' | 'pcs';
  }): Promise<WasteType> {
    const { data, error } = await supabase
      .from('waste_types')
      .insert({
        category_id: input.category_id,
        name: input.name,
        price_per_kg: input.price_per_kg,
        unit: input.unit,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data as WasteType;
  },

  /** Update waste type price or details */
  async updateWasteType(id: string, updates: Partial<WasteType>): Promise<WasteType> {
    const { data, error } = await supabase
      .from('waste_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as WasteType;
  },

  /** Delete a waste type */
  async deleteWasteType(id: string): Promise<void> {
    const { error } = await supabase
      .from('waste_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ==========================================================================
  // 3. NASABAH / CUSTOMER MANAGEMENT
  // ==========================================================================

  /** Fetch all nasabah with their profiles */
  async getNasabahList(): Promise<NasabahWithProfile[]> {
    const { data, error } = await supabase
      .from('nasabah')
      .select(`
        *,
        profile:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as NasabahWithProfile[];
  },

  /** Calculate summary and balance for a single nasabah */
  async getNasabahSummary(nasabahId: string): Promise<NasabahSummary | null> {
    // 1. Fetch nasabah + profile
    const { data: nasabahData, error: nasabahErr } = await supabase
      .from('nasabah')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', nasabahId)
      .single();

    if (nasabahErr || !nasabahData) return null;

    const nasabah = nasabahData as unknown as NasabahWithProfile;

    // 2. Fetch deposits items total for this customer
    const { data: deposits } = await supabase
      .from('deposits')
      .select(`
        id,
        deposit_items(subtotal, weight, nasabah_amount)
      `)
      .eq('customer_id', nasabahId);

    let totalDepositAmount = 0;
    let totalNasabahAmount = 0;
    let totalKg = 0;

    deposits?.forEach((d: any) => {
      d.deposit_items?.forEach((item: any) => {
        totalDepositAmount += Number(item.subtotal || 0);
        totalNasabahAmount += Number(item.nasabah_amount ?? item.subtotal ?? 0);
        totalKg += Number(item.weight || 0);
      });
    });

    // 3. Fetch withdrawals total for this customer
    const { data: withdrawals } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('customer_id', nasabahId);

    const totalWithdrawalAmount = withdrawals?.reduce((acc, w) => acc + Number(w.amount || 0), 0) || 0;
    const balance = totalNasabahAmount - totalWithdrawalAmount;

    return {
      id: nasabah.id,
      profile_id: nasabah.profile_id,
      member_number: nasabah.member_number,
      nik: nasabah.nik,
      address: nasabah.address,
      rt_rw: nasabah.rt_rw,
      dusun: nasabah.dusun,
      join_date: nasabah.join_date,
      status: nasabah.status,
      full_name: nasabah.profile.full_name,
      phone: nasabah.profile.phone,
      photo_url: nasabah.profile.photo_url,
      is_active: nasabah.profile.is_active,
      total_deposit_amount: totalDepositAmount,
      total_nasabah_amount: totalNasabahAmount,
      total_withdrawal_amount: totalWithdrawalAmount,
      balance,
      total_kg: totalKg
    };
  },

  /** Fetch all nasabah summaries (including calculated balances) - BATCH OPTIMIZED */
  async getAllNasabahSummaries(): Promise<NasabahSummary[]> {
    // 1. Fetch all nasabah with profiles (1 query)
    const list = await this.getNasabahList();
    if (list.length === 0) return [];

    // 2. Fetch all deposits items and all withdrawals in 2 batch queries
    const [{ data: deposits }, { data: withdrawals }] = await Promise.all([
      supabase.from('deposits').select(`
        customer_id,
        deposit_items(subtotal, weight, nasabah_amount)
      `),
      supabase.from('withdrawals').select('customer_id, amount')
    ]);

    // 3. Build lookup maps for fast in-memory aggregation
    const depositMap = new Map<string, { totalDepositAmount: number; totalNasabahAmount: number; totalKg: number }>();
    deposits?.forEach((d: any) => {
      const custId = d.customer_id;
      if (!depositMap.has(custId)) {
        depositMap.set(custId, { totalDepositAmount: 0, totalNasabahAmount: 0, totalKg: 0 });
      }
      const entry = depositMap.get(custId)!;
      d.deposit_items?.forEach((item: any) => {
        entry.totalDepositAmount += Number(item.subtotal || 0);
        entry.totalNasabahAmount += Number(item.nasabah_amount ?? item.subtotal ?? 0);
        entry.totalKg += Number(item.weight || 0);
      });
    });

    const withdrawalMap = new Map<string, number>();
    withdrawals?.forEach((w: any) => {
      const custId = w.customer_id;
      withdrawalMap.set(custId, (withdrawalMap.get(custId) || 0) + Number(w.amount || 0));
    });

    // 4. Combine into final summaries without any additional queries
    return list.map(nasabah => {
      const depStats = depositMap.get(nasabah.id) || { totalDepositAmount: 0, totalNasabahAmount: 0, totalKg: 0 };
      const totalWithdrawalAmount = withdrawalMap.get(nasabah.id) || 0;
      const balance = depStats.totalNasabahAmount - totalWithdrawalAmount;

      return {
        id: nasabah.id,
        profile_id: nasabah.profile_id,
        member_number: nasabah.member_number,
        nik: nasabah.nik,
        address: nasabah.address,
        rt_rw: nasabah.rt_rw,
        dusun: nasabah.dusun,
        join_date: nasabah.join_date,
        status: nasabah.status,
        full_name: nasabah.profile?.full_name || '',
        phone: nasabah.profile?.phone || '',
        photo_url: nasabah.profile?.photo_url || '',
        is_active: nasabah.profile?.is_active ?? true,
        total_deposit_amount: depStats.totalDepositAmount,
        total_nasabah_amount: depStats.totalNasabahAmount,
        total_withdrawal_amount: totalWithdrawalAmount,
        balance,
        total_kg: depStats.totalKg
      };
    });
  },

  /** Register a new nasabah (Creates Auth User + Profile + Nasabah) */
  async createNasabah(input: CreateNasabahInput): Promise<NasabahWithProfile> {
    const cleanNik = input.nik.trim();

    // 1. First attempt: Direct RPC in PostgreSQL (Bypasses email rate limit completely)
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('create_nasabah_user', {
        p_nik: cleanNik,
        p_full_name: input.full_name,
        p_phone: input.phone || '',
        p_password: input.password,
        p_dusun: input.dusun || '',
        p_rt_rw: input.rt_rw || '',
        p_address: input.address || `Dusun ${input.dusun || ''}, RT ${input.rt_rw || ''}`
      });

      if (!rpcErr && rpcData) {
        return rpcData as unknown as NasabahWithProfile;
      }

      // If error is a business exception (e.g. NIK already exists), throw directly
      if (rpcErr && rpcErr.message && !rpcErr.message.includes('function') && !rpcErr.message.includes('does not exist')) {
        throw new Error(rpcErr.message);
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('sudah terdaftar') || err.message.includes('sudah ada'))) {
        throw err;
      }
      // If RPC is not installed in database, proceed to standard fallback
      console.warn('RPC create_nasabah_user not available or failed, falling back to auth.signUp:', err);
    }

    // 2. Fallback attempt: Standard Supabase Auth signUp
    const email = nikToEmail(cleanNik);
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: {
        data: {
          role: 'nasabah',
          full_name: input.full_name,
          phone: input.phone
        }
      }
    });

    if (authErr) throw authErr;
    if (!authData.user) throw new Error('Gagal membuat akun autentikasi');

    const profileId = authData.user.id;

    // 3. Insert into nasabah table
    const { data: nasabah, error: nasabahErr } = await supabase
      .from('nasabah')
      .insert({
        profile_id: profileId,
        nik: cleanNik,
        address: input.address,
        rt_rw: input.rt_rw || '',
        dusun: input.dusun || '',
        status: 'active'
      })
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (nasabahErr) throw nasabahErr;
    return nasabah as unknown as NasabahWithProfile;
  },

  // ==========================================================================
  // 4. TRANSACTIONS: DEPOSITS & WITHDRAWALS
  // ==========================================================================

  /**
   * Create a deposit transaction (Header + Items)
   */
  async createDeposit(input: CreateDepositInput): Promise<DepositWithItems> {
    const session = await this.getSession();
    if (!session?.user) throw new Error('Pengguna tidak terautentikasi');

    // 1. Fetch current revenue sharing percentages from settings
    const settings = await this.getSettings();
    const nasabahPct = settings?.nasabah_share_pct ?? 85;
    const pengurusPct = settings?.pengurus_share_pct ?? 10;
    const kasPct = settings?.kas_share_pct ?? 5;

    // 2. Create deposit header
    const { data: deposit, error: depErr } = await supabase
      .from('deposits')
      .insert({
        customer_id: input.customer_id,
        recorded_by: session.user.id,
        notes: input.notes || 'Penimbangan Sampah di Posko Bank Sampah'
      })
      .select()
      .single();

    if (depErr || !deposit) throw depErr || new Error('Gagal menyimpan transaksi setor');

    // 3. Create deposit items WITH revenue sharing snapshot
    const itemsToInsert = input.items.map(item => ({
      deposit_id: deposit.id,
      waste_type_id: item.waste_type_id,
      weight: item.weight,
      price_per_kg: item.price_per_kg,
      nasabah_share_pct: nasabahPct,
      pengurus_share_pct: pengurusPct,
      kas_share_pct: kasPct
    }));

    const { data: items, error: itemsErr } = await supabase
      .from('deposit_items')
      .insert(itemsToInsert)
      .select(`
        *,
        waste_type:waste_types(name)
      `);

    if (itemsErr) throw itemsErr;

    const formattedItems = (items || []).map((i: any) => ({
      ...i,
      waste_type_name: i.waste_type?.name || ''
    }));

    const totalAmount = formattedItems.reduce((acc, i) => acc + Number(i.subtotal), 0);
    const totalKg = formattedItems.reduce((acc, i) => acc + Number(i.weight), 0);
    const totalNasabahAmount = formattedItems.reduce((acc, i) => acc + Number(i.nasabah_amount ?? i.subtotal), 0);
    const totalPengurusAmount = formattedItems.reduce((acc, i) => acc + Number(i.pengurus_amount ?? 0), 0);
    const totalKasAmount = formattedItems.reduce((acc, i) => acc + Number(i.kas_amount ?? 0), 0);

    return {
      ...deposit,
      items: formattedItems,
      total_amount: totalAmount,
      total_kg: totalKg,
      total_nasabah_amount: totalNasabahAmount,
      total_pengurus_amount: totalPengurusAmount,
      total_kas_amount: totalKasAmount
    } as DepositWithItems;
  },

  /** Fetch deposits, optionally for a specific nasabah */
  async getDeposits(nasabahId?: string): Promise<DepositWithItems[]> {
    let query = supabase
      .from('deposits')
      .select(`
        *,
        items:deposit_items(
          *,
          waste_type:waste_types(name)
        ),
        customer:nasabah(
          id,
          nik,
          profile:profiles(full_name)
        ),
        recorder:profiles!deposits_recorded_by_fkey(full_name)
      `)
      .order('created_at', { ascending: false });

    if (nasabahId) {
      query = query.eq('customer_id', nasabahId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((d: any) => {
      const items = (d.items || []).map((i: any) => ({
        ...i,
        waste_type_name: i.waste_type?.name || ''
      }));

      const totalAmount = items.reduce((acc: number, i: any) => acc + Number(i.subtotal || 0), 0);
      const totalKg = items.reduce((acc: number, i: any) => acc + Number(i.weight || 0), 0);
      const totalNasabahAmount = items.reduce((acc: number, i: any) => acc + Number(i.nasabah_amount ?? i.subtotal ?? 0), 0);
      const totalPengurusAmount = items.reduce((acc: number, i: any) => acc + Number(i.pengurus_amount ?? 0), 0);
      const totalKasAmount = items.reduce((acc: number, i: any) => acc + Number(i.kas_amount ?? 0), 0);

      return {
        id: d.id,
        customer_id: d.customer_id,
        recorded_by: d.recorded_by,
        notes: d.notes,
        created_at: d.created_at,
        items,
        total_amount: totalAmount,
        total_kg: totalKg,
        total_nasabah_amount: totalNasabahAmount,
        total_pengurus_amount: totalPengurusAmount,
        total_kas_amount: totalKasAmount,
        customer_name: d.customer?.profile?.full_name || '',
        customer_nik: d.customer?.nik || '',
        recorded_by_name: d.recorder?.full_name || ''
      } as DepositWithItems;
    });
  },

  /** Create a cash withdrawal record */
  async createWithdrawal(input: CreateWithdrawalInput): Promise<WithdrawalWithDetails> {
    const session = await this.getSession();
    if (!session?.user) throw new Error('Pengguna tidak terautentikasi');

    // Check balance first
    const summary = await this.getNasabahSummary(input.customer_id);
    if (!summary) throw new Error('Nasabah tidak ditemukan');

    if (input.amount <= 0) throw new Error('Nominal penarikan harus lebih dari Rp 0');
    if (summary.balance < input.amount) {
      throw new Error(
        `Saldo nasabah (Rp ${summary.balance.toLocaleString('id-ID')}) tidak mencukupi untuk penarikan Rp ${input.amount.toLocaleString('id-ID')}`
      );
    }

    const { data: withdrawal, error } = await supabase
      .from('withdrawals')
      .insert({
        customer_id: input.customer_id,
        amount: input.amount,
        recorded_by: session.user.id,
        notes: input.notes || 'Penarikan tunai fisik di Posko Bank Sampah'
      })
      .select(`
        *,
        customer:nasabah(
          nik,
          profile:profiles(full_name)
        ),
        recorder:profiles!withdrawals_recorded_by_fkey(full_name)
      `)
      .single();

    if (error) throw error;

    return {
      id: withdrawal.id,
      customer_id: withdrawal.customer_id,
      amount: Number(withdrawal.amount),
      recorded_by: withdrawal.recorded_by,
      notes: withdrawal.notes,
      created_at: withdrawal.created_at,
      customer_name: (withdrawal as any).customer?.profile?.full_name || '',
      customer_nik: (withdrawal as any).customer?.nik || '',
      recorded_by_name: (withdrawal as any).recorder?.full_name || ''
    } as WithdrawalWithDetails;
  },

  /** Fetch withdrawals, optionally for a specific nasabah */
  async getWithdrawals(nasabahId?: string): Promise<WithdrawalWithDetails[]> {
    let query = supabase
      .from('withdrawals')
      .select(`
        *,
        customer:nasabah(
          nik,
          profile:profiles(full_name)
        ),
        recorder:profiles!withdrawals_recorded_by_fkey(full_name)
      `)
      .order('created_at', { ascending: false });

    if (nasabahId) {
      query = query.eq('customer_id', nasabahId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((w: any) => ({
      id: w.id,
      customer_id: w.customer_id,
      amount: Number(w.amount),
      recorded_by: w.recorded_by,
      notes: w.notes,
      created_at: w.created_at,
      customer_name: w.customer?.profile?.full_name || '',
      customer_nik: w.customer?.nik || '',
      recorded_by_name: w.recorder?.full_name || ''
    })) as WithdrawalWithDetails[];
  },

  // ==========================================================================
  // 5. REPORTS & ANALYTICS
  // ==========================================================================

  /** Calculate bank sampah dashboard aggregate reports */
  async getReports(): Promise<BankSampahReports> {
    const [{ count: nasabahCount }, deposits, withdrawals, categories] = await Promise.all([
      supabase.from('nasabah').select('*', { count: 'exact', head: true }),
      this.getDeposits(),
      this.getWithdrawals(),
      this.getWasteCategories()
    ]);

    const totalNasabahCount = nasabahCount || 0;
    const totalDepositRp = deposits.reduce((acc, d) => acc + d.total_amount, 0);
    const totalNasabahShareRp = deposits.reduce((acc, d) => acc + d.total_nasabah_amount, 0);
    const totalPengurusShareRp = deposits.reduce((acc, d) => acc + d.total_pengurus_amount, 0);
    const totalKasShareRp = deposits.reduce((acc, d) => acc + d.total_kas_amount, 0);
    const totalWithdrawalRp = withdrawals.reduce((acc, w) => acc + w.amount, 0);
    const currentBalanceDisbursedRp = totalNasabahShareRp - totalWithdrawalRp;
    const totalWasteKgCollected = deposits.reduce((acc, d) => acc + d.total_kg, 0);
    const totalTransactionsCount = deposits.length + withdrawals.length;

    // Grouping by category
    const wasteByCategory = categories.map(cat => {
      let totalKg = 0;
      let totalRp = 0;

      deposits.forEach(d => {
        d.items.forEach(item => {
          totalKg += item.weight;
          totalRp += item.subtotal;
        });
      });

      return {
        category_id: cat.id,
        category_name: cat.name,
        totalKg,
        totalRp
      };
    });

    return {
      totalNasabahCount,
      totalDepositRp,
      totalNasabahShareRp,
      totalPengurusShareRp,
      totalKasShareRp,
      totalWithdrawalRp,
      currentBalanceDisbursedRp,
      totalWasteKgCollected,
      totalTransactionsCount,
      wasteByCategory
    };
  },

  // ==========================================================================
  // 6. EDUCATIONAL ARTICLES
  // ==========================================================================

  /** Fetch educational articles */
  getArticles(): EducationalArticle[] {
    return INITIAL_ARTICLES;
  },

  // ==========================================================================
  // 7. SETTINGS (Company Profile)
  // ==========================================================================

  /** Get company profile settings */
  async getSettings(): Promise<Settings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (error) return null;
    return data as Settings;
  },

  /** Update company profile settings */
  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...updates })
      .select()
      .single();

    if (error) throw error;
    return data as Settings;
  }
};
