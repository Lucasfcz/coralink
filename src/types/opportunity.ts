export type OpportunityType =
  | 'EVENT'
  | 'WORKSHOP'
  | 'COURSE'
  | 'GRADUATION'
  | 'HACKATHON'
  | 'COMPETITION'
  | 'INTERNSHIP'
  | 'SCHOLARSHIP'
  | 'RESEARCH'
  | 'EXCHANGE_PROGRAM'
  | 'VOLUNTEERING'
  | 'EXTENSION_PROGRAM'
  | 'INNOVATION'
  | 'NOTICE'
  | 'OTHER';

export type Modality = 'IN_PERSON' | 'ONLINE' | 'HYBRID';

export type TargetCourseAudience =
  | 'ADS'
  | 'COMPUTER_SCIENCE'
  | 'SOFTWARE_ENGINEERING'
  | 'INFORMATION_SYSTEMS'
  | 'COMPUTER_ENGINEERING'
  | 'DATA_SCIENCE'
  | 'CIVIL_ENGINEERING'
  | 'ELECTRICAL_ENGINEERING'
  | 'MECHANICAL_ENGINEERING'
  | 'PRODUCTION_ENGINEERING'
  | 'CHEMICAL_ENGINEERING'
  | 'MATHEMATICS'
  | 'STATISTICS'
  | 'PHYSICS'
  | 'CHEMISTRY'
  | 'BUSINESS_ADMINISTRATION'
  | 'ACCOUNTING'
  | 'ECONOMICS'
  | 'DESIGN'
  | 'GRAPHIC_DESIGN'
  | 'MARKETING'
  | 'ADVERTISING'
  | 'JOURNALISM'
  | 'MEDICINE'
  | 'NURSING'
  | 'PHARMACY'
  | 'PHYSICAL_THERAPY'
  | 'PSYCHOLOGY'
  | 'PHYSICAL_EDUCATION'
  | 'DENTISTRY'
  | 'BIOMEDICINE'
  | 'NUTRITION'
  | 'VETERINARY_MEDICINE'
  | 'AESTHETICS'
  | 'LAW'
  | 'PEDAGOGY'
  | 'SOCIAL_WORK'
  | 'LANGUAGE_AND_LITERATURE'
  | 'ARCHITECTURE_AND_URBANISM'
  | 'TOURISM_AND_HOSPITALITY'
  | 'GASTRONOMY'
  | 'TECHNOLOGY_STUDENTS'
  | 'ENGINEERING_STUDENTS'
  | 'EXACT_SCIENCES_STUDENTS'
  | 'HEALTH_STUDENTS'
  | 'HUMANITIES_STUDENTS'
  | 'BUSINESS_STUDENTS'
  | 'UNIVERSITY_STUDENTS';

export interface Opportunity {
  id: number;
  title: string;
  summary: string;
  type: OpportunityType;
  thematicArea: string | null;
  targetCourseAudiences: TargetCourseAudience[];
  modality: Modality;
  startDate: string | null;
  endDate: string | null;
  registrationDeadline: string | null;
  location: string | null;
  officialUrl: string;
  sourceName: string;
  imageUrl: string | null;
  isFree: boolean;
  isForAll: boolean;
  expiresAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface OpportunityFilters {
  title?: string;
  type?: OpportunityType;
  targetCourseAudience?: TargetCourseAudience;
  modality?: Modality;
  sourceName?: string;
  isFree?: boolean;
  isForAll?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
