import { OpportunityType, TargetCourseAudience } from './opportunity';

export interface UserPreferences {
  userId?: string;
  selectedTypes: OpportunityType[];
  institutions: string[];
  institution?: string | null;
  notInCollege: boolean;
  targetCourses: TargetCourseAudience[];
  interactionWeights: Record<string, number>;
  lastInteractionTimestamp?: number;
  hasCompletedOnboarding: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  selectedTypes: [],
  institutions: [],
  institution: null,
  notInCollege: false,
  targetCourses: [],
  interactionWeights: {},
  hasCompletedOnboarding: false,
};

export const STORAGE_KEYS = {
  PREFERENCES_PREFIX: 'coralink_preferences_',
  LEGACY_PREFERENCES: 'coralink_for_you_preferences',
  HAS_ONBOARDED_PREFIX: 'coralink_has_onboarded_',
  LEGACY_HAS_ONBOARDED: 'coralink_has_completed_onboarding',
  PREFERENCES: 'coralink_for_you_preferences',
  HAS_ONBOARDED: 'coralink_has_completed_onboarding',
} as const;
