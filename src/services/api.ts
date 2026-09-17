const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://coralink-api.onrender.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Se executado no cliente, adiciona o Bearer Token salvo na sessão caso não fornecido explicitamente
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('coralink_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const hasAuth = defaultHeaders['Authorization'] || (options.headers && 'Authorization' in options.headers);
    const shouldRevalidate = isGet && !hasAuth && !options.cache && !endpoint.startsWith('/admin');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string> | undefined),
      },
      ...(shouldRevalidate ? { next: { revalidate: 120 } } : { cache: 'no-store' }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const errorMessage = errorBody?.message || response.statusText || 'Erro inesperado';
      throw new ApiError(response.status, `Erro na requisição para ${endpoint}: ${errorMessage}`);
    }

    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Falha de conexão com a Coralink-API: ${(error as Error).message}`);
  }
}
