import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Globe, Users, Clock } from 'lucide-react';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event || event.status !== 'APPROVED') notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {event.image && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-8">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}
        <Badge variant="success" className="mb-4">Event Aktif</Badge>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{event.title}</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: Clock, label: 'Tanggal', value: formatDate(event.startDate) },
            { icon: event.isOnline ? Globe : MapPin, label: 'Lokasi', value: event.isOnline ? 'Online' : (event.location || '-') },
            { icon: Users, label: 'Peserta', value: `${event._count.registrations} terdaftar${event.maxAttendee ? ` / maks. ${event.maxAttendee}` : ''}` },
            { icon: Calendar, label: 'Status', value: 'Pendaftaran Dibuka' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 text-sm"><Icon className="w-4 h-4 text-violet-500" />{value}</p>
            </div>
          ))}
        </div>
        {event.description && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-6">
            <h2 className="font-bold text-slate-900 mb-3">Tentang Event</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">{event.description}</p>
          </div>
        )}
        {event.isOnline && event.meetLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm font-semibold text-green-800 mb-1">Link Meeting</p>
            <a href={event.meetLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm break-all">{event.meetLink}</a>
          </div>
        )}
      </div>
    </div>
  );
}
