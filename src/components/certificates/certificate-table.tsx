'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import { Eye, Pencil, Search, MoreHorizontal } from 'lucide-react';
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
import type { CertificateWithJewelry, CertificateStatus } from '@/types';

const columns: ColumnDef<CertificateWithJewelry>[] = [
  {
    accessorKey: 'reference',
    header: 'Referencia',
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-stone-900">
        {row.getValue('reference')}
      </span>
    ),
  },
  {
    id: 'name',
    header: 'Nombre',
    accessorFn: (row) => row.jewelry.name,
    cell: ({ getValue }) => (
      <span className="text-stone-700">{getValue<string>()}</span>
    ),
  },
  {
    id: 'category',
    header: 'Categoría',
    accessorFn: (row) => row.jewelry.category,
    cell: ({ getValue }) => (
      <span className="text-stone-600">{getValue<string>()}</span>
    ),
  },
  {
    id: 'material',
    header: 'Material',
    accessorFn: (row) => row.jewelry.material || '—',
    cell: ({ getValue }) => (
      <span className="text-stone-600">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue<CertificateStatus>('status')} />
    ),
  },
  {
    accessorKey: 'issuedAt',
    header: 'Fecha',
    cell: ({ row }) => {
      const val = row.getValue<string>('issuedAt');
      return (
        <span className="text-stone-500 text-sm">
          {val ? new Date(val).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : '—'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const cert = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/verificar/${cert.reference}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Ver público
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/certificados/${cert.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface CertificateTableProps {
  data: CertificateWithJewelry[];
}

export function CertificateTable({ data }: CertificateTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');

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
      <div className="flex items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Buscar por referencia, nombre..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="bg-stone-50/80 hover:bg-stone-50/80">
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="text-stone-600 text-xs uppercase tracking-wider font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-stone-50/50 transition-colors">
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
                  No se encontraron certificaciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
