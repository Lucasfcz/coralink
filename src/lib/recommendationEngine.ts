import { Opportunity, OpportunityType } from '@/types/opportunity';
import { UserPreferences, DEFAULT_USER_PREFERENCES, STORAGE_KEYS } from '@/types/userPreferences';
import { formatSourceName } from './utils';

export interface ScoredOpportunity extends Opportunity {
  score: number;
  matchPercentage: number;
  matchReasons: string[];
}

/**
 * Lê as preferências do usuário salvas no localStorage.
 */
export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_PREFERENCES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) {
      return DEFAULT_USER_PREFERENCES;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

/**
 * Salva as preferências do usuário no localStorage e dispara evento para atualização dos componentes.
 */
export function saveUserPreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
    window.dispatchEvent(
      new CustomEvent('coralink-preferences-updated', { detail: preferences })
    );
  } catch {
    // Tratamento de cota de storage
  }
}

/**
 * Registra uma interação comportamental do usuário com determinada oportunidade,
 * incrementando a afinidade por tipos de oportunidade de forma ponderada.
 */
export function recordOpportunityInteraction(
  type: OpportunityType,
  action: 'VIEW_DETAILS' | 'CLICK_OFFICIAL' | 'SHARE'
): void {
  if (typeof window === 'undefined') return;

  const prefs = getUserPreferences();
  const currentWeights = { ...(prefs.interactionWeights || {}) };

  let points = 2;
  if (action === 'CLICK_OFFICIAL') points = 4;
  if (action === 'SHARE') points = 3;

  currentWeights[type] = (currentWeights[type] || 0) + points;

  // Limite máximo por tipo para evitar saturação excessiva
  if (currentWeights[type] > 40) {
    currentWeights[type] = 40;
  }

  const updated: UserPreferences = {
    ...prefs,
    interactionWeights: currentWeights,
    lastInteractionTimestamp: Date.now(),
  };

  saveUserPreferences(updated);
}

/**
 * Normaliza strings para comparação tolerante a acentos e pontuações
 */
function normalizeString(val: string): string {
  return val
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Calcula a pontuação individual de uma oportunidade em relação às preferências do usuário.
 */
export function calculateOpportunityScore(
  opp: Opportunity,
  prefs: UserPreferences
): { score: number; matchPercentage: number; matchReasons: string[] } {
  let score = 0;
  const matchReasons: string[] = [];

  // 1. Tipo de Oportunidade (Até 35 pontos)
  if (prefs.selectedTypes && prefs.selectedTypes.length > 0) {
    if (prefs.selectedTypes.includes(opp.type)) {
      score += 35;
      matchReasons.push('Tipo de oportunidade selecionado');
    }
  } else {
    score += 15; // Pontuação neutra caso não haja tipos estritos
  }

  // 2. Instituição e Situação Acadêmica (Até 35 pontos)
  if (prefs.notInCollege) {
    // Aluno que ainda não está na faculdade
    if (opp.type === 'GRADUATION') {
      score += 35;
      matchReasons.push('Processo seletivo / Ingresso no ensino superior');
    }
    if (opp.isForAll) {
      score += 30;
      matchReasons.push('Aberto à comunidade geral');
    }
  } else if (prefs.institution) {
    // Aluno universitário com faculdade selecionada
    const normUserInst = normalizeString(prefs.institution);
    const normOppSource = normalizeString(opp.sourceName || '');

    if (normOppSource.includes(normUserInst) || normUserInst.includes(normOppSource)) {
      score += 20;
      matchReasons.push(`Sediado na ${formatSourceName(opp.sourceName)}`);
    } else {
      score += 5; // Oportunidades interinstitucionais
    }
  }

  // 3. Cursos de Interesse e Grande Área (Até 30 pontos)
  if (prefs.targetCourses && prefs.targetCourses.length > 0) {
    const oppAudiences = opp.targetCourseAudiences || [];
    const hasExactMatch = prefs.targetCourses.some((c) => oppAudiences.includes(c));

    if (hasExactMatch) {
      score += 30;
      matchReasons.push('Compatível com seus cursos de interesse');
    }
  } else {
    score += 10;
  }

  // 4. Critérios de Atratividade e Urgência (Até 10 pontos)
  if (opp.isFree) {
    score += 5;
  }

  if (opp.registrationDeadline) {
    const [year, month, day] = opp.registrationDeadline.split('-').map(Number);
    if (year && month && day) {
      const deadline = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 5) {
        score += 5;
        matchReasons.push('Inscrições encerrando em breve');
      } else if (diffDays > 5 && diffDays <= 15) {
        score += 2;
      }
    }
  }

  // 5. Afinidade Comportamental por Cliques com Decaimento Temporal (Até 15 pontos)
  if (prefs.interactionWeights && prefs.interactionWeights[opp.type]) {
    const rawInteraction = prefs.interactionWeights[opp.type] || 0;
    let decayFactor = 1.0;

    if (prefs.lastInteractionTimestamp) {
      const daysElapsed = (Date.now() - prefs.lastInteractionTimestamp) / (1000 * 60 * 60 * 24);
      decayFactor = Math.pow(0.95, Math.min(daysElapsed, 30));
    }

    const decayedPoints = Math.min(15, Math.round(rawInteraction * decayFactor));
    if (decayedPoints > 0) {
      score += decayedPoints;
      matchReasons.push('Baseado no seu histórico de navegação');
    }
  }

  // Normalização do percentual de match para apresentação visual (entre 35% e 99%)
  const matchPercentage = Math.min(99, Math.max(35, Math.round((score / 100) * 100)));

  return {
    score,
    matchPercentage,
    matchReasons: matchReasons.slice(0, 2),
  };
}

/**
 * Ordena e pontua uma lista de oportunidades com base no perfil do usuário.
 */
export function getScoredOpportunities(
  opportunities: Opportunity[],
  prefs: UserPreferences
): ScoredOpportunity[] {
  const scored = opportunities.map((opp) => {
    const { score, matchPercentage, matchReasons } = calculateOpportunityScore(opp, prefs);
    return {
      ...opp,
      score,
      matchPercentage,
      matchReasons,
    };
  });

  return scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Desempate por mais recente (maior ID)
    return b.id - a.id;
  });
}
