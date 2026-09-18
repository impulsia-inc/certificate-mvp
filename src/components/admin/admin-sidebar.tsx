'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, Plus, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/auth/actions';

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/certificados', label: 'Certificaciones', icon: Award },
    { href: '/admin/certificados/nuevo', label: 'Nueva Certificación', icon: Plus },
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-stone-200 flex flex-col", className)}>
      <div className="h-16 flex items-center px-6 border-b border-stone-200 shrink-0">
        <span className="text-2xl font-serif font-bold text-stone-900 tracking-widest">FYN</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href) && link.href !== '/admin');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#C9A96E]/10 text-[#C9A96E]" 
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-stone-200 shrink-0">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
