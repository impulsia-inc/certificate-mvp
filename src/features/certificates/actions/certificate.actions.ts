'use server';

import { getCertificateService } from '@/features/certificates/services';
import type { CertificateDetail, CertificateWithJewelry, CertificateFilters, CreateCertificateInput, UpdateCertificateInput, Certificate } from '@/types';

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
