import { StorageService, FileUploadResult } from './storage.service';
import fs from 'node:fs/promises';
import path from 'node:path';

export class LocalStorageService implements StorageService {
  async upload(file: File, folder: string): Promise<FileUploadResult> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return this.uploadBuffer(buffer, file.name, folder, file.type || 'application/octet-stream');
  }

  async uploadBuffer(buffer: Buffer, originalFilename: string, folder: string, mimeType: string): Promise<FileUploadResult> {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', cleanFolder);
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const storageKey = `/uploads/${cleanFolder}/${filename}`.replace(/\/+/g, '/');

    return {
      storageKey,
      size: buffer.length,
      mimeType,
    };
  }

  getUrl(storageKey: string): string {
    return storageKey;
  }

  async delete(storageKey: string): Promise<void> {
    try {
      const cleanKey = storageKey.replace(/^\/+/, '');
      const filePath = path.join(process.cwd(), 'public', cleanKey);
      await fs.unlink(filePath);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}
