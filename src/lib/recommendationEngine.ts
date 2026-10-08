import { Opportunity, OpportunityType } from '@/types/opportunity';
import { UserPreferences, DEFAULT_USER_PREFERENCES, STORAGE_KEYS } from '@/types/userPreferences';
import { formatSourceName } from './utils';

export interface ScoredOpportunity extends Opportunity {
  score: number;
  matchPercentage: number;
  matchReasons: string[];
}

/**
 * Obtém a chave de armazenamento adequada com base no ID do usuário.
 */
export function getPreferencesStorageKey(userId?: string | null): string {
  if (userId) {
    return `${STORAGE_KEYS.PREFERENCES_PREFIX}${userId}`;
  }
  return STORAGE_KEYS.LEGACY_PREFERENCES;
}

/**
 * Lê as preferências do usuário salvas no localStorage.
 * Suporta isolamento por conta de usuário autenticado ou fallback local.
 */
export function getUserPreferences(userId?: string | null): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_PREFERENCES;
  }

  try {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const storedUser = localStorage.getItem('coralink_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          effectiveUserId = parsedUser.id;
        } catch {
          // Ignora erro de JSON
        }
      }
    }

    const key = getPreferencesStorageKey(effectiveUserId);
    let raw = localStorage.getItem(key);

    if (!raw && effectiveUserId) {
      raw = localStorage.getItem(STORAGE_KEYS.LEGACY_PREFERENCES);
    }

    if (!raw) {
      return DEFAULT_USER_PREFERENCES;
    }

    const parsed = JSON.parse(raw);
    const institutions = Array.isArray(parsed.institutions)
      ? parsed.institutions
      : (parsed.institution ? [parsed.institution] : []);

    return {
      ...DEFAULT_USER_PREFERENCES,
      ...parsed,
      institutions,
    };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

/**
 * Salva as preferências do usuário no localStorage vinculadas à sua conta
 * e dispara evento global para sincronização dos componentes.
 */
export function saveUserPreferences(preferences: UserPreferences, userId?: string | null): void {
  if (typeof window === 'undefined') return;

  try {
    let effectiveUserId = userId || preferences.userId;
    if (!effectiveUserId) {
      const storedUser = localStorage.getItem('coralink_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          effectiveUserId = parsedUser.id;
        } catch {
          // Ignora erro
        }
      }
    }

    const key = getPreferencesStorageKey(effectiveUserId);
    const dataToSave: UserPreferences = {
      ...preferences,
      userId: effectiveUserId || undefined,
      hasCompletedOnboarding: true,
    };

    localStorage.setItem(key, JSON.stringify(dataToSave));
    localStorage.setItem(STORAGE_KEYS.LEGACY_PREFERENCES, JSON.stringify(dataToSave));

    if (effectiveUserId) {
      localStorage.setItem(`${STORAGE_KEYS.HAS_ONBOARDED_PREFIX}${effectiveUserId}`, 'true');
    }
    localStorage.setItem(STORAGE_KEYS.LEGACY_HAS_ONBOARDED, 'true');

    window.dispatchEvent(
      new CustomEvent('coralink-preferences-updated', { detail: dataToSave })
    );
  } catch {
    // Tratamento de cota de storage
  }
}

/**
 * Verifica se o usuário já completou suas preferências.
 */
export function hasUserCompletedPreferences(userId?: string | null): boolean {
  if (typeof window === 'undefined') return false;

  try {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const storedUser = localStorage.getItem('coralink_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          effectiveUserId = parsedUser.id;
        } catch {}
      }
    }

    if (effectiveUserId) {
      const onboardedKey = `${STORAGE_KEYS.HAS_ONBOARDED_PREFIX}${effectiveUserId}`;
      if (localStorage.getItem(onboardedKey) === 'true') {
        return true;
      }
      const prefKey = `${STORAGE_KEYS.PREFERENCES_PREFIX}${effectiveUserId}`;
      const raw = localStorage.getItem(prefKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.hasCompletedOnboarding) return true;
      }
    }

    return localStorage.getItem(STORAGE_KEYS.LEGACY_HAS_ONBOARDED) === 'true';
  } catch {
    return false;
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
 * Calcula a pontuação de relevância de uma oportunidade com base nas preferências do usuário.
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
    score += 15;
  }

  // 2. Instituição e Situação Acadêmica (Até 35 pontos)
  if (prefs.notInCollege) {
    if (opp.type === 'GRADUATION') {
      score += 35;
      matchReasons.push('Processo seletivo / Ingresso no ensino superior');
    }
    if (opp.isForAll) {
      score += 30;
      matchReasons.push('Aberto à comunidade geral');
    }
  } else {
    const selectedInsts = prefs.institutions && prefs.institutions.length > 0
      ? prefs.institutions
      : (prefs.institution ? [prefs.institution] : []);

    if (selectedInsts.length > 0) {
      const normOppSource = normalizeString(opp.sourceName || '');
      const hasMatch = selectedInsts.some((inst) => {
        const normUserInst = normalizeString(inst);
        return normOppSource.includes(normUserInst) || normUserInst.includes(normOppSource);
      });

      if (hasMatch) {
        score += 25;
        matchReasons.push(`Sediado na ${formatSourceName(opp.sourceName)}`);
      } else {
        score += 5;
      }
    } else {
      score += 15;
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

  // 4. Critérios de Gratuidade e Urgência (Até 10 pontos)
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

  // 5. Afinidade Comportamental por Cliques (Até 15 pontos)
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

  const matchPercentage = Math.min(99, Math.max(35, Math.round((score / 100) * 100)));

  return {
    score,
    matchPercentage,
    matchReasons: matchReasons.slice(0, 2),
  };
}

/**
 * Ordena oportunidades com base no perfil do usuário de forma orgânica e sutil.
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
    return b.id - a.id;
  });
}
