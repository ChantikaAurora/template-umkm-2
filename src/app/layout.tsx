import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UMKM Digital 2 — Ekosistem UMKM Indonesia',
  description: 'Platform ekosistem digital modern untuk UMKM Indonesia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
