import { fetchApi } from './api';
import { Opportunity, PageResponse, OpportunityType, Modality, TargetCourseAudience } from '@/types/opportunity';

export interface DashboardMetricsResponse {
  totalActiveOpportunities: number;
  totalRawCollected: number;
  totalScreenedRelevant: number;
  totalScreenedIrrelevant: number;
  aiScreeningAcceptanceRate: number;
  opportunitiesByType: Record<string, number>;
  opportunitiesBySource: Record<string, number>;
  pendingUserSuggestions: number;
  failedExtractionsCount: number;
}

export type PipelineStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | 'PARTIAL';

export interface PipelineRunResponse {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  status: PipelineStatus;
  collectedCount: number;
  screeningRelevantCount: number;
  extractionRelevantCount: number;
  failuresCount: number;
  durationMs: number | null;
  errorMessage?: string | null;
}

export interface PipelineStatusResponse {
  isRunning: boolean;
  lastRunStartedAt: string | null;
  lastRunFinishedAt: string | null;
  nextRunEstimatedAt: string | null;
  secondsUntilNextRun: number | null;
  formattedTimeRemaining: string | null;
  lastRun: PipelineRunResponse | null;
}

export interface RawOpportunityResponse {
  id: number;
  title: string;
  newsUrl: string;
  sourceName: string;
  screenedRelevant: boolean | null;
  becameOpportunity: boolean | null;
  foundAt: string;
  pipelineRunId: number;
  extractionAttempts?: number;
  lastExtractionError?: string | null;
}

export interface AdminOpportunityUpdateRequest {
  title: string;
  summary: string;
  type: OpportunityType;
  thematicArea?: string | null;
  modality: Modality;
  startDate?: string | null;
  endDate?: string | null;
  registrationDeadline?: string | null;
  location?: string | null;
  officialUrl: string;
  imageUrl?: string | null;
  isFree: boolean;
  isForAll: boolean;
  targetCourseAudiences: TargetCourseAudience[];
  expiresAt: string;
}

export type SuggestionType = 'BUG' | 'NEW_SOURCE' | 'SUGGESTION';

export interface UserHelpResponse {
  id: number;
  type: SuggestionType;
  suggestion: string;
  userEmail: string;
  createdAt: string;
}

export const adminService = {
  /**
   * Obtém métricas e indicadores do painel administrativo
   */
  async getDashboardMetrics(): Promise<DashboardMetricsResponse> {
    return fetchApi<DashboardMetricsResponse>('/admin/dashboard/metrics');
  },

  /**
   * Obtém status em tempo real da esteira de scraping e IA
   */
  async getPipelineStatus(): Promise<PipelineStatusResponse> {
    return fetchApi<PipelineStatusResponse>('/admin/pipeline/status');
  },

  /**
   * Dispara a execução assíncrona da esteira em segundo plano
   */
  async triggerPipeline(): Promise<{ status: string; message: string }> {
    return fetchApi<{ status: string; message: string }>('/admin/pipeline/trigger', {
      method: 'POST',
    });
  },

  /**
   * Lista histórico de execuções paginadas da pipeline
   */
  async getPipelineRuns(page = 0, size = 10): Promise<PageResponse<PipelineRunResponse>> {
    return fetchApi<PageResponse<PipelineRunResponse>>(`/admin/pipeline/runs?page=${page}&size=${size}&sort=id,desc`);
  },

  /**
   * Lista as matérias brutas capturadas em uma rodada específica
   */
  async getPipelineRunItems(runId: number, page = 0, size = 20): Promise<PageResponse<RawOpportunityResponse>> {
    return fetchApi<PageResponse<RawOpportunityResponse>>(`/admin/pipeline/runs/${runId}/items?page=${page}&size=${size}`);
  },

  /**
   * Lista matérias brutas que falharam na extração por IA após 3 tentativas
   */
  async getFailedExtractions(page = 0, size = 15): Promise<PageResponse<RawOpportunityResponse>> {
    return fetchApi<PageResponse<RawOpportunityResponse>>(`/admin/pipeline/failed-extractions?page=${page}&size=${size}`);
  },

  /**
   * Atualização administrativa completa dos campos de uma oportunidade
   */
  async updateOpportunity(id: number, data: AdminOpportunityUpdateRequest): Promise<Opportunity> {
    return fetchApi<Opportunity>(`/admin/opportunities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Executa soft delete expirando a oportunidade para ontem (oculta do feed público)
   */
  async softDeleteOpportunity(id: number): Promise<void> {
    return fetchApi<void>(`/admin/opportunities/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Lista todas as sugestões enviadas por estudantes
   */
  async getUserSuggestions(page = 0, size = 15, type?: SuggestionType): Promise<PageResponse<UserHelpResponse>> {
    const endpoint = type
      ? `/suggestion/${type}?page=${page}&size=${size}`
      : `/suggestion?page=${page}&size=${size}`;
    return fetchApi<PageResponse<UserHelpResponse>>(endpoint);
  },
};
