import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modality, OpportunityType } from '@/types/opportunity';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString || '';
  }
}

export function formatDeadlineBadge(deadlineString: string | null | undefined): {
  label: string;
  isUrgent: boolean;
} {
  if (!deadlineString) {
    return { label: 'Inscrições Abertas', isUrgent: false };
  }

  try {
    const [year, month, day] = deadlineString.split('-').map(Number);
    const deadline = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Encerrado', isUrgent: false };
    }
    if (diffDays === 0) {
      return { label: 'Termina hoje', isUrgent: true };
    }
    if (diffDays === 1) {
      return { label: 'Termina amanhã', isUrgent: true };
    }
    if (diffDays <= 5) {
      return { label: `${diffDays} dias restantes`, isUrgent: true };
    }
    if (diffDays <= 15) {
      return { label: `Até ${day}/${month}`, isUrgent: false };
    }

    return {
      label: `Até ${formatDate(deadlineString)}`,
      isUrgent: false,
    };
  } catch {
    return { label: 'Inscrições Abertas', isUrgent: false };
  }
}

export function getOpportunityTypeLabel(type: OpportunityType): string {
  const map: Record<OpportunityType, string> = {
    EVENT: 'Evento',
    WORKSHOP: 'Workshop',
    COURSE: 'Curso',
    GRADUATION: 'Graduação',
    HACKATHON: 'Hackathon',
    COMPETITION: 'Competição',
    INTERNSHIP: 'Estágio',
    SCHOLARSHIP: 'Bolsa',
    RESEARCH: 'Pesquisa',
    EXCHANGE_PROGRAM: 'Intercâmbio',
    VOLUNTEERING: 'Voluntariado',
    OTHER: 'Oportunidade',
  };
  return map[type] || 'Oportunidade';
}

export function getModalityLabel(modality: Modality): string {
  const map: Record<Modality, string> = {
    IN_PERSON: 'Presencial',
    ONLINE: 'Online',
    HYBRID: 'Híbrido',
  };
  return map[modality] || 'Presencial';
}

/**
 * Formata o nome da fonte substituindo underscores por espaços e padronizando siglas
 * Ex: CESAR_SCHOOL -> CESAR School, CIN_UFPE -> CIn UFPE
 */
export function formatSourceName(sourceName: string | null | undefined): string {
  if (!sourceName) return '';

  const clean = sourceName.trim().toUpperCase().replace(/[\s-]+/g, '_');

  const customNames: Record<string, string> = {
    CESAR: 'CESAR',
    CESAR_SCHOOL: 'CESAR School',
    CIN_UFPE: 'CIn UFPE',
    UFPE: 'UFPE',
    IFPE: 'IFPE',
    UPE: 'UPE',
    PORTO_DIGITAL: 'Porto Digital',
    FACEPE: 'FACEPE',
    SENAC_PE: 'Senac PE',
    SYMPLA: 'Sympla',
    UNIBRA: 'UNIBRA',
    UNIFAFIRE: 'UNIFAFIRE',
    AWS_USER_GROUP_RECIFE: 'AWS User Group Recife',
    KAGGLE_DAYS: 'Kaggle Days',
    TECH_BANK: 'Tech Bank',
  };

  if (customNames[clean]) {
    return customNames[clean];
  }

  // Fallback: substitui _ por espaço
  return sourceName.replace(/_/g, ' ');
}

/**
 * Mapeia a fonte oficial para sua logomarca institucional
 */
export function getSourceLogoUrl(sourceName: string | null | undefined): string | null {
  if (!sourceName) return null;

  const clean = sourceName.trim().toUpperCase().replace(/[\s-]+/g, '_');

  const logos: Record<string, string> = {
    CESAR: '/institutions/cesar.png',
    CESAR_SCHOOL: '/institutions/cesar-school.png',
    CIN_UFPE: '/institutions/cin-ufpe.png',
    UFPE: '/institutions/ufpe.png',
    IFPE: '/institutions/ifpe.png',
    UPE: '/institutions/upe.png',
    PORTO_DIGITAL: '/institutions/porto-digital.png',
    FACEPE: '/institutions/facepe.png',
    SENAC_PE: '/institutions/senac-pe.png',
    SYMPLA: '/institutions/sympla.webp',
    UNIBRA: '/institutions/unibra.png',
    UNIFAFIRE: '/institutions/unifafire.png',
  };

  return logos[clean] || null;
}

