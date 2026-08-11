import type { SavedAccount } from '../types';

// ============================================================================
// Saved Accounts Service
// Manages localStorage persistence for login page quick-fill accounts.
// Encodes password before storing to localStorage.
// ============================================================================

const STORAGE_KEY = 'banksampah_saved_accounts';
const MAX_SAVED_ACCOUNTS = 10;

function encodeSecret(str: string): string {
  try {
    return btoa(encodeURIComponent(str));
  } catch {
    return str;
  }
}

function decodeSecret(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch {
    return str;
  }
}

/**
 * Read all saved accounts from localStorage.
 * Returns empty array if nothing is stored or on parse error.
 */
export function getSavedAccounts(): SavedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((acc: SavedAccount) => ({
      ...acc,
      password: acc.password ? decodeSecret(acc.password) : undefined
    }));
  } catch {
    return [];
  }
}

/**
 * Save or update an account (upsert by NIK).
 * If over MAX limit, the oldest entry is removed (FIFO).
 */
export function saveAccount(account: SavedAccount): void {
  try {
    let accounts = getSavedAccounts();

    // Remove existing entry with same NIK (upsert)
    accounts = accounts.filter(a => a.nik !== account.nik);

    // Prepend new account (most recent first)
    accounts.unshift({
      ...account,
      savedAt: new Date().toISOString()
    });

    // Enforce max limit
    if (accounts.length > MAX_SAVED_ACCOUNTS) {
      accounts = accounts.slice(0, MAX_SAVED_ACCOUNTS);
    }

    // Encode passwords for storage
    const accountsToStore = accounts.map(a => ({
      ...a,
      password: a.password ? encodeSecret(a.password) : undefined
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(accountsToStore));
  } catch (e) {
    console.error('Error saving account to localStorage:', e);
  }
}

/**
 * Remove a single saved account by NIK.
 */
export function removeAccount(nik: string): void {
  try {
    const accounts = getSavedAccounts().filter(a => a.nik !== nik);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error removing saved account:', e);
  }
}

/**
 * Clear all saved accounts.
 */
export function clearAllAccounts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing saved accounts:', e);
  }
}

/**
 * Get saved accounts filtered by role.
 */
export function getSavedAccountsByRole(role: 'nasabah' | 'admin'): SavedAccount[] {
  return getSavedAccounts().filter(a => a.role === role);
}
