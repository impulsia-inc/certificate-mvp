export interface FileUploadResult {
  storageKey: string;
  size: number;
  mimeType: string;
}

export interface StorageService {
  upload(file: File, path: string): Promise<FileUploadResult>;
  getUrl(storageKey: string): string;
  delete(storageKey: string): Promise<void>;
}
