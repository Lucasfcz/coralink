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

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      next: { revalidate: 120 }, // 2 minutos de cache ISR no Next.js
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Erro na requisição para ${endpoint}: ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Falha de conexão com a Coralink-API: ${(error as Error).message}`);
  }
}
