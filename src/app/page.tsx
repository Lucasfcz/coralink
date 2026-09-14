import {
  getFeaturedOpportunities,
  getOpportunities,
  getOpportunitiesQuantity,
} from '@/services/opportunities';
import { CoralinkApp } from '@/components/CoralinkApp';
import { Opportunity } from '@/types/opportunity';

export const revalidate = 120; // Revalida a cada 2 minutos (ISR)

export default async function HomePage() {
  let initialFeatured: Opportunity[] = [];
  let initialOpportunities: Opportunity[] = [];
  let totalCount = 0;

  try {
    const [featuredRes, oppsRes, countRes] = await Promise.all([
      getFeaturedOpportunities(),
      getOpportunities({ page: 0, size: 9 }),
      getOpportunitiesQuantity(),
    ]);

    initialFeatured = featuredRes || [];
    initialOpportunities = oppsRes?.content || [];
    totalCount = countRes || oppsRes?.totalElements || 0;
  } catch (error) {
    console.error('Falha ao obter dados iniciais da Coralink-API:', error);
  }

  return (
    <CoralinkApp
      initialFeatured={initialFeatured}
      initialOpportunities={initialOpportunities}
      totalCount={totalCount}
    />
  );
}
