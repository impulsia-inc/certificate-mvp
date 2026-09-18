import { MockAuthService } from './mock-auth';
import type { AuthService } from './auth';

export * from './auth';

let authInstance: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authInstance) {
    authInstance = new MockAuthService();
  }
  return authInstance;
}
