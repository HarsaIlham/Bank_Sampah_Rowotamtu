import type { 
  WasteCategory, 
  UserProfile, 
  DepositTransaction, 
  WithdrawalTransaction, 
  EducationalArticle,
  NasabahSummary,
  BankSampahReports
} from '../types';
import { 
  INITIAL_WASTE_CATEGORIES, 
  INITIAL_USERS, 
  INITIAL_DEPOSITS, 
  INITIAL_WITHDRAWALS, 
  INITIAL_ARTICLES 
} from './mockData';

const STORAGE_KEYS = {
  CATEGORIES: 'bank_sampah_categories_v3',
  USERS: 'bank_sampah_users_v3',
  DEPOSITS: 'bank_sampah_deposits_v3',
  WITHDRAWALS: 'bank_sampah_withdrawals_v3',
  ARTICLES: 'bank_sampah_articles_v3',
  CURRENT_USER_ID: 'bank_sampah_active_user_id_v3'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const BankSampahService = {
  // --- Waste Categories (Jenis Sampah) ---
  getCategories(): WasteCategory[] {
    return getStorage(STORAGE_KEYS.CATEGORIES, INITIAL_WASTE_CATEGORIES);
  },

  saveCategories(categories: WasteCategory[]): void {
    setStorage(STORAGE_KEYS.CATEGORIES, categories);
  },

  updateCategoryPrice(id: string, newPrice: number): WasteCategory[] {
    const categories = this.getCategories();
    const updated = categories.map(cat => cat.id === id ? { ...cat, pricePerKg: newPrice } : cat);
    this.saveCategories(updated);
    return updated;
  },

  updateCategory(id: string, updatedFields: Partial<Omit<WasteCategory, 'id'>>): WasteCategory[] {
    const categories = this.getCategories();
    const updated = categories.map(cat => cat.id === id ? { ...cat, ...updatedFields } : cat);
    this.saveCategories(updated);
    return updated;
  },

  deleteCategory(id: string): WasteCategory[] {
    const categories = this.getCategories();
    const updated = categories.filter(cat => cat.id !== id);
    this.saveCategories(updated);
    return updated;
  },

  addCategory(category: Omit<WasteCategory, 'id'>): WasteCategory[] {
    const categories = this.getCategories();
    const newCategory: WasteCategory = {
      ...category,
      id: `cat-${Date.now()}`
    };
    const updated = [...categories, newCategory];
    this.saveCategories(updated);
    return updated;
  },

  // --- Users & Profiles ---
  getUsers(): UserProfile[] {
    return getStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  getActiveUser(): UserProfile {
    const users = this.getUsers();
    const activeId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const found = users.find(u => u.id === activeId);
    return found || users.find(u => u.role === 'nasabah') || users[0];
  },

  setActiveUser(id: string): UserProfile {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    return this.getUserById(id) || this.getUsers()[0];
  },

  addNasabah(newNasabah: Omit<UserProfile, 'id' | 'createdAt' | 'role'> & { nik?: string }): UserProfile {
    const users = this.getUsers();
    const nasabahCount = users.filter(u => u.role === 'nasabah').length + 1;
    const nik = newNasabah.nik || `321301${String(Date.now()).slice(-8)}000${nasabahCount}`;
    
    const created: UserProfile = {
      ...newNasabah,
      nik,
      id: `usr-${Date.now()}`,
      role: 'nasabah',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newNasabah.name)}`,
      createdAt: new Date().toISOString()
    };

    const updated = [...users, created];
    setStorage(STORAGE_KEYS.USERS, updated);
    return created;
  },

  // --- Ledger Calculation (Dynamic Balance & Summaries) ---
  getDeposits(): DepositTransaction[] {
    return getStorage(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
  },

  getWithdrawals(): WithdrawalTransaction[] {
    return getStorage(STORAGE_KEYS.WITHDRAWALS, INITIAL_WITHDRAWALS);
  },

  getNasabahSummary(nasabahId: string): NasabahSummary | undefined {
    const user = this.getUserById(nasabahId);
    if (!user || user.role !== 'nasabah') return undefined;

    const deposits = this.getDeposits().filter(d => d.nasabahId === nasabahId);
    const withdrawals = this.getWithdrawals().filter(w => w.nasabahId === nasabahId);

    const totalDepositAmount = deposits.reduce((acc, d) => acc + d.totalAmount, 0);
    const totalWithdrawalAmount = withdrawals.reduce((acc, w) => acc + w.amount, 0);
    const totalKg = deposits.reduce((acc, d) => acc + d.totalKg, 0);
    // Legacy service: 100% of deposit goes to nasabah (no bagi hasil)
    const totalNasabahAmount = totalDepositAmount;
    const balance = totalNasabahAmount - totalWithdrawalAmount;

    return {
      ...user,
      full_name: user.name,
      photo_url: user.avatarUrl || '',
      is_active: true,
      total_deposit_amount: totalDepositAmount,
      total_nasabah_amount: totalNasabahAmount,
      total_withdrawal_amount: totalWithdrawalAmount,
      balance,
      total_kg: totalKg
    } as unknown as NasabahSummary;
  },

  getAllNasabahSummaries(): NasabahSummary[] {
    const users = this.getUsers().filter(u => u.role === 'nasabah');
    return users.map(u => this.getNasabahSummary(u.id)!);
  },

  // --- Setor Sampah (Deposit Transaction) ---
  createDeposit(data: {
    nasabahId: string;
    items: { categoryId: string; categoryName: string; weight: number; pricePerKg: number }[];
    recordedBy?: string;
    notes?: string;
  }): DepositTransaction {
    const user = this.getUserById(data.nasabahId);
    if (!user) throw new Error('Nasabah tidak ditemukan');

    const processedItems = data.items.map(item => ({
      ...item,
      subtotal: item.weight * item.pricePerKg
    }));

    const totalAmount = processedItems.reduce((acc, item) => acc + item.subtotal, 0);
    const totalKg = processedItems.reduce((acc, item) => acc + item.weight, 0);

    const newDeposit: DepositTransaction = {
      id: `dep-${Date.now()}`,
      nasabahId: user.id,
      nasabahName: user.name,
      nik: user.nik,
      items: processedItems,
      totalAmount,
      totalKg,
      recordedBy: data.recordedBy || 'Pengurus KKN-K ROWOTAMTU',
      createdAt: new Date().toISOString(),
      notes: data.notes || 'Penimbangan Sampah di Posko Bank Sampah'
    };

    const deposits = [newDeposit, ...this.getDeposits()];
    setStorage(STORAGE_KEYS.DEPOSITS, deposits);
    return newDeposit;
  },

  // --- Penarikan Saldo (Withdrawal Transaction recorded by Admin) ---
  createWithdrawal(data: {
    nasabahId: string;
    amount: number;
    recordedBy?: string;
    notes?: string;
  }): WithdrawalTransaction {
    const summary = this.getNasabahSummary(data.nasabahId);
    if (!summary) throw new Error('Nasabah tidak ditemukan');

    if (data.amount <= 0) throw new Error('Nominal penarikan harus lebih dari Rp 0');
    if (summary.balance < data.amount) {
      throw new Error(`Saldo nasabah (${summary.balance.toLocaleString('id-ID')}) tidak mencukupi untuk penarikan Rp ${data.amount.toLocaleString('id-ID')}`);
    }

    const newWithdrawal: WithdrawalTransaction = {
      id: `wth-${Date.now()}`,
      nasabahId: summary.id,
      nasabahName: summary.full_name,
      nik: summary.nik,
      amount: data.amount,
      recordedBy: data.recordedBy || 'Pengurus KKN-K ROWOTAMTU',
      createdAt: new Date().toISOString(),
      notes: data.notes || 'Penarikan tunai fisik di Posko Bank Sampah'
    };

    const withdrawals = [newWithdrawal, ...this.getWithdrawals()];
    setStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals);
    return newWithdrawal;
  },

  // --- Educational Articles ---
  getArticles(): EducationalArticle[] {
    return getStorage(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  },

  // --- Laporan (Reports) Calculation ---
  getReports(): BankSampahReports {
    const summaries = this.getAllNasabahSummaries();
    const deposits = this.getDeposits();
    const withdrawals = this.getWithdrawals();
    const categories = this.getCategories();

    const totalNasabahCount = summaries.length;
    const totalDepositRp = deposits.reduce((acc, d) => acc + d.totalAmount, 0);
    const totalWithdrawalRp = withdrawals.reduce((acc, w) => acc + w.amount, 0);
    const currentBalanceDisbursedRp = totalDepositRp - totalWithdrawalRp;
    const totalWasteKgCollected = deposits.reduce((acc, d) => acc + d.totalKg, 0);
    const totalTransactionsCount = deposits.length + withdrawals.length;

    // Grouping waste total by category
    const wasteByCategory = categories.map(cat => {
      let totalKg = 0;
      let totalRp = 0;

      deposits.forEach(dep => {
        dep.items.forEach(item => {
          if (item.categoryId === cat.id) {
            totalKg += item.weight;
            totalRp += item.subtotal;
          }
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
      totalNasabahShareRp: totalDepositRp,   // legacy: 100% to nasabah
      totalPengurusShareRp: 0,
      totalKasShareRp: 0,
      totalWithdrawalRp,
      currentBalanceDisbursedRp,
      totalWasteKgCollected,
      totalTransactionsCount,
      wasteByCategory
    };
  }
};
