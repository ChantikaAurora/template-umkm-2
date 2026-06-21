import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
export default function ApprovalsPage() {
  return (
    <div>
      <Badge variant="violet" className="mb-3"><Clock className="w-3 h-3 mr-1" /> Queue</Badge>
      <h1 className="text-2xl font-extrabold text-slate-900">Approval Queue</h1>
      <p className="text-slate-500 mt-2">Gunakan halaman UMKM Data untuk memproses persetujuan.</p>
    </div>
  );
}
