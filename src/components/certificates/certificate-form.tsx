'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCertificateSchema } from '@/features/certificates/schemas';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, UploadCloud, Save, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CertificateDetail } from '@/types';

type FormValues = z.infer<typeof createCertificateSchema>;

const CATEGORIES = [
  'Anillo', 'Cadena', 'Pulsera', 'Aretes', 'Collar', 'Reloj', 'Broche', 'Otro'
] as const;

interface CertificateFormProps {
  initialData?: CertificateDetail;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export function CertificateForm({ initialData, onSubmit }: CertificateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const defaultValues: Partial<FormValues> = initialData
    ? {
        status: initialData.status,
        issuedAt: initialData.issuedAt.split('T')[0],
        certificateNumber: initialData.certificateNumber || '',
        jewelry: {
          name: initialData.jewelry.name,
          category: initialData.jewelry.category,
          description: initialData.jewelry.description || '',
          material: initialData.jewelry.material || '',
          metalType: initialData.jewelry.metalType || '',
          purity: initialData.jewelry.purity || '',
          weight: initialData.jewelry.weight,
          weightUnit: initialData.jewelry.weightUnit || 'g',
          serialNumber: initialData.jewelry.serialNumber || '',
          stoneType: initialData.jewelry.stoneType || '',
          stoneWeight: initialData.jewelry.stoneWeight,
          stoneColor: initialData.jewelry.stoneColor || '',
          stoneClarity: initialData.jewelry.stoneClarity || '',
          brand: initialData.jewelry.brand || '',
          model: initialData.jewelry.model || '',
        },
      }
    : {
        status: 'draft',
        issuedAt: new Date().toISOString().split('T')[0],
        jewelry: { name: '', category: 'Anillo', weightUnit: 'g' },
      };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: defaultValues as FormValues,
  });

  const currentStatus = watch('status');

  const onFormSubmit = async (data: FormValues, publishAction?: 'draft' | 'active') => {
    setIsLoading(true);
    setError(null);
    try {
      const submitData = { ...data };
      if (publishAction) {
        submitData.status = publishAction;
      }
      await onSubmit(submitData as unknown as Record<string, unknown>);
      router.push('/admin/certificados');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al guardar';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => onFormSubmit(data))} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Certificate Info Section */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <h3 className="text-base font-semibold text-stone-800">Información de Certificación</h3>
        </div>
        <div className="p-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="reference">Referencia</Label>
            <Input
              id="reference"
              disabled
              placeholder="Se generará automáticamente"
              value={initialData?.reference || ''}
              className="bg-stone-50 font-mono"
            />
            <p className="text-xs text-stone-400">La referencia se asigna al crear la certificación.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificateNumber">Nº de Certificado</Label>
            <Input id="certificateNumber" {...register('certificateNumber')} placeholder="Ej: CN-2026-0001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              onValueChange={(v) => setValue('status', v as FormValues['status'])}
              defaultValue={currentStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuedAt">Fecha de emisión</Label>
            <Input id="issuedAt" type="date" {...register('issuedAt')} />
            {errors.issuedAt && (
              <p className="text-sm text-red-500">{errors.issuedAt.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Jewelry Info Section */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <h3 className="text-base font-semibold text-stone-800">Información de la Joya</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jewelry.name">Nombre de la pieza *</Label>
              <Input id="jewelry.name" {...register('jewelry.name')} placeholder="Ej: Anillo de Compromiso" />
              {errors.jewelry?.name && (
                <p className="text-sm text-red-500">{errors.jewelry.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.category">Categoría *</Label>
              <Select
                onValueChange={(v) => setValue('jewelry.category', v as FormValues['jewelry']['category'])}
                defaultValue={watch('jewelry.category')}
              >
                <SelectTrigger id="jewelry.category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jewelry.description">Descripción</Label>
            <Textarea id="jewelry.description" {...register('jewelry.description')} rows={3} placeholder="Descripción detallada de la pieza..." />
          </div>

          <Separator />

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jewelry.material">Material</Label>
              <Input id="jewelry.material" {...register('jewelry.material')} placeholder="Ej: Oro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.metalType">Tipo de metal</Label>
              <Input id="jewelry.metalType" {...register('jewelry.metalType')} placeholder="Ej: Oro Amarillo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.purity">Pureza</Label>
              <Input id="jewelry.purity" {...register('jewelry.purity')} placeholder="Ej: 18K" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jewelry.weight">Peso</Label>
              <Input id="jewelry.weight" type="number" step="0.01" {...register('jewelry.weight', { valueAsNumber: true })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.weightUnit">Unidad</Label>
              <Input id="jewelry.weightUnit" {...register('jewelry.weightUnit')} placeholder="g" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.serialNumber">Nº de Serie</Label>
              <Input id="jewelry.serialNumber" {...register('jewelry.serialNumber')} placeholder="Opcional" />
            </div>
          </div>

          <Separator />

          <h4 className="text-sm font-medium text-stone-700">Piedra Preciosa</h4>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="jewelry.stoneType">Tipo</Label>
              <Input id="jewelry.stoneType" {...register('jewelry.stoneType')} placeholder="Ej: Diamante" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.stoneWeight">Peso (ct)</Label>
              <Input id="jewelry.stoneWeight" type="number" step="0.01" {...register('jewelry.stoneWeight', { valueAsNumber: true })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.stoneColor">Color</Label>
              <Input id="jewelry.stoneColor" {...register('jewelry.stoneColor')} placeholder="Ej: G" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.stoneClarity">Claridad</Label>
              <Input id="jewelry.stoneClarity" {...register('jewelry.stoneClarity')} placeholder="Ej: VS1" />
            </div>
          </div>

          <Separator />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jewelry.brand">Marca</Label>
              <Input id="jewelry.brand" {...register('jewelry.brand')} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jewelry.model">Modelo</Label>
              <Input id="jewelry.model" {...register('jewelry.model')} placeholder="Opcional" />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <h3 className="text-base font-semibold text-stone-800">Documentos e Imágenes</h3>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-stone-200 rounded-lg p-10 text-center hover:border-stone-300 hover:bg-stone-50/50 transition-colors cursor-pointer">
            <UploadCloud className="mx-auto h-8 w-8 text-stone-400 mb-3" />
            <p className="text-sm text-stone-600 font-medium">Haz clic o arrastra archivos aquí</p>
            <p className="text-xs text-stone-400 mt-1">PDF, JPG, PNG o WebP · Máximo 10MB</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleSubmit((data) => onFormSubmit(data, 'draft'))}
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar borrador
        </Button>
        <Button
          type="button"
          disabled={isLoading}
          className="bg-brand hover:bg-brand-hover text-brand-foreground"
          onClick={handleSubmit((data) => onFormSubmit(data, 'active'))}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Publicar certificación
        </Button>
      </div>
    </form>
  );
}
