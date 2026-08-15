import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabaseService } from '../../services/supabaseService';
import type { WasteTypeWithCategory } from '../../types';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CalculatorItem {
  wasteTypeId: string;
  weight: number | string;
}

export const WasteCalculatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentRole } = useAuth();

  const [wasteTypes, setWasteTypes] = useState<WasteTypeWithCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<CalculatorItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!isOpen) return;

    const loadTypes = async () => {
      try {
        setLoading(true);
        const types = await supabaseService.getWasteTypes(undefined, true);
        if (isMounted) {
          setWasteTypes(types);
          if (types.length > 0) {
            setItems([
              { wasteTypeId: types[0].id, weight: 5 },
              { wasteTypeId: types[Math.min(2, types.length - 1)].id, weight: 10 }
            ]);
          }
        }
      } catch (err) {
        console.error('Error loading waste types for calculator:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTypes();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleAddItem = () => {
    if (wasteTypes.length === 0) return;
    setItems([...items, { wasteTypeId: wasteTypes[0].id, weight: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleTypeChange = (index: number, wasteTypeId: string) => {
    const next = [...items];
    next[index].wasteTypeId = wasteTypeId;
    setItems(next);
  };

  const handleWeightChange = (index: number, val: string) => {
    const next = [...items];
    if (val === '') {
      next[index].weight = '';
    } else {
      const num = parseFloat(val);
      next[index].weight = isNaN(num) ? '' : Math.max(0, num);
    }
    setItems(next);
  };

  // Calculations
  const calculatedDetails = items.map(item => {
    const wt = wasteTypes.find(w => w.id === item.wasteTypeId);
    const price = wt?.price_per_kg || 0;
    const numWeight = typeof item.weight === 'number' ? item.weight : (parseFloat(item.weight) || 0);
    const subtotal = price * numWeight;
    return {
      catName: wt?.name || 'Sampah',
      pricePerKg: price,
      weight: numWeight,
      subtotal
    };
  });

  const totalEarnings = calculatedDetails.reduce((acc, curr) => acc + curr.subtotal, 0);
  const totalKg = calculatedDetails.reduce((acc, curr) => acc + curr.weight, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🧮 Simulasi Kalkulator Tabungan Sampah"
      description="Hitung potensi pendapatan tabungan dari sampah rumah tangga Anda di Desa Rowotamtu"
      maxWidth="lg"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-pink-600">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Memuat data kalkulator...</p>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* Item Rows */}
          <div className="space-y-3">
            {items.map((item, idx) => {
              const detail = calculatedDetails[idx];
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-100 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pilih Jenis Sampah</label>
                    <select
                      value={item.wasteTypeId}
                      onChange={e => handleTypeChange(idx, e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    >
                      {wasteTypes.map(wt => (
                        <option key={wt.id} value={wt.id}>
                          {wt.name} ({formatRupiah(wt.price_per_kg)}/{wt.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <Input
                      label="Berat (kg)"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0"
                      value={item.weight}
                      onChange={e => handleWeightChange(idx, e.target.value)}
                      onFocus={e => e.target.select()}
                    />
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="text-[10px] text-slate-400 font-semibold">ESTIMASI SUB-TOTAL</p>
                    <p className="text-sm font-extrabold text-pink-600">{formatRupiah(detail.subtotal)}</p>
                  </div>

                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddItem}
            className="w-full py-2.5 border-2 border-dashed border-pink-200 rounded-xl text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Jenis Sampah Lainnya
          </button>

          {/* Calculation Result Highlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500 to-[#EC4899] text-white shadow-lg shadow-pink-200 relative overflow-hidden">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-pink-100 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-300" /> Total Perkiraan Hasil Tabungan:
                </p>
                <h4 className="text-3xl font-extrabold tracking-tight mt-1">{formatRupiah(totalEarnings)}</h4>
                <p className="text-xs text-pink-100 mt-0.5">
                  Total Berat Sampah Terkumpul: <span className="font-bold text-white">{formatWeight(totalKg)}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
              Tutup
            </Button>

            {currentRole === 'guest' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="cursor-pointer"
              >
                Mulai Menabung Sampah Sekarang →
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
