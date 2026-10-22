'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import Image from 'next/image';

const NAV_LINKS = [
  {
    label: 'SERVICIOS',
    href: '/#servicios',
    hasDropdown: true,
    children: [
      { label: 'Certificación de Gemas', href: '/#servicios' },
      { label: 'Certificación de Joyas', href: '/#servicios' },
    ],
  },
  { label: 'SOBRE NOSOTROS', href: '/#laboratorio' },
  { label: 'VERIFICAR', href: '/verificar' },
  { label: 'CONTACTO', href: '/#contacto' },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-[#E9E8E3]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-9 h-9 lg:w-10 lg:h-10 shrink-0">
              <Image
                src="/uploads/fyn_logo.png"
                alt="F&N Gemology Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] lg:text-[16px] font-semibold tracking-[0.12em] text-content-titleDesktop font-sans leading-tight">
                F&N GEMOLOGY
              </span>
              <span className="text-[9px] lg:text-[10px] tracking-[0.18em] text-content-muted font-sans uppercase leading-tight">
                Laboratorio & Certificación
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.hasDropdown ? (
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                    className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.15em] text-content-body hover:text-content-titleDesktop transition-colors uppercase font-sans"
                  >
                    {link.label}
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', dropdownOpen && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-[11px] font-semibold tracking-[0.15em] text-content-body hover:text-content-titleDesktop transition-colors uppercase font-sans"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Dropdown */}
                {link.hasDropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-elevation-md border border-[#E9E8E3] py-2 animate-fade-in-down">
                    {link.children?.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-[12px] tracking-wide text-content-body hover:text-content-titleDesktop hover:bg-surface-alt transition-colors font-sans"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-content-titleDesktop"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-ivory animate-fade-in">
          <nav className="container mx-auto px-4 py-8 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[13px] font-semibold tracking-[0.12em] text-content-titleDesktop uppercase font-sans"
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mt-3 ml-4 flex flex-col gap-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-[12px] tracking-wide text-content-body font-sans"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
