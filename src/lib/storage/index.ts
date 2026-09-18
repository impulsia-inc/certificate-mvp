import { LocalStorageService } from './local-storage.service';
import type { StorageService } from './storage.service';

export * from './storage.service';

let storageInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageInstance) {
    storageInstance = new LocalStorageService();
  }
  return storageInstance;
}
