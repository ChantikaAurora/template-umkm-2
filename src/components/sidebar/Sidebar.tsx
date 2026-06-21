'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useSidebarStore } from '@/lib/store';
import { menuItems } from './menuConfig';
import { Store, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const role = (session?.user as any)?.role || 'VISITOR';
  const filtered = menuItems.filter(m => m.roles.includes(role));
  const initials = session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <aside className={cn(
      'fixed top-0 left-0 h-full z-40 bg-navy-950 border-r border-navy-800 transition-all duration-300 flex flex-col',
      isOpen ? 'w-64' : 'w-16'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-navy-800">
        {isOpen && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">UMKM<span className="text-violet-400">2</span></span>
          </Link>
        )}
        <button onClick={toggle} className={cn('p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors', !isOpen && 'mx-auto')}>
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {filtered.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 group',
                active
                  ? 'bg-violet-600 text-white shadow-btn-violet'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              )}
              title={!isOpen ? item.label : undefined}
            >
              <item.icon className={cn('flex-shrink-0', isOpen ? 'w-4 h-4' : 'w-5 h-5 mx-auto')} />
              {isOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-navy-800 p-3">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-violet-400 font-medium">{role.replace('_',' ')}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-navy-800 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center justify-center py-2 text-slate-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
