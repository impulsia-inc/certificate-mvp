'use server';

import { revalidatePath } from 'next/cache';
import { count } from 'drizzle-orm';
import { db } from '@/db';
import { 
  certificateTable, 
  jewelryTable, 
  gemologicalDetailTable, 
  additionalStonesTable, 
  certificateFileTable 
} from '@/db/schema';
import { generateReference } from '@/lib/reference/generator';
import { getStorageService } from '@/lib/storage';
import { getCertificateService } from '@/features/certificates/services';
import { certificateFormSchema, type CertificateFormData } from '@/features/certificates/schemas';
import type { 
  CertificateDetail, 
  CertificateWithJewelry, 
  CertificateFilters, 
  CreateCertificateInput, 
  UpdateCertificateInput, 
  Certificate, 
  PaginatedResult 
} from '@/types';

type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Public Actions ───

export async function lookupCertificate(
  reference: string
): Promise<ActionResult<CertificateDetail>> {
  try {
    const service = getCertificateService();
    const cert = await service.getPublicCertificate(reference.trim().toUpperCase());
    
    if (!cert) {
      return { success: false, error: 'No se encontró ninguna certificación con esa referencia.' };
    }
    
    return { success: true, data: cert };
  } catch {
    return { success: false, error: 'Ocurrió un error al buscar la certificación.' };
  }
}

// ─── Admin Actions ───

export async function getCertificate(
  id: string
): Promise<ActionResult<CertificateDetail>> {
  try {
    const service = getCertificateService();
    const cert = await service.getCertificate(id);
    
    if (!cert) {
      return { success: false, error: 'Certificado no encontrado.' };
    }
    
    return { success: true, data: cert };
  } catch {
    return { success: false, error: 'Error al obtener el certificado.' };
  }
}

export async function listCertificates(
  filters?: CertificateFilters
): Promise<ActionResult<CertificateWithJewelry[]>> {
  try {
    const service = getCertificateService();
    const certs = await service.listCertificates(filters);
    return { success: true, data: certs };
  } catch {
    return { success: false, error: 'Error al obtener certificaciones.' };
  }
}

export async function listCertificatesPaginated(
  filters?: CertificateFilters
): Promise<ActionResult<PaginatedResult<CertificateWithJewelry>>> {
  try {
    const service = getCertificateService();
    const result = await service.listCertificatesPaginated(filters);
    return { success: true, data: result };
  } catch {
    return { success: false, error: 'Error al obtener certificaciones paginadas.' };
  }
}

export async function createCertificate(
  input: CreateCertificateInput
): Promise<ActionResult<Certificate>> {
  try {
    const service = getCertificateService();
    const cert = await service.createCertificate(input);
    return { success: true, data: cert };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al crear certificación.';
    return { success: false, error: message };
  }
}

