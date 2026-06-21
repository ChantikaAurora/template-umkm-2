import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import Providers from '@/components/Providers';
import Sidebar from '@/components/sidebar/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <Providers>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <div className="ml-64 transition-all duration-300">
          <DashboardHeader name={session.user?.name ?? ''} role={(session.user as any)?.role ?? ''} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
