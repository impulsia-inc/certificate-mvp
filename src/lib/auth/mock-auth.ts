import { cookies } from 'next/headers';
import type { AuthService, AuthUser } from './auth';

const SESSION_COOKIE = 'fyn_session';

export class MockAuthService implements AuthService {
  async login(email: string, password: string): Promise<AuthUser | null> {
    const cleanEmail = email.trim().toLowerCase();

    // En modo local / MVP: Permitimos acceso flexible con cualquier correo administrativo o credencial demo
    const isAllowedEmail =
      cleanEmail === 'admin@fyn-demo.com' ||
      cleanEmail === 'admin@fyn.com' ||
      cleanEmail.startsWith('admin');

    if (isAllowedEmail && password && password.trim().length > 0) {
      const user: AuthUser = {
        id: 'admin-1',
        email: cleanEmail,
        name: 'Administrador FYN',
        role: 'admin',
      };

      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
      });

      return user;
    }

    return null;
  }

  async getSession(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (sessionCookie && sessionCookie.value === 'admin-1') {
      return {
        id: 'admin-1',
        email: 'admin@fyn-demo.com',
        name: 'Administrador FYN',
        role: 'admin',
      };
    }

    return null;
  }

  async logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
  }
}
