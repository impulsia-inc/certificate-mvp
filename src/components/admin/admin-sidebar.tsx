'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, Plus, LogOut, FileText, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/auth/actions';

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Gestión de Certificados', icon: Award },
    { href: '/admin/certificados/nuevo', label: 'Nuevo Certificado', icon: Plus },
    { href: '/verificar', label: 'Portal Público (Verificar)', icon: Shield },
  ];

  return (
    <div className={cn("w-64 bg-[#18283E] text-white border-r border-[#223854] flex flex-col shrink-0", className)}>
      {/* Brand Header */}
      <div className="h-18 flex items-center gap-3 px-6 border-b border-[#223854] shrink-0 bg-[#142134]">
        <div className="relative w-8 h-8 shrink-0">
          <Image
            src="/uploads/fyn_logo.png"
            alt="F&N Gemology"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold tracking-[0.14em] font-sans text-white leading-tight">
            F&N CORE
          </span>
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-gold leading-tight mt-0.5">
            ADMINISTRACIÓN
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-content-onDarkSec/70 font-sans">
          Módulos Periciales
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href === '/admin' && (pathname === '/admin' || pathname === '/admin/certificados'));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-md text-[13px] font-medium font-sans transition-all",
                isActive 
                  ? "bg-[#223854] text-white border-l-2 border-gold shadow-sm" 
                  : "text-stone-300 hover:bg-[#20344d] hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-gold" : "text-stone-400")} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#223854] shrink-0 bg-[#142134]/50">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-md text-[12px] font-medium font-sans text-stone-300 hover:bg-[#20344d] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-stone-400" />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
}
