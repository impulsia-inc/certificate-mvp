import { StorageService, FileUploadResult } from './storage.service';

export class LocalStorageService implements StorageService {
  async upload(file: File, path: string): Promise<FileUploadResult> {
    // In a real app, this would use Node.js fs to write to public/uploads/
    // For this MVP mock, we just generate a fake storageKey
    const filename = `${Date.now()}-${file.name}`;
    const storageKey = `/uploads/${path}/${filename}`.replace('//', '/');
    
    return {
      storageKey,
      size: file.size,
      mimeType: file.type || 'application/octet-stream'
    };
  }

  getUrl(storageKey: string): string {
    return storageKey;
  }

  async delete(storageKey: string): Promise<void> {
    // Mock delete
    console.log(`Deleted file at ${storageKey}`);
  }
}
