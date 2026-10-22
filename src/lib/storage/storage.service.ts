export interface FileUploadResult {
  storageKey: string;
  size: number;
  mimeType: string;
}

export interface StorageService {
  upload(file: File, folder: string): Promise<FileUploadResult>;
  uploadBuffer(buffer: Buffer, filename: string, folder: string, mimeType: string): Promise<FileUploadResult>;
  getUrl(storageKey: string): string;
  delete(storageKey: string): Promise<void>;
}
