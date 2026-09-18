import fs from 'fs/promises';
import path from 'path';

const basePath = process.cwd();

async function writeFile(filePath, content) {
    const fullPath = path.join(basePath, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content.trim() + '\n', 'utf-8');
    console.log(`Created ${filePath}`);
}

async function run() {
await writeFile('src/proxy.ts', `
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('fyn_session')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  if (isAdminRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|demo|uploads).*)'],
}
`);

await writeFile('src/app/(auth)/login/page.tsx', `
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
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
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginAction(data);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg border border-stone-200 rounded-xl p-8">
        <div className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-serif font-bold text-stone-900 tracking-wider">FYN</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            Acceso Administrativo
          </h1>
          <p className="text-sm text-stone-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@fyn.com"
              {...register('email')}
              className={cn(errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={cn(errors.password && "border-red-500", "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#C9A96E] hover:bg-[#b5955a] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando sesión...</>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
`);

await writeFile('src/app/(admin)/admin/layout.tsx', `
import { redirect } from 'next/navigation';
import { getSessionAction } from '@/lib/auth/actions';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const session = await getSessionAction();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      <AdminSidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
`);

await writeFile('src/components/admin/admin-sidebar.tsx', `
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
`);

await writeFile('src/components/admin/admin-header.tsx', `
'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { AdminSidebar } from './admin-sidebar';

interface AdminHeaderProps {
  user?: any;
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
`);

await writeFile('src/components/admin/stats-card.tsx', `
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 hover:border-[#C9A96E]/50 transition-colors shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <Icon className="h-5 w-5 text-stone-400" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-semibold text-stone-900">{value}</p>
        {description && (
          <p className="text-sm text-stone-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
`);

await writeFile('src/app/(admin)/admin/page.tsx', `
import { Award, CheckCircle, XCircle, FileEdit } from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { PageHeader } from '@/components/shared/page-header';
import { getDashboardStats, getRecentCertificates } from '@/features/certificates/actions/certificate.actions';
import { CertificateTable } from '@/components/certificates/certificate-table';

export const metadata = {
  title: 'Dashboard | FYN',
};

export default async function AdminDashboardPage({}: PageProps<'/admin'>) {
  const [stats, recentCertificates] = await Promise.all([
    getDashboardStats(),
    getRecentCertificates()
  ]);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Resumen general de certificaciones"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total" value={stats?.total || 0} icon={Award} />
        <StatsCard title="Activas" value={stats?.active || 0} icon={CheckCircle} />
        <StatsCard title="Revocadas" value={stats?.revoked || 0} icon={XCircle} />
        <StatsCard title="Borradores" value={stats?.draft || 0} icon={FileEdit} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Certificaciones Recientes</h2>
        <CertificateTable data={recentCertificates || []} />
      </div>
    </div>
  );
}
`);

await writeFile('src/components/shared/page-header.tsx', `
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  backHref?: string;
}

export function PageHeader({ title, description, action, backHref }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        {backHref && (
          <Link 
            href={backHref}
            className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">{title}</h1>
        {description && (
          <p className="text-stone-500 text-sm">{description}</p>
        )}
      </div>
      
      {action && (
        <Button asChild className="bg-[#C9A96E] hover:bg-[#b5955a] text-white">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
`);

await writeFile('src/components/shared/confirm-dialog.tsx', `
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading,
  destructive,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={destructive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-[#C9A96E] hover:bg-[#b5955a] text-white"}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
`);

await writeFile('src/components/certificates/certificate-table.tsx', `
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Eye, Edit, Search, MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '@/components/certificates/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CertificateTable({ data }: { data: any[] }) {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = [
    { accessorKey: 'reference', header: 'Referencia' },
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'category', header: 'Categoría', cell: ({ row }: any) => <span className="capitalize">{row.getValue('category')}</span> },
    { accessorKey: 'material', header: 'Material' },
    { accessorKey: 'status', header: 'Estado', cell: ({ row }: any) => <StatusBadge status={row.getValue('status')} /> },
    {
      accessorKey: 'issuedAt',
      header: 'Fecha',
      cell: ({ row }: any) => {
        const val = row.getValue('issuedAt');
        return val ? new Date(val).toLocaleDateString() : 'N/A';
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => {
        const cert = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={\`/certificados/\${cert.reference}\`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" /> Ver público
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={\`/admin/certificados/\${cert.id}\`}>
                  <Edit className="mr-2 h-4 w-4" /> Editar / Opciones
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500" />
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>
      <div className="rounded-md border border-stone-200 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-stone-700 font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-stone-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-stone-500">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
`);

await writeFile('src/app/(admin)/admin/certificados/page.tsx', `
import { PageHeader } from '@/components/shared/page-header';
import { listCertificates } from '@/features/certificates/actions/certificate.actions';
import { CertificateTable } from '@/components/certificates/certificate-table';

export const metadata = {
  title: 'Certificaciones | FYN',
};

export default async function CertificatesPage({}: PageProps<'/admin/certificados'>) {
  const certificates = await listCertificates();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Certificaciones" 
        description="Gestiona todas las certificaciones de la plataforma"
        action={{ label: 'Nueva certificación', href: '/admin/certificados/nuevo' }}
      />
      
      <CertificateTable data={certificates || []} />
    </div>
  );
}
`);

await writeFile('src/components/certificates/certificate-form.tsx', `
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { certificateSchema } from '@/features/certificates/schemas';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud } from 'lucide-react';

type CertificateFormValues = z.infer<typeof certificateSchema>;

export function CertificateForm({ initialData, onSubmit }: { initialData?: any; onSubmit: (data: any) => Promise<void> }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: initialData || { status: 'draft', category: 'anillo' },
  });

  const onFormSubmit = async (data: CertificateFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <h3 className="text-lg font-semibold text-stone-800">Información de Certificación</h3>
        </div>
        <div className="p-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Referencia</Label>
            <Input disabled placeholder="Auto-generada o ingresar..." {...register('reference')} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select onValueChange={(v) => setValue('status', v as any)} defaultValue={watch('status')}>
              <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="revoked">Revocado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <h3 className="text-lg font-semibold text-stone-800">Información de la Joya</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input {...register('name')} />
              {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select onValueChange={(v) => setValue('category', v)} defaultValue={watch('category')}>
                <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="anillo">Anillo</SelectItem>
                  <SelectItem value="collar">Collar</SelectItem>
                  <SelectItem value="pulsera">Pulsera</SelectItem>
                  <SelectItem value="reloj">Reloj</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea {...register('description')} rows={4} />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Material</Label>
              <Input {...register('material')} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Metal</Label>
              <Input {...register('metalType')} />
            </div>
            <div className="space-y-2">
              <Label>Pureza</Label>
              <Input {...register('purity')} />
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Peso</Label>
              <Input type="number" step="0.01" {...register('weight', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Unidad de Peso</Label>
              <Input {...register('weightUnit')} defaultValue="g" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/50">
          <h3 className="text-lg font-semibold text-stone-800">Documentos e Imágenes</h3>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-stone-200 rounded-lg p-12 text-center hover:bg-stone-50 transition-colors cursor-pointer">
            <UploadCloud className="mx-auto h-8 w-8 text-stone-400 mb-4" />
            <p className="text-sm text-stone-600">Haz clic o arrastra archivos aquí</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-[#C9A96E] hover:bg-[#b5955a] text-white">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar
        </Button>
      </div>
    </form>
  );
}
`);

await writeFile('src/app/(admin)/admin/certificados/nuevo/page.tsx', `
'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { CertificateForm } from '@/components/certificates/certificate-form';
import { createCertificate } from '@/features/certificates/actions/certificate.actions';

export default function NewCertificatePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createCertificate(data);
    router.push('/admin/certificados');
    router.refresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader title="Nueva Certificación" backHref="/admin/certificados" />
      <CertificateForm onSubmit={handleSubmit} />
    </div>
  );
}
`);

await writeFile('src/app/(admin)/admin/certificados/[id]/edit-actions.tsx', `
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { updateCertificate } from '@/features/certificates/actions/certificate.actions';
import { useRouter } from 'next/navigation';
import { Ban, RotateCcw } from 'lucide-react';

export function EditActions({ id, status }: { id: string; status: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isRevoked = status === 'revoked';

  const handleAction = async () => {
    setLoading(true);
    try {
      await updateCertificate(id, { status: isRevoked ? 'active' : 'revoked' });
      router.refresh();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'draft') return null;

  return (
    <>
      <Button 
        variant="outline" 
        className={isRevoked ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
        onClick={() => setOpen(true)}
      >
        {isRevoked ? <RotateCcw className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
        {isRevoked ? 'Reactivar' : 'Revocar'}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={isRevoked ? "¿Reactivar certificado?" : "¿Revocar certificado?"}
        description={isRevoked 
          ? "El certificado volverá a ser válido públicamente." 
          : "El certificado aparecerá como revocado y ya no será válido."}
        onConfirm={handleAction}
        isLoading={loading}
        destructive={!isRevoked}
      />
    </>
  );
}
`);

await writeFile('src/app/(admin)/admin/certificados/[id]/page.tsx', `
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { CertificateForm } from '@/components/certificates/certificate-form';
import { getCertificate, updateCertificate } from '@/features/certificates/actions/certificate.actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { EditActions } from './edit-actions';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: \`Editar Certificación \${id} | FYN\` };
}

export default async function EditCertificatePage({ params }: PageProps<'/admin/certificados/[id]'>) {
  const { id } = await params;
  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  const handleSubmit = async (data: any) => {
    'use server';
    await updateCertificate(id, data);
    revalidatePath('/admin/certificados');
    redirect('/admin/certificados');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Editar Certificación" backHref="/admin/certificados" />
        <EditActions id={id} status={certificate.status} />
      </div>
      
      <CertificateForm initialData={certificate} onSubmit={handleSubmit} />
    </div>
  );
}
`);
}

run().catch(console.error);
