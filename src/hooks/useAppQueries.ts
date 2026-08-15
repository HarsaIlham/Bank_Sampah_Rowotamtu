import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '../services/supabaseService';
import type { 
  CreateDepositInput, 
  CreateWithdrawalInput, 
  CreateNasabahInput,
  Settings 
} from '../types';

// Query Keys Constant
export const QUERY_KEYS = {
  wasteCategories: ['wasteCategories'] as const,
  wasteTypes: (categoryId?: string, activeOnly?: boolean) => ['wasteTypes', categoryId || 'all', activeOnly ? 'active' : 'all'] as const,
  nasabahList: ['nasabahList'] as const,
  nasabahSummaries: ['nasabahSummaries'] as const,
  nasabahSummary: (id?: string) => ['nasabahSummary', id] as const,
  deposits: (nasabahId?: string) => ['deposits', nasabahId || 'all'] as const,
  withdrawals: (nasabahId?: string) => ['withdrawals', nasabahId || 'all'] as const,
  reports: ['reports'] as const,
  settings: ['settings'] as const,
  articles: ['articles'] as const
};

// ----------------------------------------------------------------------------
// QUERIES
// ----------------------------------------------------------------------------

export function useWasteCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.wasteCategories,
    queryFn: () => supabaseService.getWasteCategories(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useWasteTypes(categoryId?: string, activeOnly?: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.wasteTypes(categoryId, activeOnly),
    queryFn: () => supabaseService.getWasteTypes(categoryId, activeOnly),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useNasabahSummaries() {
  return useQuery({
    queryKey: QUERY_KEYS.nasabahSummaries,
    queryFn: () => supabaseService.getAllNasabahSummaries(),
    staleTime: 30 * 1000 // 30 seconds
  });
}

export function useNasabahSummary(nasabahId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.nasabahSummary(nasabahId),
    queryFn: () => (nasabahId ? supabaseService.getNasabahSummary(nasabahId) : null),
    enabled: Boolean(nasabahId),
    staleTime: 30 * 1000 // 30 seconds
  });
}

export function useDeposits(nasabahId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.deposits(nasabahId),
    queryFn: () => supabaseService.getDeposits(nasabahId),
    staleTime: 60 * 1000 // 1 minute
  });
}

export function useWithdrawals(nasabahId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.withdrawals(nasabahId),
    queryFn: () => supabaseService.getWithdrawals(nasabahId),
    staleTime: 60 * 1000 // 1 minute
  });
}

export function useReports() {
  return useQuery({
    queryKey: QUERY_KEYS.reports,
    queryFn: () => supabaseService.getReports(),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
}

// ----------------------------------------------------------------------------
// MUTATIONS WITH AUTOMATIC CACHE INVALIDATION
// ----------------------------------------------------------------------------

export function useCreateDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepositInput) => supabaseService.createDeposit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nasabahSummaries });
      queryClient.invalidateQueries({ queryKey: ['nasabahSummary'] });
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    }
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWithdrawalInput) => supabaseService.createWithdrawal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nasabahSummaries });
      queryClient.invalidateQueries({ queryKey: ['nasabahSummary'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    }
  });
}

export function useCreateNasabah() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNasabahInput) => supabaseService.createNasabah(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nasabahSummaries });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nasabahList });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    }
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Settings>) => supabaseService.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings });
    }
  });
}

export function useToggleWasteTypeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      supabaseService.toggleWasteTypeStatus(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wasteTypes'] });
    }
  });
}

export function useDeleteWasteType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supabaseService.deleteWasteType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wasteTypes'] });
    }
  });
}

