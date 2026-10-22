'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { loginAction } from '@/lib/auth/actions';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es requerido'),
  password: z.string().min(1, 'La contraseña maestra es requerida'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'gemologo@fyn-gemology.org',
      password: '',
      remember: true,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginAction(data.email, data.password);
      if (!result.success) {
        setError(result.error);
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-ivory">
      {/* ─── COLUMNA IZQUIERDA: Panel Oscuro Institucional (5 cols) ─── */}
      <div className="hidden lg:flex lg:col-span-5 bg-surface-panel relative flex-col justify-between p-10 xl:p-14 text-white overflow-hidden shadow-elevation-xl">
        {/* Subtle geometric crystal pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(245, 215, 148, 0.25) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Vault Protocol Tag */}
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-gold/30 text-gold-champagne text-[11px] font-mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>PROTOCOLO DE BÓVEDA V-4.8</span>
          </div>

          <div className="space-y-4 max-w-md">
            <h1 className="font-serif font-medium text-[36px] xl:text-[44px] leading-[44px] xl:leading-[52px] tracking-title-desktop text-white">
              Garantía & Rigor Notarial
            </h1>
            <p className="text-[14px] xl:text-[15px] leading-relaxed text-content-onDarkSec font-sans">
              Sede central de validación gemológica de alta pureza, microscopía confocal y trazabilidad
              blockchain para gemas de inversión soberana.
            </p>
          </div>
        </div>

        {/* Middle: Auth Parameter Card */}
        <div className="relative z-10 my-8">
          <div className="bg-surface-overlay/80 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-5 shadow-elevation-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold font-sans">
                Parámetro de Autenticación
              </span>
              <span className="text-[11px] font-mono text-content-onDarkSec">
                ISO/IEC 17025
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-content-onDarkSec font-sans">
                  Precisión Óptica
                </p>
                <p className="text-[20px] font-bold font-sans text-white mt-1">
                  0.001 ct / 100x
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-content-onDarkSec font-sans">
                  Estado Nodo
                </p>
                <p className="text-[16px] font-semibold font-sans text-gold-glow mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Activo • En línea
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Vault Footnote */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-content-onDarkSec/70 font-sans">
          <span>Reg. de Peritaje FYN</span>
          <span>Est. MCMLXXXIX</span>
        </div>
      </div>

      {/* ─── COLUMNA DERECHA: Formulario de Acceso (7 cols) ─── */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-12 lg:py-16">
        <div className="w-full max-w-xl mx-auto space-y-8 animate-fade-in">
          {/* Top Row: Logo & Restricted Badge */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/uploads/fyn_logo.png"
                  alt="F&N Gemology"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold tracking-[0.12em] text-content-titleDesktop font-sans leading-tight">
                  F&N GEMOLOGY
                </span>
                <span className="text-[10px] tracking-[0.18em] uppercase text-content-muted font-sans">
                  Laboratorio & Certificación
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-semibold tracking-[0.12em] uppercase text-gold-intense font-sans shrink-0">
              <Shield className="w-3.5 h-3.5 text-gold fill-gold/20" />
              <span>Acceso Restringido</span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="font-serif font-medium text-[28px] sm:text-[34px] tracking-title-desktop text-content-titleDesktop leading-tight">
              Acceso Administrativo — FYN Core
            </h2>
            <p className="text-[13px] sm:text-[14px] text-content-body font-sans leading-relaxed">
              Portal restringido de peritaje gemológico y expedición notarial de certificados.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[13px] font-sans flex items-center gap-2 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Correo Electrónico Institucional */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-content-titleDesktop font-sans"
              >
                Correo Electrónico Institucional
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content-placeholder font-sans text-[15px] select-none">
                  @
                </span>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="gemologo@fyn-gemology.org"
                  className="w-full h-12 pl-10 pr-4 text-[14px] font-sans bg-surface-alt border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder text-content-titleDesktop transition-all"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-red-600 font-sans">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña Maestra */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-content-titleDesktop font-sans"
              >
                Contraseña Maestra
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content-placeholder">
                  <KeyRound className="w-4 h-4 text-content-placeholder" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••••••••••"
                  className="w-full h-12 pl-11 pr-11 text-[14px] font-sans bg-surface-alt border border-[#E9E8E3] rounded-md focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold placeholder:text-content-placeholder text-content-titleDesktop transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-titleDesktop transition-colors p-1"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-600 font-sans">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-[13px] font-sans pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-content-body">
                <input
                  type="checkbox"
                  {...register('remember')}
                  className="w-4 h-4 rounded-[2.5px] border-[#C5C6CE] text-brandBlue-action focus:ring-gold/30"
                />
                <span className="text-[12px] sm:text-[13px]">
                  Mantener sesión activa en este equipo seguro
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert(
                    'Para recuperar credenciales periciales, contacte al Administrador de Bóveda F&N.'
                  )
                }
                className="text-[12px] text-content-body hover:text-content-titleDesktop transition-colors underline-offset-2 hover:underline"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>

            {/* Iniciar Sesión Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-brandBlue-action hover:bg-brandBlue-action/90 active:scale-[0.99] text-white text-[13px] font-semibold tracking-[0.1em] uppercase font-sans rounded-md shadow-btn-login transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Validando Credenciales...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Banner Footer */}
          <div className="p-4 rounded-lg bg-surface-alt/70 border border-[#E9E8E3] flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-md bg-[#AF9052]/20 border border-gold/30 flex items-center justify-center text-gold-intense shrink-0">
              <Lock className="w-4 h-4 text-gold-intense" />
            </div>
            <p className="text-[11px] sm:text-[12px] text-content-body font-sans leading-relaxed">
              <strong className="text-content-titleDesktop font-semibold">
                Conexión cifrada de grado pericial SSL 256-bit
              </strong>{' '}
              • Acceso exclusivo para peritos autorizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
