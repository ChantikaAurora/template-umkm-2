'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Eye, X, MapPin, Globe, Users, Clock } from 'lucide-react';

function formatDate(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }

export default function EventDashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'SUPERADMIN' || role === 'ADMIN';

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detail, setDetail] = useState<any>(null);

  const fetchEvents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.set('status', filter);
    else params.set('status', '');
    const res = await fetch(`/api/v1/events?${params}`);
    const data = await res.json();
    if (data.success) setEvents(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [filter]);

  const handleApproval = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/v1/events/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setDetail(null);
    fetchEvents();
  };

  return (
    <div>
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><Calendar className="w-3 h-3 mr-1" /> Agenda</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">Event Kalender</h1>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mb-6">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
            <Badge key={s} variant={filter === s ? 'default' : 'outline'} className="cursor-pointer px-3 py-1.5" onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Semua' : s}
            </Badge>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {detail && (
        <Card className="mb-6 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Detail Event</h3>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)}><X className="w-5 h-5" /></Button>
            </div>
            {detail.image && (
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                <img src={detail.image} alt={detail.title} className="w-full h-full object-cover" />
              </div>
            )}
            <Badge variant={detail.status === 'APPROVED' ? 'success' : detail.status === 'PENDING' ? 'warning' : 'destructive'} className="mb-2">{detail.status}</Badge>
            <h2 className="text-xl font-bold text-slate-900 mb-3">{detail.title}</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">Tanggal</p>
                <p className="text-sm font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-violet-500" /> {formatDate(detail.startDate)}</p>
                {detail.endDate && <p className="text-xs text-slate-500 mt-0.5">s/d {formatDate(detail.endDate)}</p>}
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">Lokasi</p>
                {detail.isOnline ? (
                  <p className="text-sm font-semibold flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-violet-500" /> Online</p>
                ) : (
                  <p className="text-sm font-semibold flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-violet-500" /> {detail.location || '-'}</p>
                )}
                {detail.meetLink && <p className="text-xs text-violet-600 mt-0.5 truncate">{detail.meetLink}</p>}
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">Peserta</p>
                <p className="text-sm font-semibold flex items-center gap-1"><Users className="w-3.5 h-3.5 text-violet-500" /> {detail._count?.registrations || 0} terdaftar</p>
                {detail.maxAttendee && <p className="text-xs text-slate-500 mt-0.5">Maks. {detail.maxAttendee} peserta</p>}
              </div>
            </div>
            {detail.description && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">Deskripsi</p>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{detail.description}</p>
                </div>
              </div>
            )}
            {isAdmin && detail.status === 'PENDING' && (
              <div className="flex gap-2 pt-2">
                <Button variant="success" onClick={() => handleApproval(detail.id, 'APPROVED')} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Setujui
                </Button>
                <Button variant="destructive" onClick={() => handleApproval(detail.id, 'REJECTED')} className="flex-1">
                  <XCircle className="w-4 h-4 mr-1.5" /> Tolak
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-700">Event</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Tanggal</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Lokasi</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Memuat...</td></tr>
                ) : events.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Tidak ada event</td></tr>
                ) : events.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{e.title}</td>
                    <td className="p-4 text-slate-500">{formatDate(e.startDate)}</td>
                    <td className="p-4">
                      {e.isOnline ? <Badge variant="default" className="text-[10px]"><Globe className="w-3 h-3 mr-0.5" /> Online</Badge> : <span className="text-slate-500">{e.location || '-'}</span>}
                    </td>
                    <td className="p-4"><Badge variant={e.status === 'APPROVED' ? 'success' : e.status === 'PENDING' ? 'warning' : 'destructive'}>{e.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setDetail(e)}>
                          <Eye className="w-4 h-4 mr-1" /> Lihat
                        </Button>
                        {isAdmin && e.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(e.id, 'APPROVED')} title="Setujui"><CheckCircle className="w-4 h-4 text-green-500" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleApproval(e.id, 'REJECTED')} title="Tolak"><XCircle className="w-4 h-4 text-red-500" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
