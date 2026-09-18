/**
 * Script to generate demo PDF certificates.
 * Run with: node scripts/generate-demo-pdfs.mjs
 * 
 * Creates simple text-based PDF files marked as "DOCUMENTO DEMO — SIN VALIDEZ"
 */

const certificates = [
  { ref: 'FYN-26-000001', name: 'Anillo de Compromiso con Diamante', material: 'Oro 18K', stone: 'Diamante 0.35ct G/VS1' },
  { ref: 'FYN-26-000002', name: 'Cadena Eslabón Cubano', material: 'Oro 24K', stone: 'N/A' },
  { ref: 'FYN-26-000003', name: 'Pulsera Esmeralda Colombiana', material: 'Platino 950', stone: 'Esmeralda 1.2ct' },
  { ref: 'FYN-26-000004', name: 'Aretes Zafiro Azul', material: 'Oro 18K', stone: 'Zafiro 0.8ct' },
  { ref: 'FYN-26-000005', name: 'Anillo Solitario con Rubí', material: 'Oro Blanco 14K', stone: 'Rubí 0.5ct' },
  { ref: 'FYN-26-000006', name: 'Cadena Veneciana de Plata', material: 'Plata 925', stone: 'N/A' },
];

import { writeFileSync } from 'fs';

for (const cert of certificates) {
  // Create a minimal valid PDF with certificate info
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

4 0 obj
<< /Length 600 >>
stream
BT
/F1 10 Tf
50 750 Td
(====================================================) Tj
0 -15 Td
(        DOCUMENTO DEMO - SIN VALIDEZ) Tj
0 -15 Td
(====================================================) Tj
0 -30 Td
/F1 18 Tf
(FYN - Certificacion de Joyas) Tj
0 -30 Td
/F1 12 Tf
(Referencia: ${cert.ref}) Tj
0 -20 Td
(Pieza: ${cert.name}) Tj
0 -20 Td
(Material: ${cert.material}) Tj
0 -20 Td
(Piedra: ${cert.stone}) Tj
0 -30 Td
/F1 10 Tf
(Este documento es una demostracion.) Tj
0 -15 Td
(No tiene validez legal ni comercial.) Tj
0 -15 Td
(Generado automaticamente para fines de prueba.) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000296 00000 n 
0000000227 00000 n 

trailer
<< /Size 6 /Root 1 0 R >>
startxref
950
%%EOF`;

  writeFileSync(`public/demo/certificates/${cert.ref}.pdf`, content);
  console.log(`Created: ${cert.ref}.pdf`);
}

console.log('\\nAll demo PDFs generated successfully!');
