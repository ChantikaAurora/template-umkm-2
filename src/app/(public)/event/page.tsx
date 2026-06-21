import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Globe, Users } from 'lucide-react';

export default async function EventPage() {
  const events = await prisma.event.findMany({
    where: { status: 'APPROVED' },
    include: { _count: { select: { registrations: true } } },
    orderBy: { startDate: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Badge variant="violet" className="mb-3"><Calendar className="w-3 h-3 mr-1" /> Agenda</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Event UMKM</h1>
          <p className="text-slate-500">Workshop, pelatihan, dan komunitas UMKM</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Belum ada event</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((e) => (
              <Link key={e.id} href={`/event/${e.id}`}>
                <Card className="card-hover cursor-pointer p-5 group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-violet-100 rounded-2xl flex flex-col items-center justify-center text-violet-600 flex-shrink-0">
                      <span className="text-xs font-semibold">{new Date(e.startDate).toLocaleString('id-ID', { month: 'short' })}</span>
                      <span className="text-2xl font-extrabold">{new Date(e.startDate).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 mb-2">{e.title}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        {e.isOnline ? (
                          <Badge variant="violet"><Globe className="w-3 h-3 mr-0.5" /> Online</Badge>
                        ) : (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location || '-'}</span>
                        )}
                        {e._count.registrations > 0 && (
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {e._count.registrations} peserta</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
