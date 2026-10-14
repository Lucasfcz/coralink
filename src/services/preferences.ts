import { getApiBaseUrl } from './api';
import { OpportunityType, TargetCourseAudience } from '@/types/opportunity';

export interface UserPreferencesRequest {
  selectedTypes?: OpportunityType[];
  institutions?: string[];
  targetCourses?: TargetCourseAudience[];
  notInCollege?: boolean;
}

export interface UserPreferencesResponse {
  id: number;
  userId: number;
  selectedTypes: OpportunityType[];
  institutions: string[];
  targetCourses: TargetCourseAudience[];
  notInCollege: boolean;
  createdAt: string;
  updatedAt?: string;
}

export class PreferencesApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'PreferencesApiError';
  }
}

export async function getUserPreferencesApi(
  accessToken: string
): Promise<UserPreferencesResponse | null> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/preferences`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new PreferencesApiError(res.status, `Falha ao obter preferências: ${res.statusText}`);
  }

  return (await res.json()) as UserPreferencesResponse;
}

export async function saveUserPreferencesApi(
  data: UserPreferencesRequest,
  accessToken: string
): Promise<UserPreferencesResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new PreferencesApiError(
      res.status,
      errorData.message || `Falha ao salvar preferências: ${res.statusText}`
    );
  }

  return (await res.json()) as UserPreferencesResponse;
}

export async function patchUserPreferencesApi(
  data: UserPreferencesRequest,
  accessToken: string
): Promise<UserPreferencesResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/preferences`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new PreferencesApiError(
      res.status,
      errorData.message || `Falha ao atualizar preferências: ${res.statusText}`
    );
  }

  return (await res.json()) as UserPreferencesResponse;
}
