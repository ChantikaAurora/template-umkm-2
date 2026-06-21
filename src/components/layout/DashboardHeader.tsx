'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  name: string;
  role: string;
}

export default function DashboardHeader({ name, role }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <span className="inline-flex items-center rounded-lg bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
          {role.replace('_', ' ')}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          title="Keluar"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
