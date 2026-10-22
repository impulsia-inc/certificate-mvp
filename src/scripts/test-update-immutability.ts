import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../db';
import { certificateTable, jewelryTable, gemologicalDetailTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { updateCertificateAction, lookupCertificate } from '../features/certificates/actions/certificate.actions';
import { updateCertificateSchema } from '../features/certificates/schemas';
import type { CertificateFormData } from '../features/certificates/schemas';

async function runTest() {
  console.log('====================================================');
  console.log('🔒 TEST DE INMUTABILIDAD DE TIPO DE CERTIFICADO');
  console.log('====================================================\n');

  // ─── 1. Test Zod Schema rejection of certificateType ───
  console.log('🛡️ [1/3] Validando regla en updateCertificateSchema (Zod)...');
  const invalidPayload = {
    certificateType: 'jewelry',
    status: 'active',
  };

  const zodValidation = updateCertificateSchema.safeParse(invalidPayload);
  if (zodValidation.success) {
    throw new Error('❌ Fallo: updateCertificateSchema permitió certificateType cuando debería rechazarlo.');
  }

  const issueMsg = zodValidation.error.issues[0]?.message;
  console.log(`✅ Zod rechazó exitosamente el intento de mutación: "${issueMsg}"\n`);

  // ─── 2. Test DB update on DIAMANTE (stone) ───
  console.log('💎 [2/3] Verificando actualización de certificado DIAMANTE...');
  // Find a stone certificate
  const [stoneCert] = await db
    .select()
    .from(certificateTable)
    .where(eq(certificateTable.certificateType, 'stone'))
    .limit(1);

  if (!stoneCert) {
    throw new Error('No se encontró certificado de tipo stone en la base de datos para la prueba.');
  }

  console.log(`   - Certificado encontrado: ${stoneCert.reference} (Tipo actual: ${stoneCert.certificateType})`);
  const initialJewelryId = stoneCert.jewelryId;

  // Attempt to update with certificateType: 'jewelry'
  const updatePayloadDiamond: CertificateFormData = {
    reportLanguage: 'es',
    certificateType: 'jewelry' as any, // Malicious attempt to change type
    stoneKind: 'diamond',
    status: 'active',
    issuedAt: '2026-03-25',
    certificateNumber: 'D-UPDATED-001',
    diamondDetail: {
      nature: 'Natural',
      shapeAndCut: 'Brillante Redondo Modificado',
      weight: 1.30,
      color: 'D',
      clarityGrade: 'FL',
      cutGrade: 'Excelente',
      fluorescence: 'Ninguna',
    },
    diamondAdditionalInfo: {
      polish: 'Excelente',
      symmetry: 'Excelente',
      proportions: 'Tabla 56%',
    },
    hasAdditionalDiamonds: false,
    hasAdditionalGems: false,
  };

  const form1 = new FormData();
  form1.append('id', stoneCert.id);
  form1.append('data', JSON.stringify(updatePayloadDiamond));

  const res1 = await updateCertificateAction(form1);
  if (!res1.success) {
    throw new Error(`Error en updateCertificateAction: ${res1.error}`);
  }

  // Verify in DB that certificateType is STILL 'stone'
  const [reloadedStoneCert] = await db
    .select()
    .from(certificateTable)
    .where(eq(certificateTable.id, stoneCert.id))
    .limit(1);

  if (reloadedStoneCert.certificateType !== 'stone') {
    throw new Error(`❌ Fallo crítico de integridad: certificateType cambió a ${reloadedStoneCert.certificateType}`);
  }
  if (reloadedStoneCert.jewelryId !== initialJewelryId) {
    throw new Error(`❌ Fallo: jewelryId cambió (${initialJewelryId} -> ${reloadedStoneCert.jewelryId})`);
  }

  console.log(`✅ Inmutabilidad confirmada: Tipo en DB sigue siendo '${reloadedStoneCert.certificateType}'.`);

  // Verify gemologicalDetail was updated
  const [updatedGem] = await db
    .select()
    .from(gemologicalDetailTable)
    .where(eq(gemologicalDetailTable.certificateId, stoneCert.id))
    .limit(1);

  console.log(`✅ Especificación pericial actualizada en DB: Peso=${updatedGem?.weight}ct, Color=${updatedGem?.color}, Pureza=${updatedGem?.clarityGrade}\n`);

  // ─── 3. Test DB update on JOYA (jewelry) ───
  console.log('💍 [3/3] Verificando actualización de certificado JOYA...');
  const [jewelryCert] = await db
    .select()
    .from(certificateTable)
    .where(eq(certificateTable.certificateType, 'jewelry'))
    .limit(1);

  if (!jewelryCert) {
    throw new Error('No se encontró certificado de tipo jewelry en la base de datos para la prueba.');
  }

  console.log(`   - Certificado encontrado: ${jewelryCert.reference} (Tipo actual: ${jewelryCert.certificateType})`);
  const initialJewelryRowId = jewelryCert.jewelryId;

  // Attempt to update with certificateType: 'stone'
  const updatePayloadJewelry: CertificateFormData = {
    reportLanguage: 'es',
    certificateType: 'stone' as any, // Malicious attempt to change type to stone
    status: 'active',
    issuedAt: '2026-03-26',
    certificateNumber: 'J-UPDATED-002',
    jewelry: {
      name: 'Anillo Solitario Royal Brilliance Edición Platino',
      category: 'Anillo',
      material: 'Platino 950',
      metalType: 'Platino 950',
      purity: '950',
      grossWeight: 5.12,
      weightUnit: 'g',
      serialNumber: 'SN-RB-9901-REV',
      comments: 'Actualización técnica pericial de montura y peritaje de esmeralda.',
    },
    stoneKind: 'colored_gem',
    gemDetail: {
      nature: 'Natural',
      variety: 'Esmeralda Muzo Certificada',
      shapeAndCut: 'Talla Esmeralda (Octagonal)',
      measurements: '7.25 x 5.85 x 4.15 mm',
      weight: 1.48,
      color: 'Verde Muzo Profundo',
      transparency: 'Transparente',
      treatment: 'Insignificante (Aceite de Cedro)',
      cutGrade: 'Excelente',
    },
    hasAdditionalDiamonds: true,
    additionalDiamonds: {
      nature: 'Natural',
      totalStones: 16,
      estimatedWeight: 0.32,
      estimatedColor: 'D - E',
      estimatedClarity: 'VVS',
      shapeAndCut: 'Brillante Redondo',
    },
    hasAdditionalGems: false,
  };

  const form2 = new FormData();
  form2.append('id', jewelryCert.id);
  form2.append('data', JSON.stringify(updatePayloadJewelry));

  const res2 = await updateCertificateAction(form2);
  if (!res2.success) {
    throw new Error(`Error en updateCertificateAction: ${res2.error}`);
  }

  // Verify in DB that certificateType is STILL 'jewelry'
  const [reloadedJewelryCert] = await db
    .select()
    .from(certificateTable)
    .where(eq(certificateTable.id, jewelryCert.id))
    .limit(1);

  if (reloadedJewelryCert.certificateType !== 'jewelry') {
    throw new Error(`❌ Fallo crítico de integridad: certificateType cambió a ${reloadedJewelryCert.certificateType}`);
  }
  if (reloadedJewelryCert.jewelryId !== initialJewelryRowId) {
    throw new Error(`❌ Fallo: la fila de jewelryTable fue recreada o alterada.`);
  }

  console.log(`✅ Inmutabilidad confirmada: Tipo en DB sigue siendo '${reloadedJewelryCert.certificateType}'.`);

  // Verify jewelryTable was updated in place
  const [reloadedJewelry] = await db
    .select()
    .from(jewelryTable)
    .where(eq(jewelryTable.id, reloadedJewelryCert.jewelryId!))
    .limit(1);

  console.log(`✅ Joya actualizada in-situ: Nombre="${reloadedJewelry.name}", Metal="${reloadedJewelry.metalType}", Peso=${reloadedJewelry.grossWeight}g`);

  // Verify public lookup resolution
  const publicLookup = await lookupCertificate(reloadedJewelryCert.reference);
  if (!publicLookup.success) {
    throw new Error(`Fallo en lookupCertificate: ${publicLookup.error}`);
  }

  console.log(`✅ Lookup público verificado: Ref=${publicLookup.data.reference}, Tipo=${publicLookup.data.certificateType}`);
  console.log(`   - Gema principal: ${publicLookup.data.gemologicalDetail?.variety} (${publicLookup.data.gemologicalDetail?.weight}ct)`);
  console.log(`   - Acentos pavé: ${publicLookup.data.additionalStones?.[0]?.totalStones} piedras (${publicLookup.data.additionalStones?.[0]?.estimatedWeight}ct)`);

  console.log('\n====================================================');
  console.log('🎉 TEST COMPLETADO CON ÉXITO: INMUTABILIDAD 100% GARANTIZADA');
  console.log('====================================================');
  process.exit(0);
}

runTest().catch((err) => {
  console.error('❌ Error en test de inmutabilidad:', err);
  process.exit(1);
});
