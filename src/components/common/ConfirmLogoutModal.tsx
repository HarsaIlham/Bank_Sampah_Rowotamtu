import React, { useState } from 'react';
import { LogOut, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Keluar',
  message = 'Apakah Anda yakin ingin keluar dari akun? Anda perlu memasukkan NIK / ID dan kata sandi kembali untuk masuk.'
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden transform transition-all duration-200 animate-in zoom-in-95 p-6 space-y-5">
        
        {/* Header Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
            <LogOut className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md shadow-rose-200 cursor-pointer flex items-center gap-1.5"
          >
            {loading ? 'Mengeluarkan...' : 'Ya, Keluar Akun'}
          </Button>
        </div>

      </div>
    </div>
  );
};
