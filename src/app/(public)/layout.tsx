import React from 'react';
import { PublicNavbar } from '@/components/public/public-header';
import { Footer } from '@/components/public/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <PublicNavbar />
      <main className="flex-1 flex flex-col w-full">{children}</main>
      <Footer />
    </div>
  );
}
