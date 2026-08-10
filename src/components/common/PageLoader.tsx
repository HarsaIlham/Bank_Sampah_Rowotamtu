import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 text-pink-600">
      <Loader2 className="w-9 h-9 animate-spin text-pink-500" />
      <p className="text-xs font-semibold text-slate-500 tracking-wide">Memuat halaman RESIK...</p>
    </div>
  );
};
