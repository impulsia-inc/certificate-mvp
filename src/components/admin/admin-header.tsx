'use client';

import Image from 'next/image';
import { Menu, Bell, SlidersHorizontal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { AdminSidebar } from './admin-sidebar';
import type { AuthUser } from '@/lib/auth/auth';

interface AdminHeaderProps {
  user?: AuthUser | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const displayName = user?.name || 'M. Valenzuela (Gemóloga Titular D.G.G.)';

  return (
    <header className="h-16 bg-white border-b border-[#E9E8E3] flex items-center justify-between px-4 lg:px-8 shrink-0">
      {/* Mobile Drawer Trigger & Brand */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-content-titleDesktop">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0 bg-[#18283E]">
            <SheetTitle className="sr-only">Navegación Administrativa</SheetTitle>
            <AdminSidebar className="w-full border-r-0 h-full flex" />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2.5 md:hidden">
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/uploads/fyn_logo.png"
              alt="F&N Gemology"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold tracking-wider font-sans text-stone-900">
            F&N CORE
          </span>
        </div>
      </div>

      {/* Desktop Search / Breadcrumb Placeholder or Left Balance */}
      <div className="hidden md:block">
        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-content-muted font-sans">
          Panel de Control Notarial & Peritaje
        </span>
      </div>

      {/* Right Controls: Filter, Notifications & Perito Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          className="p-2 text-content-muted hover:text-content-titleDesktop transition-colors rounded-md hover:bg-surface-alt"
          title="Configuración de Parámetros"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="p-2 text-content-muted hover:text-content-titleDesktop transition-colors rounded-md hover:bg-surface-alt relative"
          title="Notificaciones de Expedición"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-[#E9E8E3] hidden sm:block" />

        {/* User Badge matching Figma */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#263C59] text-white flex items-center justify-center font-serif text-xs font-semibold shrink-0 ring-1 ring-gold/40">
            MV
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[12px] font-semibold text-content-titleDesktop font-sans leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-content-muted font-sans leading-tight">
              Sede Central • Cali
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
