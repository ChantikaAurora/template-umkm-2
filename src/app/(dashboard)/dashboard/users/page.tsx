'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/users');
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (id: string, role: string) => {
    await fetch(`/api/v1/users/${id}/role`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
    fetchUsers();
  };

  const changeStatus = async (id: string, status: string) => {
    await fetch(`/api/v1/users/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchUsers();
  };

  return (
    <div>
      <div className="mb-6">
        <Badge variant="violet" className="mb-3"><Users className="w-3 h-3 mr-1" /> Management</Badge>
        <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 font-semibold text-slate-700">Nama</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Role</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-400">Memuat...</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{u.name}</td>
                    <td className="p-4 text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                        {['VISITOR','UMKM_OWNER','ADMIN','SUPERADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <Badge variant={u.status === 'ACTIVE' ? 'success' : 'destructive'}>{u.status}</Badge>
                    </td>
                    <td className="p-4">
                      {u.status === 'ACTIVE' ? (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => changeStatus(u.id, 'SUSPENDED')}>Suspend</Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => changeStatus(u.id, 'ACTIVE')}>Aktifkan</Button>
                      )}
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
