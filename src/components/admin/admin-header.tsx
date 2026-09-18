'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { AdminSidebar } from './admin-sidebar';

import type { AuthUser } from '@/lib/auth/auth';

interface AdminHeaderProps {
  user?: AuthUser | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-8 md:hidden shrink-0">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navegación</SheetTitle>
            <AdminSidebar className="w-full border-r-0 h-full flex" />
          </SheetContent>
        </Sheet>
        <span className="text-xl font-serif font-bold text-stone-900 md:hidden">FYN</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-medium text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
