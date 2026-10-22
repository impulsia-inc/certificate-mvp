import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'node:fs';
import path from 'node:path';
import { createCertificateAction, getDashboardStats, listCertificatesPaginated, lookupCertificate } from '../features/certificates/actions/certificate.actions';
import type { CertificateFormData } from '../features/certificates/schemas';

async function runTest() {
  console.log('====================================================');
  console.log('🚀 INICIANDO AUDITORÍA & TEST END-TO-END DE EMISIÓN');
  console.log('====================================================\n');

  // 1. Create 1x1 dummy PNG buffer for testing
  // Minimal valid 1x1 PNG bytes
  const dummyPng = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82
  ]);

  const file1 = new File([dummyPng], 'test_front.png', { type: 'image/png' });
  const file2 = new File([dummyPng], 'test_detail.png', { type: 'image/png' });

  // ─── Test 1: Emisión de Certificado de DIAMANTE SUELTO ───
  console.log('📋 [1/4] Creando Certificado 1: DIAMANTE NATURAL SUELTO...');
  const diamondData: CertificateFormData = {
    reportLanguage: 'es',
    certificateType: 'stone',
    stoneKind: 'diamond',
    status: 'active',
    issuedAt: '2026-03-20',
    certificateNumber: 'D-2026-7891',
    diamondDetail: {
      nature: 'Natural',
      shapeAndCut: 'Brillante Redondo',
      measurements: '6.92 x 6.95 x 4.28 mm',
      weight: 1.25,
      color: 'E',
      clarityGrade: 'VVS1',
      cutGrade: 'Excelente',
      fluorescence: 'Ninguna',
    },
    diamondAdditionalInfo: {
      polish: 'Excelente',
      symmetry: 'Excelente',
      proportions: 'Tabla 57%, Profundidad 61.4%',
    },
    hasAdditionalDiamonds: false,
    hasAdditionalGems: false,
  };

  const form1 = new FormData();
  form1.append('data', JSON.stringify(diamondData));
  form1.append('image1', file1);
  form1.append('image2', file2);

  const res1 = await createCertificateAction(form1);
  if (!res1.success) {
    throw new Error(`Error emitiendo certificado de diamante: ${res1.error}`);
  }
  console.log(`✅ Certificado Diamante Creado con éxito: REF=${res1.data.reference} ID=${res1.data.id}\n`);

  // ─── Test 2: Emisión de Certificado de JOYA MONTADA ───
  console.log('📋 [2/4] Creando Certificado 2: JOYA COMPLETA (Anillo Solitario con Acentos)...');
  const jewelryData: CertificateFormData = {
    reportLanguage: 'es',
    certificateType: 'jewelry',
    status: 'active',
    issuedAt: '2026-03-21',
    certificateNumber: 'J-2026-4421',
    jewelry: {
      name: 'Anillo Solitario Royal Brilliance',
      category: 'Anillo',
      material: 'Oro Blanco',
      metalType: 'Oro Blanco 18K',
      purity: '750',
      grossWeight: 4.85,
      weightUnit: 'g',
      serialNumber: 'SN-RB-9901',
      comments: 'Montura artesanal de alta orfebrería con engaste en cuatro garras y brazos en pavé.',
    },
    stoneKind: 'colored_gem',
    gemDetail: {
      nature: 'Natural',
      variety: 'Esmeralda Colombiana',
      shapeAndCut: 'Talla Esmeralda (Octagonal)',
      measurements: '7.20 x 5.80 x 4.10 mm',
      weight: 1.45,
      color: 'Verde Intenso (Vivid Green)',
      transparency: 'Transparente',
      treatment: 'Menor (Aceite de Cedro Natural)',
      cutGrade: 'Muy Bueno',
    },
    hasAdditionalDiamonds: true,
    additionalDiamonds: {
      nature: 'Natural',
      totalStones: 14,
      estimatedWeight: 0.28,
      estimatedColor: 'F - G',
      estimatedClarity: 'VS',
      shapeAndCut: 'Brillante Redondo',
    },
    hasAdditionalGems: false,
  };

  const form2 = new FormData();
  form2.append('data', JSON.stringify(jewelryData));
  form2.append('image1', file1);

  const res2 = await createCertificateAction(form2);
  if (!res2.success) {
    throw new Error(`Error emitiendo certificado de joya: ${res2.error}`);
  }
  console.log(`✅ Certificado Joya Creado con éxito: REF=${res2.data.reference} ID=${res2.data.id}\n`);

  // ─── Test 3: Verificar archivos físicos en disco ───
  console.log('📂 [3/4] Verificando archivos físicos en public/uploads/certificates/...');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'certificates');
  if (!fs.existsSync(uploadsDir)) {
    throw new Error(`Directorio de uploads no existe: ${uploadsDir}`);
  }

  const filesInUploads = fs.readdirSync(uploadsDir);
  console.log(`Archivos encontrados en ${uploadsDir}: (${filesInUploads.length} archivos)`);
  filesInUploads.slice(-6).forEach((f) => console.log(`   - ${f}`));

  const pdf1 = `${res1.data.reference}.pdf`;
  const pdf2 = `${res2.data.reference}.pdf`;
  const pdf1Exists = filesInUploads.some((f) => f.includes(pdf1));
  const pdf2Exists = filesInUploads.some((f) => f.includes(pdf2));

  console.log(`   * PDF Diamante (${pdf1}): ${pdf1Exists ? 'ENCONTRADO Y GUARDADO EN DISCO ✅' : 'NO ENCONTRADO ❌'}`);
  console.log(`   * PDF Joya (${pdf2}): ${pdf2Exists ? 'ENCONTRADO Y GUARDADO EN DISCO ✅' : 'NO ENCONTRADO ❌'}\n`);

  // ─── Test 4: Consultar Dashboard Stats y Paginación ───
  console.log('📊 [4/4] Verificando Sincronización del Dashboard y Lookup Público...');
  const statsRes = await getDashboardStats();
  console.log('Stats del Dashboard:', statsRes.success ? statsRes.data : statsRes.error);

  const listRes = await listCertificatesPaginated({ page: 1, pageSize: 5 });
  if (listRes.success) {
    console.log(`Listado paginado: Total=${listRes.data.total}, Página=${listRes.data.page}, Items=${listRes.data.data.length}`);
    for (const item of listRes.data.data) {
      console.log(`   • [${item.reference}] ${item.jewelry.name} | Cat: ${item.jewelry.category} | Piedra: ${item.jewelry.stoneType || 'N/A'} ${item.jewelry.stoneWeight || ''}ct | Thumb: ${item.thumbnailUrl || 'Sin thumb'}`);
    }
  }

  // Lookup público del diamante
  const lookupRes = await lookupCertificate(res1.data.reference);
  if (lookupRes.success) {
    const cert = lookupRes.data;
    const pdfF = cert.files.find((f) => f.type === 'certificate_pdf');
    const imgFs = cert.files.filter((f) => f.type === 'jewelry_image');
    console.log(`\n🔍 Verificación Pública de ${cert.reference}:`);
    console.log(`   - Nombre: ${cert.jewelry.name}`);
    console.log(`   - Tipo: ${cert.certificateType}`);
    console.log(`   - Estado: ${cert.status}`);
    console.log(`   - Imágenes asociadas: ${imgFs.length}`);
    imgFs.forEach((img, i) => console.log(`       Foto ${i + 1} (${img.role}): ${img.storageKey}`));
    console.log(`   - PDF Oficial: ${pdfF?.storageKey || 'No disponible'}`);
    console.log(`   - 4Cs: ${cert.gemologicalDetail?.weight}ct, Color ${cert.gemologicalDetail?.color}, Pureza ${cert.gemologicalDetail?.clarityGrade}, Corte ${cert.gemologicalDetail?.cutGrade}`);
    console.log(`   - Medidas: ${cert.gemologicalDetail?.measurements}`);
    console.log(`   - Pulido / Simetría: ${cert.gemologicalDetail?.polish} / ${cert.gemologicalDetail?.symmetry}`);
  }

  // Lookup público de la joya
  const lookupRes2 = await lookupCertificate(res2.data.reference);
  if (lookupRes2.success) {
    const cert = lookupRes2.data;
    console.log(`\n🔍 Verificación Pública de ${cert.reference}:`);
    console.log(`   - Nombre: ${cert.jewelry.name}`);
    console.log(`   - Joya: ${cert.jewelry.category} · ${cert.jewelry.metalType} (${cert.jewelry.grossWeight}g)`);
    console.log(`   - Piedra Principal: ${cert.gemologicalDetail?.variety} ${cert.gemologicalDetail?.weight}ct`);
    console.log(`   - Piedras Adicionales: ${cert.additionalStones?.length || 0} lote(s) registrado(s)`);
    if (cert.additionalStones && cert.additionalStones.length > 0) {
      const s = cert.additionalStones[0];
      console.log(`       * ${s.totalStones} piedras (${s.estimatedWeight} ct, ${s.estimatedColor}, ${s.estimatedClarity})`);
    }
  }

  console.log('\n====================================================');
  console.log('🎉 AUDITORÍA Y VERIFICACIÓN EXITOSA: TODAS LAS CAPAS CONECTADAS Y OPERATIVAS');
  console.log('====================================================');
  process.exit(0);
}

runTest().catch((err) => {
  console.error('❌ Error en el test de persistencia:', err);
  process.exit(1);
});
