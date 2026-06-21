import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

export default async function CeritaPage() {
  const stories = await prisma.story.findMany({
    where: { status: 'APPROVED' },
    include: { umkm: true, author: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Badge variant="violet" className="mb-3"><BookOpen className="w-3 h-3 mr-1" /> Blog</Badge>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Cerita UMKM</h1>
          <p className="text-slate-500">Inspirasi dari pelaku UMKM Indonesia</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {stories.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Belum ada cerita</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stories.map((s) => (
              <Link key={s.id} href={`/cerita/${s.slug}`}>
                <Card className="card-hover cursor-pointer overflow-hidden group h-full flex flex-col">
                  {s.coverImage && (
                    <div className="aspect-video overflow-hidden bg-slate-100">
                      <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <CardContent className="p-5 flex flex-col flex-1 gap-2">
                    <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors leading-snug line-clamp-2">{s.title}</p>
                    {s.excerpt && <p className="text-sm text-slate-500 line-clamp-3 flex-1">{s.excerpt}</p>}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
                      {s.umkm && <Badge variant="violet" className="text-xs">{s.umkm.name}</Badge>}
                      <span className="text-xs text-slate-400 ml-auto">{formatDate(s.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
