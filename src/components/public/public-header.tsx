"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-stone-200 py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex flex-col relative group">
          <span className="text-2xl font-light tracking-[0.2em] text-stone-900 font-serif">FYN</span>
          <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#C9A96E] transition-all group-hover:w-full"></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/verificar"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#C9A96E]" />
            Verificar Certificado
          </Link>
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-stone-900">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white border-stone-200">
            <div className="flex flex-col gap-8 mt-10">
              <Link
                href="/"
                className="text-lg font-light tracking-[0.2em] text-stone-900 font-serif w-max relative group"
              >
                FYN
                <span className="absolute -bottom-1 left-0 w-1/2 h-px bg-[#C9A96E]"></span>
              </Link>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/verificar"
                  className="text-lg font-medium text-stone-600 hover:text-stone-900 flex items-center gap-3"
                >
                  <ShieldCheck className="w-5 h-5 text-[#C9A96E]" />
                  Verificar Certificado
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
