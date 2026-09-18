'use server';

import { getAuthService } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { AuthUser } from '@/lib/auth/auth';

type AuthResult = 
  | { success: true; user: AuthUser }
  | { success: false; error: string };

export async function loginAction(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const auth = getAuthService();
    const user = await auth.login(email, password);
    
    if (!user) {
      return { success: false, error: 'Credenciales inválidas. Verifique su correo y contraseña.' };
    }
    
    return { success: true, user };
  } catch {
    return { success: false, error: 'Error al iniciar sesión. Intente nuevamente.' };
  }
}

export async function logoutAction(): Promise<void> {
  const auth = getAuthService();
  await auth.logout();
  redirect('/login');
}

export async function getSessionAction(): Promise<AuthUser | null> {
  const auth = getAuthService();
  return auth.getSession();
}
