'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-slate-200 bg-white shadow-lg text-slate-800 max-w-sm">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-[#0a66c2] shrink-0" />
        )}
        <span className="text-xs font-semibold">{toast.message}</span>
      </div>
    </div>
  );
};
