import type { ReactNode } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

interface SiteLayoutProps {
  children: ReactNode;
}

function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}

export default SiteLayout;
