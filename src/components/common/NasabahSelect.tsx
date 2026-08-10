import React, { useState, useRef, useEffect } from 'react';
import type { NasabahSummary } from '../../types';
import { formatRupiah } from '../../lib/utils';
import { Search, ChevronDown, User, Check, X } from 'lucide-react';

interface NasabahSelectProps {
  options: NasabahSummary[];
  value: string;
  onChange: (nasabahId: string) => void;
  placeholder?: string;
  label?: string;
}

export const NasabahSelect: React.FC<NasabahSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Cari & pilih akun nasabah...',
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedNasabah = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt => {
    const query = searchQuery.toLowerCase();
    const nameStr = opt.full_name || (opt as any).name || '';
    return (
      nameStr.toLowerCase().includes(query) ||
      opt.nik.toLowerCase().includes(query) ||
      (opt.dusun && opt.dusun.toLowerCase().includes(query)) ||
      (opt.phone && opt.phone.includes(query))
    );
  });

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <User className="w-4 h-4 text-pink-600" /> {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-pink-200 hover:border-pink-300 rounded-xl px-4 py-3 text-left transition-colors flex items-center justify-between shadow-xs focus:ring-2 focus:ring-pink-400 focus:outline-none cursor-pointer"
      >
        {selectedNasabah ? (
          <div className="flex items-center justify-between w-full pr-2">
            <div>
              <p className="text-sm font-bold text-slate-800">{selectedNasabah.full_name || (selectedNasabah as any).name}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                NIK: <span className="font-mono text-pink-600 font-bold">{selectedNasabah.nik}</span> • {selectedNasabah.dusun || 'Desa Rowotamtu'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Saldo: {formatRupiah(selectedNasabah.balance)}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-400 font-medium">{placeholder}</span>
        )}

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-pink-200 rounded-2xl shadow-xl overflow-hidden max-h-80 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Search Box Header */}
          <div className="p-2.5 border-b border-pink-100 bg-pink-50/50 sticky top-0 z-10">
            <div className="relative">
              <Search className="w-4 h-4 text-pink-500 absolute left-3 top-2.5" />
              <input
                type="text"
                autoFocus
                placeholder="Cari berdasarkan nama, NIK (16 digit), atau dusun..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = opt.id === value;
                const optName = opt.full_name || (opt as any).name;
                const optRt = opt.rt_rw || (opt as any).rtRw || '01/01';
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-pink-50 text-pink-900 font-semibold'
                        : 'hover:bg-pink-50/60 text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-800">{optName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        NIK: <span className="font-mono text-pink-600 font-semibold">{opt.nik}</span> • {opt.dusun || 'Desa Rowotamtu'} (RT {optRt})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-extrabold text-emerald-700">{formatRupiah(opt.balance)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                Nasabah tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
