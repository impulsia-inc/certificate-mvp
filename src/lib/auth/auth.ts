export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthUser | null>;
  getSession(): Promise<AuthUser | null>;
  logout(): Promise<void>;
}
