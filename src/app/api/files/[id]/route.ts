import { NextRequest, NextResponse } from 'next/server';
import { mockCertificateFiles } from '@/data/mock/certificates';
import fs from 'fs';
import path from 'path';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const file = mockCertificateFiles.find((f) => f.id === id);

  if (!file) {
    return new NextResponse('Archivo no encontrado', { status: 404 });
  }

  // Remove leading slash if present in storageKey
  const relativePath = file.storageKey.startsWith('/')
    ? file.storageKey.slice(1)
    : file.storageKey;

  const filePath = path.join(process.cwd(), 'public', relativePath);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Archivo físico no encontrado', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': file.mimeType,
      'Content-Disposition': `inline; filename="${file.originalName}"`,
      'Cache-Control': 'public, max-age=3600, immutable',
    },
  });
}
