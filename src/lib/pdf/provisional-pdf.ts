import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { CertificateFormData } from '@/features/certificates/schemas';

interface GenerateProvisionalPdfParams {
  reference: string;
  data: CertificateFormData;
}

export async function generateProvisionalPdf({
  reference,
  data,
}: GenerateProvisionalPdfParams): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.15, 0.24, 0.35); // #263C59
  const gold = rgb(0.69, 0.56, 0.32); // #AF9052
  const textDark = rgb(0.12, 0.12, 0.12);
  const textMuted = rgb(0.45, 0.45, 0.45);
  const lightBg = rgb(0.98, 0.98, 0.96);

  // Top header background
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: navy,
  });

  // Golden accent bar
  page.drawRectangle({
    x: 0,
    y: height - 124,
    width,
    height: 4,
    color: gold,
  });

  // Header Title
  page.drawText('F&N GEMOLOGY', {
    x: 40,
    y: height - 55,
    size: 20,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('LABORATORIO & CERTIFICACIÓN PERICIAL', {
    x: 40,
    y: height - 72,
    size: 9,
    font: fontHelvetica,
    color: gold,
  });

  page.drawText('DICTAMEN PERICIAL OFICIAL', {
    x: width - 230,
    y: height - 55,
    size: 11,
    font: fontHelveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`REF: ${reference}`, {
    x: width - 230,
    y: height - 72,
    size: 10,
    font: fontHelvetica,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Document metadata box
  page.drawRectangle({
    x: 40,
    y: height - 200,
    width: width - 80,
    height: 60,
    color: lightBg,
    borderColor: rgb(0.9, 0.9, 0.88),
    borderWidth: 1,
  });

  const isJewelry = data.certificateType === 'jewelry';
  const itemName = isJewelry 
    ? (data.jewelry?.name || 'Joya de Alta Gama')
    : (data.stoneKind === 'diamond' ? 'Diamante Natural Suelto' : (data.gemDetail?.variety || 'Gema de Color'));

  page.drawText('DESCRIPCIÓN DE LA PIEZA:', {
    x: 55,
    y: height - 165,
    size: 9,
    font: fontHelveticaBold,
    color: gold,
  });

  page.drawText(itemName.toUpperCase(), {
    x: 55,
    y: height - 182,
    size: 13,
    font: fontHelveticaBold,
    color: textDark,
  });

  page.drawText(`FECHA DE EMISIÓN: ${data.issuedAt}`, {
    x: width - 250,
    y: height - 165,
    size: 9,
    font: fontHelveticaBold,
    color: textMuted,
  });

  page.drawText(`TIPO DE REPORTE: ${isJewelry ? 'JOYA MONTADA' : 'DIAMANTE / PIEDRA SUELTA'}`, {
    x: width - 250,
    y: height - 182,
    size: 9,
    font: fontHelvetica,
    color: textMuted,
  });

  // Table header
  let currentY = height - 230;

  page.drawText('CARACTERÍSTICAS GEMOLÓGICAS PERICIALES', {
    x: 40,
    y: currentY,
    size: 11,
    font: fontHelveticaBold,
    color: navy,
  });

  currentY -= 20;

  // Key-value specs
  const specs: [string, string][] = [];

  if (isJewelry && data.jewelry) {
    if (data.jewelry.category) specs.push(['Categoría:', data.jewelry.category]);
    if (data.jewelry.metalType) specs.push(['Metal / Aleación:', data.jewelry.metalType]);
    if (data.jewelry.purity) specs.push(['Pureza:', data.jewelry.purity]);
    if (data.jewelry.grossWeight) specs.push(['Peso Bruto:', `${data.jewelry.grossWeight} ${data.jewelry.weightUnit || 'g'}`]);
    if (data.jewelry.serialNumber) specs.push(['Nº de Serie / Punzón:', data.jewelry.serialNumber]);
  }

  if (data.stoneKind === 'diamond' && data.diamondDetail) {
    specs.push(['Naturaleza:', data.diamondDetail.nature || 'Natural']);
    specs.push(['Talla y Corte:', data.diamondDetail.shapeAndCut || '—']);
    if (data.diamondDetail.weight) specs.push(['Peso en Quilates:', `${data.diamondDetail.weight} ct`]);
    if (data.diamondDetail.color) specs.push(['Grado de Color:', data.diamondDetail.color]);
    if (data.diamondDetail.clarityGrade) specs.push(['Grado de Pureza:', data.diamondDetail.clarityGrade]);
    if (data.diamondDetail.cutGrade) specs.push(['Grado de Corte:', data.diamondDetail.cutGrade]);
    if (data.diamondDetail.measurements) specs.push(['Medidas:', data.diamondDetail.measurements]);
    if (data.diamondDetail.fluorescence) specs.push(['Fluorescencia:', data.diamondDetail.fluorescence]);
    if (data.diamondAdditionalInfo?.polish) specs.push(['Pulido:', data.diamondAdditionalInfo.polish]);
    if (data.diamondAdditionalInfo?.symmetry) specs.push(['Simetría:', data.diamondAdditionalInfo.symmetry]);
    if (data.diamondAdditionalInfo?.proportions) specs.push(['Proporciones:', data.diamondAdditionalInfo.proportions]);
  } else if (data.gemDetail) {
    specs.push(['Naturaleza:', data.gemDetail.nature || 'Natural']);
    specs.push(['Variedad Mineral:', data.gemDetail.variety || '—']);
    specs.push(['Talla y Corte:', data.gemDetail.shapeAndCut || '—']);
    if (data.gemDetail.weight) specs.push(['Peso en Quilates:', `${data.gemDetail.weight} ct`]);
    if (data.gemDetail.color) specs.push(['Color / Tono:', data.gemDetail.color]);
    if (data.gemDetail.transparency) specs.push(['Transparencia:', data.gemDetail.transparency]);
    if (data.gemDetail.measurements) specs.push(['Medidas:', data.gemDetail.measurements]);
    if (data.gemDetail.treatment) specs.push(['Tratamiento:', data.gemDetail.treatment]);
  }

  if (data.hasAdditionalDiamonds && data.additionalDiamonds) {
    specs.push([
      'Diamantes Adicionales:',
      `${data.additionalDiamonds.totalStones || '—'} piedras (${data.additionalDiamonds.estimatedWeight || '—'} ct)`,
    ]);
  }

  if (data.hasAdditionalGems && data.additionalGems) {
    specs.push([
      'Gemas Adicionales:',
      `${data.additionalGems.totalStones || '—'} piedras · ${data.additionalGems.variety || 'Gema'} (${data.additionalGems.estimatedWeight || '—'} ct)`,
    ]);
  }

  for (let i = 0; i < specs.length; i++) {
    const [label, value] = specs[i];
    const isOdd = i % 2 === 1;

    page.drawRectangle({
      x: 40,
      y: currentY - 14,
      width: width - 80,
      height: 20,
      color: isOdd ? rgb(0.97, 0.97, 0.95) : rgb(1, 1, 1),
    });

    page.drawText(label, {
      x: 55,
      y: currentY - 9,
      size: 9,
      font: fontHelveticaBold,
      color: textMuted,
    });

    page.drawText(value, {
      x: 220,
      y: currentY - 9,
      size: 9,
      font: fontHelvetica,
      color: textDark,
    });

    currentY -= 22;
  }

  // Legal and custody seal section
  currentY -= 30;

  page.drawRectangle({
    x: 40,
    y: currentY - 60,
    width: width - 80,
    height: 70,
    color: rgb(0.96, 0.97, 0.98),
    borderColor: navy,
    borderWidth: 0.5,
  });

  page.drawText('PROTOCOLO DE SEGURIDAD Y CUSTODIA TÉCNICA', {
    x: 55,
    y: currentY - 10,
    size: 8,
    font: fontHelveticaBold,
    color: navy,
  });

  page.drawText(
    'Este documento certifica que la pieza ha sido analizada bajo microscopía confocal y protocolos CIBJO / ISO 17025.',
    {
      x: 55,
      y: currentY - 24,
      size: 8,
      font: fontHelvetica,
      color: textDark,
    }
  );

  page.drawText(
    'El dictamen es inmutable y se encuentra legalmente indexado en el registro permanente de F&N Gemology.',
    {
      x: 55,
      y: currentY - 36,
      size: 8,
      font: fontHelvetica,
      color: textMuted,
    }
  );

  page.drawText(
    `Identificador de Trazabilidad: ${reference} · Valide este documento en https://dennisjoyeros.com/verificar/${reference}`,
    {
      x: 55,
      y: currentY - 50,
      size: 7.5,
      font: fontHelveticaBold,
      color: gold,
    }
  );

  // Footer bar
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 35,
    color: navy,
  });

  page.drawText('F&N GEMOLOGY — SEDE PRINCIPAL: CALLE 25 NORTE # 5N - 43 CALI, COLOMBIA · TEL: (602) 661-0964', {
    x: 40,
    y: 13,
    size: 7,
    font: fontHelvetica,
    color: rgb(0.8, 0.8, 0.8),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
