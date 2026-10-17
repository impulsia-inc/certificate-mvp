import { StorageService, FileUploadResult } from './storage.service';
import fs from 'node:fs/promises';
import path from 'node:path';

export class LocalStorageService implements StorageService {
  async upload(file: File, folder: string): Promise<FileUploadResult> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', cleanFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const storageKey = `/uploads/${cleanFolder}/${filename}`.replace(/\/+/g, '/');

    return {
      storageKey,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
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

