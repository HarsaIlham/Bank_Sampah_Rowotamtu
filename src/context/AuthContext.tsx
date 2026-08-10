import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Profile, Nasabah } from '../types';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  currentRole: UserRole;
  profile: Profile | null;
  nasabah: Nasabah | null;
  isLoading: boolean;
  isAdmin: boolean;
  isNasabah: boolean;
  signIn: (nik: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nasabah, setNasabah] = useState<Nasabah | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to load user profile & nasabah record from session
  const loadUser = async () => {
    try {
      setIsLoading(true);
      const data = await supabaseService.getCurrentProfile();
      if (data) {
        setProfile(data.profile);
        setNasabah(data.nasabah || null);
        setCurrentRole(data.profile.role);
      } else {
        setProfile(null);
        setNasabah(null);
        setCurrentRole('guest');
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      setProfile(null);
      setNasabah(null);
      setCurrentRole('guest');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadUser();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await loadUser();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setNasabah(null);
        setCurrentRole('guest');
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (nik: string, pass: string) => {
    await supabaseService.signIn(nik, pass);
    await loadUser();
  };

  const signOut = async () => {
    await supabaseService.signOut();
    setProfile(null);
    setNasabah(null);
    setCurrentRole('guest');
  };

  const refreshUserData = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        profile,
        nasabah,
        isLoading,
        isAdmin: currentRole === 'admin',
        isNasabah: currentRole === 'nasabah',
        signIn,
        signOut,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
