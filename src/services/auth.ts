const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://coralink-api.onrender.com';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
  user: User;
}

export class AuthError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  /**
   * Login Social com Google OAuth2 (ID Token)
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new AuthError(
        res.status,
        errData.message || 'Falha ao autenticar com conta Google.'
      );
    }

    return (await res.json()) as AuthResponse;
  },

  /**
   * Login Local por E-mail e Senha
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new AuthError(
        res.status,
        errData.message || 'Credenciais inválidas. Verifique seu e-mail e senha.'
      );
    }

    return (await res.json()) as AuthResponse;
  },

  /**
   * Cadastro Local de Usuário
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new AuthError(
        res.status,
        errData.message || 'Falha ao registrar conta. E-mail já cadastrado ou dados inválidos.'
      );
    }

    return (await res.json()) as AuthResponse;
  },

  /**
   * Logout seguro
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch {
      // Falha silenciosa de rede no logout
    }
  },

  /**
   * Renovação de Access Token via Refresh Token Cookie
   */
  async refreshToken(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new AuthError(
        res.status,
        errData.message || 'Sessão expirada. Faça login novamente.'
      );
    }

    return (await res.json()) as AuthResponse;
  },

  /**
   * Obter perfil autenticado
   */
  async getMe(accessToken: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new AuthError(res.status, 'Sessão expirada');
    }

    return (await res.json()) as User;
  },
};