export async function createCertificateAction(
  formData: FormData
): Promise<ActionResult<{ id: string; reference: string }>> {
  try {
    const rawData = formData.get('data');
    if (!rawData || typeof rawData !== 'string') {
      return { success: false, error: 'No se recibieron datos del formulario.' };
    }

    const parsedData = JSON.parse(rawData) as CertificateFormData;
    
    const validation = certificateFormSchema.safeParse(parsedData);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return { 
        success: false, 
        error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Error de validación del formulario' 
      };
    }

    const data = validation.data;
    const storageService = getStorageService();

    const image1 = formData.get('image1') as File | null;
    const image2 = formData.get('image2') as File | null;

    let uploadedFile1: { storageKey: string; size: number; mimeType: string; originalName: string } | null = null;
    let uploadedFile2: { storageKey: string; size: number; mimeType: string; originalName: string } | null = null;

    if (image1 && image1.size > 0 && typeof image1.arrayBuffer === 'function') {
      const res1 = await storageService.upload(image1, 'certificates');
      uploadedFile1 = {
        storageKey: res1.storageKey,
        size: res1.size,
        mimeType: res1.mimeType,
        originalName: image1.name,
      };
    }

    if (image2 && image2.size > 0 && typeof image2.arrayBuffer === 'function') {
      const res2 = await storageService.upload(image2, 'certificates');
      uploadedFile2 = {
        storageKey: res2.storageKey,
        size: res2.size,
        mimeType: res2.mimeType,
        originalName: image2.name,
      };
    }

    const result = await db.transaction(async (tx) => {
      // 1. Jewelry record
      let jewelryId: string | null = null;
      if (data.certificateType === 'jewelry') {
        const [insertedJewelry] = await tx
          .insert(jewelryTable)
          .values({
            name: data.jewelry?.name || 'Joya sin denominación',
            category: data.jewelry?.category || 'Otro',
            material: data.jewelry?.material || null,
            metalType: data.jewelry?.metalType || null,
            purity: data.jewelry?.purity || null,
            grossWeight: data.jewelry?.grossWeight !== undefined && data.jewelry?.grossWeight !== null 
              ? data.jewelry.grossWeight.toString() 
              : null,
            weightUnit: data.jewelry?.weightUnit || 'g',
            serialNumber: data.jewelry?.serialNumber || null,
            description: data.jewelry?.comments || null,
            comments: data.jewelry?.comments || null,
          })
          .returning();
        jewelryId = insertedJewelry.id;
      } else {
        const defaultName = data.stoneKind === 'diamond' 
          ? 'Diamante Suelto' 
          : (data.gemDetail?.variety ? `${data.gemDetail.variety} Suelto` : 'Gema de Color Suelta');
        const [insertedJewelry] = await tx
          .insert(jewelryTable)
          .values({
            name: defaultName,
            category: 'Piedra Suelta',
            description: data.stoneKind === 'diamond' 
              ? (data.diamondDetail?.shapeAndCut ? `Talla: ${data.diamondDetail.shapeAndCut}` : 'Diamante peritado') 
              : (data.gemDetail?.treatment || 'Gema peritada'),
          })
          .returning();
        jewelryId = insertedJewelry.id;
      }

      // 2. Reference sequence
      const [countResult] = await tx.select({ total: count() }).from(certificateTable);
      const seq = (Number(countResult?.total) || 0) + 1;
      const reference = generateReference(seq);

      // 3. Certificate
      const [insertedCert] = await tx
        .insert(certificateTable)
        .values({
          reference,
          certificateType: data.certificateType,
          certificateNumber: data.certificateNumber || null,
          jewelryId,
          status: data.status || 'draft',
          issuedAt: data.issuedAt ? new Date(data.issuedAt) : new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      const certId = insertedCert.id;

      // 4. Gemological details
      if (data.stoneKind === 'diamond') {
        await tx.insert(gemologicalDetailTable).values({
          certificateId: certId,
          stoneKind: 'diamond',
          nature: data.diamondDetail?.nature || 'Natural',
          variety: 'Diamante',
          shapeAndCut: data.diamondDetail?.shapeAndCut || null,
          measurements: data.diamondDetail?.measurements || null,
          weight: data.diamondDetail?.weight !== undefined && data.diamondDetail?.weight !== null 
            ? data.diamondDetail.weight.toString() 
            : null,
          color: data.diamondDetail?.color || null,
          clarityGrade: data.diamondDetail?.clarityGrade || null,
          cutGrade: data.diamondDetail?.cutGrade || null,
          fluorescence: data.diamondDetail?.fluorescence || null,
          polish: data.diamondAdditionalInfo?.polish || null,
          symmetry: data.diamondAdditionalInfo?.symmetry || null,
          proportions: data.diamondAdditionalInfo?.proportions || null,
        });
      } else {
        await tx.insert(gemologicalDetailTable).values({
          certificateId: certId,
          stoneKind: 'colored_gem',
          nature: data.gemDetail?.nature || 'Natural',
          variety: data.gemDetail?.variety || null,
          shapeAndCut: data.gemDetail?.shapeAndCut || null,
          measurements: data.gemDetail?.measurements || null,
          weight: data.gemDetail?.weight !== undefined && data.gemDetail?.weight !== null 
            ? data.gemDetail.weight.toString() 
            : null,
          color: data.gemDetail?.color || null,
          transparency: data.gemDetail?.transparency || null,
          cutGrade: data.gemDetail?.cutGrade || null,
          treatment: data.gemDetail?.treatment || null,
        });
      }

      // 5. Additional Stones
      if (data.hasAdditionalDiamonds && data.additionalDiamonds) {
        await tx.insert(additionalStonesTable).values({
          certificateId: certId,
          stoneKind: 'diamond',
          nature: data.additionalDiamonds.nature || null,
          totalStones: data.additionalDiamonds.totalStones || null,
          shapeAndCut: data.additionalDiamonds.shapeAndCut || null,
          measurements: data.additionalDiamonds.measurements || null,
          estimatedWeight: data.additionalDiamonds.estimatedWeight !== undefined && data.additionalDiamonds.estimatedWeight !== null 
            ? data.additionalDiamonds.estimatedWeight.toString() 
            : null,
          estimatedColor: data.additionalDiamonds.estimatedColor || null,
          estimatedClarity: data.additionalDiamonds.estimatedClarity || null,
        });
      }

      if (data.hasAdditionalGems && data.additionalGems) {
        await tx.insert(additionalStonesTable).values({
          certificateId: certId,
          stoneKind: 'colored_gem',
          nature: data.additionalGems.nature || null,
          variety: data.additionalGems.variety || null,
          totalStones: data.additionalGems.totalStones || null,
          shapeAndCut: data.additionalGems.shapeAndCut || null,
          measurements: data.additionalGems.measurements || null,
          estimatedWeight: data.additionalGems.estimatedWeight !== undefined && data.additionalGems.estimatedWeight !== null 
            ? data.additionalGems.estimatedWeight.toString() 
            : null,
          estimatedColor: data.additionalGems.color || null,
        });
      }

      // 6. Certificate Files
      if (uploadedFile1) {
        await tx.insert(certificateFileTable).values({
          certificateId: certId,
          type: 'jewelry_image',
          role: 'primary_image',
          displayOrder: 1,
          storageKey: uploadedFile1.storageKey,
          originalName: uploadedFile1.originalName,
          mimeType: uploadedFile1.mimeType,
          size: uploadedFile1.size,
          createdAt: new Date(),
        });
      }

      if (uploadedFile2) {
        await tx.insert(certificateFileTable).values({
          certificateId: certId,
          type: 'jewelry_image',
          role: 'secondary_image',
          displayOrder: 2,
          storageKey: uploadedFile2.storageKey,
          originalName: uploadedFile2.originalName,
          mimeType: uploadedFile2.mimeType,
          size: uploadedFile2.size,
          createdAt: new Date(),
        });
      }

      return { id: certId, reference };
    });

    revalidatePath('/admin/certificados');
    revalidatePath(`/verificar/${result.reference}`);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating certificate:', error);
    const message = error instanceof Error ? error.message : 'Error inesperado al emitir certificación.';
    return { success: false, error: message };
  }
}

export async function updateCertificate(
  id: string,
  input: UpdateCertificateInput
): Promise<ActionResult<Certificate>> {
  try {
    const service = getCertificateService();
    const cert = await service.updateCertificate(id, input);
    return { success: true, data: cert };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al actualizar certificación.';
    return { success: false, error: message };
  }
}

export async function revokeCertificate(
  id: string
): Promise<ActionResult<Certificate>> {
  try {
    const service = getCertificateService();
    const cert = await service.revokeCertificate(id);
    return { success: true, data: cert };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al anular certificación.';
    return { success: false, error: message };
  }
}

export async function reactivateCertificate(
  id: string
): Promise<ActionResult<Certificate>> {
  try {
    const service = getCertificateService();
    const cert = await service.reactivateCertificate(id);
    return { success: true, data: cert };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al reactivar certificación.';
    return { success: false, error: message };
  }
}

export async function getDashboardStats(): Promise<ActionResult<{ total: number; active: number; revoked: number; draft: number }>> {
  try {
    const service = getCertificateService();
    const stats = await service.getDashboardStats();
    return { success: true, data: stats };
  } catch {
    return { success: false, error: 'Error al obtener estadísticas.' };
  }
}

export async function getRecentCertificates(
  limit: number = 5
): Promise<ActionResult<CertificateWithJewelry[]>> {
  try {
    const service = getCertificateService();
    const certs = await service.getRecentCertificates(limit);
    return { success: true, data: certs };
  } catch {
    return { success: false, error: 'Error al obtener certificaciones recientes.' };
  }
}
