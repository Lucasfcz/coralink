const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://coralink-api.onrender.com';

export type SuggestionType = 'FEATURE' | 'BUG' | 'OPINION' | 'OTHER';

export interface UserHelpRequest {
  type: SuggestionType;
  suggestion: string;
  userEmail?: string;
}

export interface UserHelpResponse {
  id: number;
  type: SuggestionType;
  suggestion: string;
  userEmail?: string;
}

export class SuggestionError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'SuggestionError';
  }
}

/**
 * Envia uma sugestão ou reporte de bug à API.
 * REQUISITO DE SEGURANÇA: Requer usuário autenticado (Access Token obrigatório).
 */
export async function createUserHelp(
  data: UserHelpRequest,
  accessToken?: string | null
): Promise<UserHelpResponse> {
  if (!accessToken) {
    throw new SuggestionError(
      401,
      'É necessário estar autenticado para enviar uma sugestão.'
    );
  }

  const response = await fetch(`${API_BASE_URL}/suggestion/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new SuggestionError(
      response.status,
      errorData.message ||
        `Erro ao enviar sugestão (${response.status}): ${response.statusText}`
    );
  }

  return (await response.json()) as UserHelpResponse;
}
