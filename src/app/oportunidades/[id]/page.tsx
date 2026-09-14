import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getOpportunityById, getOpportunities } from '@/services/opportunities';
import { OpportunityDetailView } from '@/components/opportunity-detail/OpportunityDetailView';
import { Opportunity } from '@/types/opportunity';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 120; // ISR a cada 2 minutos

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const opp = await getOpportunityById(Number(id));
    if (!opp) {
      return { title: 'Oportunidade não encontrada | Coralink' };
    }
    return {
      title: `${opp.title} | Coralink`,
      description: opp.summary,
      openGraph: {
        title: opp.title,
        description: opp.summary,
        images: opp.imageUrl ? [opp.imageUrl] : ['/logo.png'],
      },
    };
  } catch {
    return { title: 'Oportunidade | Coralink' };
  }
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const oppId = Number(id);

  if (isNaN(oppId)) {
    notFound();
  }

  let opportunity: Opportunity | null = null;
  let relatedOpportunities: Opportunity[] = [];

  try {
    opportunity = await getOpportunityById(oppId);

    if (!opportunity) {
      notFound();
    }

    // Buscar oportunidades relacionadas (mesmo tipo, mesma fonte ou mesma área temática)
    const listRes = await getOpportunities({ size: 20 });
    const all = listRes.content || [];

    relatedOpportunities = all
      .filter(
        (item) =>
          item.id !== oppId &&
          (item.type === opportunity!.type ||
            item.sourceName === opportunity!.sourceName ||
            item.thematicArea === opportunity!.thematicArea)
      )
      .slice(0, 3);
  } catch (error) {
    console.error(`Erro ao carregar oportunidade ${oppId}:`, error);
    notFound();
  }

  return (
    <OpportunityDetailView
      opportunity={opportunity}
      relatedOpportunities={relatedOpportunities}
    />
  );
}
