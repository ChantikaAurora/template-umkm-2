import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Store } from 'lucide-react';

export default async function CeritaDetailPage({ params }: { params: { slug: string } }) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: { author: true, umkm: true },
  });
  if (!story || story.status !== 'APPROVED') notFound();
  const tags = story.tags ? (() => { try { return JSON.parse(story.tags!); } catch { return []; } })() : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {story.coverImage && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-8">
            <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string) => <Badge key={tag} variant="violet" className="text-xs">{tag}</Badge>)}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{story.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
          {story.umkm && <span className="flex items-center gap-1.5"><Store className="w-4 h-4" /> {story.umkm.name}</span>}
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(story.createdAt)}</span>
        </div>
        {story.excerpt && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 mb-8">
            <p className="text-violet-800 font-medium leading-relaxed">{story.excerpt}</p>
          </div>
        )}
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base">{story.content}</p>
        </div>
      </div>
    </div>
  );
}