/**
 * Tradução completa de públicos-alvo / cursos de inglês para português
 */
export function formatTargetAudience(aud: string | null | undefined): string {
  if (!aud) return '';

  const clean = aud.trim().toUpperCase();

  const map: Record<string, string> = {
    // Tecnologia
    ADS: 'Análise e Dev. de Sistemas',
    COMPUTER_SCIENCE: 'Ciência da Computação',
    SOFTWARE_ENGINEERING: 'Engenharia de Software',
    INFORMATION_SYSTEMS: 'Sistemas de Informação',
    COMPUTER_ENGINEERING: 'Engenharia da Computação',
    DATA_SCIENCE: 'Ciência de Dados',

    // Engenharias
    CIVIL_ENGINEERING: 'Engenharia Civil',
    ELECTRICAL_ENGINEERING: 'Engenharia Elétrica',
    MECHANICAL_ENGINEERING: 'Engenharia Mecânica',
    PRODUCTION_ENGINEERING: 'Engenharia de Produção',
    CHEMICAL_ENGINEERING: 'Engenharia Química',

    // Exatas
    MATHEMATICS: 'Matemática',
    STATISTICS: 'Estatística',
    PHYSICS: 'Física',
    CHEMISTRY: 'Química',

    // Negócios
    BUSINESS_ADMINISTRATION: 'Administração',
    ACCOUNTING: 'Ciências Contábeis',
    ECONOMICS: 'Economia',

    // Comunicação e Design
    DESIGN: 'Design',
    GRAPHIC_DESIGN: 'Design Gráfico',
    MARKETING: 'Marketing',
    ADVERTISING: 'Publicidade e Propaganda',
    JOURNALISM: 'Jornalismo',

    // Saúde
    MEDICINE: 'Medicina',
    NURSING: 'Enfermagem',
    PHARMACY: 'Farmácia',
    PHYSICAL_THERAPY: 'Fisioterapia',
    PSYCHOLOGY: 'Psicologia',
    PHYSICAL_EDUCATION: 'Educação Física',
    DENTISTRY: 'Odontologia',
    BIOMEDICINE: 'Biomedicina',
    NUTRITION: 'Nutrição',
    VETERINARY_MEDICINE: 'Medicina Veterinária',
    AESTHETICS: 'Estética',

    // Humanas e Sociais
    LAW: 'Direito',
    PEDAGOGY: 'Pedagogia',
    SOCIAL_WORK: 'Serviço Social',
    LANGUAGE_AND_LITERATURE: 'Letras',

    // Outras
    ARCHITECTURE_AND_URBANISM: 'Arquitetura e Urbanismo',
    TOURISM_AND_HOSPITALITY: 'Turismo e Hotelaria',
    GASTRONOMY: 'Gastronomia',

    // Categorias amplas
    TECHNOLOGY_STUDENTS: 'Estudantes de Tecnologia',
    ENGINEERING_STUDENTS: 'Estudantes de Engenharia',
    EXACT_SCIENCES_STUDENTS: 'Estudantes de Ciências Exatas',
    HEALTH_STUDENTS: 'Estudantes de Saúde',
    HUMANITIES_STUDENTS: 'Estudantes de Humanas',
    BUSINESS_STUDENTS: 'Estudantes de Negócios',
    UNIVERSITY_STUDENTS: 'Estudantes Universitários',
  };

  if (map[clean]) {
    return map[clean];
  }

  // Fallback: formata substituindo underscore
  return clean
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// Fallbacks de imagens neutras de alta qualidade
const CURATED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
];

export function getCleanImageUrl(imageUrl: string | null | undefined, id: number): string {
  if (!imageUrl || imageUrl.trim() === '' || imageUrl.endsWith('.svg')) {
    const index = Math.abs(id) % CURATED_FALLBACK_IMAGES.length;
    return CURATED_FALLBACK_IMAGES[index];
  }
  return imageUrl;
}
