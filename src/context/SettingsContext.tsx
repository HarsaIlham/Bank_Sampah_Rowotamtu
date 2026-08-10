import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';
import { supabaseService } from '../services/supabaseService';

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  id: 1,
  bank_name: 'Bank Sampah Desa Rowotamtu',
  description: 'Buku Kas Digital dan Pengelolaan Tabungan Sampah Warga Desa Rowotamtu KKN-K 2026.',
  address: 'Balai Desa Rowotamtu / Posko KKN-K Dusun 01 RT 02 RW 01',
  phone: '081234567890',
  email: 'banksampah.rowotamtu@gmail.com',
  logo_url: '',
  maps_url: 'https://maps.google.com',
  operating_hours: {
    days: 'Senin - Sabtu',
    hours: '08.00 - 15.00 WIB'
  },
  instagram: '@banksampah.rowotamtu',
  facebook: 'Bank Sampah Desa Rowotamtu',
  nasabah_share_pct: 85,
  pengurus_share_pct: 10,
  kas_share_pct: 5
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  refreshSettings: async () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await supabaseService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching global settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
