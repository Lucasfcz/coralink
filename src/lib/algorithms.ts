import { Opportunity } from '@/types/opportunity';

/**
 * Critério Híbrido Inteligente de Seleção para Oportunidades em Destaque:
 * 1. Prioriza oportunidades abertas a todos (isForAll = true)
 * 2. Pontua positivamente categorias nobres (HACKATHON, INTERNSHIP, RESEARCH, SCHOLARSHIP)
 * 3. Bonifica oportunidades com prazo de inscrição próximo e ativo
 * 4. Favorece imagens válidas com formato fotográfico
 */
export function selectFeaturedOpportunities(
  opportunities: Opportunity[],
  limit = 8
): Opportunity[] {
  if (!opportunities || opportunities.length === 0) return [];

  const scored = opportunities.map((opp) => {
    let score = 0;

    // Prioridade para abertas a todos
    if (opp.isForAll) {
      score += 25;
    }

    // Prioridade por categoria nobre
    switch (opp.type) {
      case 'HACKATHON':
        score += 35;
        break;
      case 'INTERNSHIP':
        score += 30;
        break;
      case 'SCHOLARSHIP':
      case 'RESEARCH':
        score += 25;
        break;
      case 'EVENT':
      case 'WORKSHOP':
        score += 20;
        break;
      case 'COURSE':
        score += 15;
        break;
      default:
        score += 10;
        break;
    }

    // Prioridade por prazo de inscrição ativo
    if (opp.registrationDeadline) {
      const now = new Date().getTime();
      const deadline = new Date(opp.registrationDeadline).getTime();
      const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);

      if (diffDays >= 0 && diffDays <= 30) {
        // Prazo ativo no próximo mês
        score += 30;
      }
    }

    // Bonificação por gratuidade
    if (opp.isFree) {
      score += 10;
    }

    // Bonificação por ter imagem fotográfica (não SVG/logo genérico)
    if (
      opp.imageUrl &&
      !opp.imageUrl.endsWith('.svg') &&
      !opp.imageUrl.includes('Horizontal-Vermelho')
    ) {
      score += 20;
    }

    // Localização definida (evento real mapeado)
    if (opp.location && opp.location.trim().length > 0) {
      score += 10;
    }

    return { opp, score };
  });

  // Ordenar por maior pontuação decrescente
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.opp);
}
