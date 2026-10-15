import { getApiBaseUrl } from './api';

export type SuggestionType = 'FEATURE' | 'BUG' | 'OPINION' | 'OTHER' | 'NEW_SOURCE' | 'CORRECTION';

export interface UserSuggestionRequest {
  type: SuggestionType;
  suggestion: string;
  userEmail?: string;
}

export interface UserSuggestionResponse {
  id: number;
  type: SuggestionType;
  suggestion: string;
  userEmail?: string;
  createdAt: string;
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
export async function createUserSuggestion(
  data: UserSuggestionRequest,
  accessToken?: string | null
): Promise<UserSuggestionResponse> {
  if (!accessToken) {
    throw new SuggestionError(
      401,
      'É necessário estar autenticado para enviar uma sugestão.'
    );
  }

  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/suggestion/create`, {
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

  return (await response.json()) as UserSuggestionResponse;
}
