import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </Providers>
  );
}
