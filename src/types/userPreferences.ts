import { OpportunityType, TargetCourseAudience } from './opportunity';

export interface UserPreferences {
  selectedTypes: OpportunityType[];
  institution: string | null;
  notInCollege: boolean;
  targetCourses: TargetCourseAudience[];
  interactionWeights: Record<string, number>;
  lastInteractionTimestamp?: number;
  hasCompletedOnboarding: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  selectedTypes: [],
  institution: null,
  notInCollege: false,
  targetCourses: [],
  interactionWeights: {},
  hasCompletedOnboarding: false,
};

export const STORAGE_KEYS = {
  PREFERENCES: 'coralink_for_you_preferences',
  HAS_ONBOARDED: 'coralink_has_completed_onboarding',
  DEFAULT_FEED_MODE: 'coralink_default_feed_mode',
} as const;
