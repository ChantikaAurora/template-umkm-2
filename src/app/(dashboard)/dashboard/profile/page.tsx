import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import prisma from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: (session?.user as any)?.id },
    include: { region: true, umkms: true },
  });

  if (!user) return <p>User not found</p>;

  const umkm = user.umkms?.[0];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Profile</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 text-2xl font-extrabold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <Badge variant="violet" className="mt-1">{user.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Email</span><span className="text-slate-700">{user.email}</span></div>
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Region</span><span className="text-slate-700">{user.region?.name || '-'}</span></div>
            <div className="flex justify-between py-2"><span className="text-slate-500">Status</span><Badge variant={user.status === 'ACTIVE' ? 'success' : 'warning'}>{user.status}</Badge></div>
            {umkm && (
              <>
                <h3 className="font-semibold text-slate-800 mt-4 mb-2">UMKM</h3>
                <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Nama UMKM</span><span className="font-medium text-slate-900">{umkm.name}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">WhatsApp</span><span className="text-slate-700">{umkm.whatsapp || '-'}</span></div>
                <div className="flex justify-between py-2"><span className="text-slate-500">Status</span><Badge variant={umkm.status === 'APPROVED' ? 'success' : 'warning'}>{umkm.status}</Badge></div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
