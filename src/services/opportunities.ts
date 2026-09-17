import { fetchApi } from './api';
import { Opportunity, OpportunityFilters, PageResponse } from '@/types/opportunity';
import { selectFeaturedOpportunities } from '@/lib/algorithms';

export async function getOpportunities(
  filters: OpportunityFilters = {}
): Promise<PageResponse<Opportunity>> {
  const params = new URLSearchParams();

  if (filters.title) params.append('title', filters.title);
  if (filters.type) params.append('type', filters.type);
  if (filters.targetCourseAudience) params.append('targetCourseAudience', filters.targetCourseAudience);
  if (filters.modality) params.append('modality', filters.modality);
  if (filters.sourceName) params.append('sourceName', filters.sourceName);
  if (filters.isFree !== undefined) params.append('isFree', String(filters.isFree));
  if (filters.isForAll !== undefined) params.append('isForAll', String(filters.isForAll));

  params.append('page', String(filters.page ?? 0));
  params.append('size', String(filters.size ?? 9));
  if (filters.sort) params.append('sort', filters.sort);

  const endpoint = `/opportunities?${params.toString()}`;
  return fetchApi<PageResponse<Opportunity>>(endpoint);
}

export async function getOpportunityById(id: number): Promise<Opportunity> {
  return fetchApi<Opportunity>(`/opportunities/${id}`);
}

export async function getFeaturedOpportunities(): Promise<Opportunity[]> {
  try {
    // Buscar uma amostra ampla de oportunidades vigentes para aplicar a curadoria inteligente
    const response = await fetchApi<PageResponse<Opportunity>>(
      '/opportunities?page=0&size=25'
    );

    if (!response.content || response.content.length === 0) {
      return [];
    }

    return selectFeaturedOpportunities(response.content, 8);
  } catch (error) {
    console.error('Erro ao carregar oportunidades em destaque:', error);
    return [];
  }
}

export async function getOpportunitiesQuantity(): Promise<number> {
  try {
    return await fetchApi<number>('/opportunities/quantity');
  } catch (error) {
    console.error('Erro ao buscar quantidade de oportunidades:', error);
    return 0;
  }
}
