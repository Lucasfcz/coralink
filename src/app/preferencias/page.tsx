'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Search,
  Compass,
  CheckCheck,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';
import { OpportunityType, TargetCourseAudience } from '@/types/opportunity';
import { UserPreferences } from '@/types/userPreferences';
import { getUserPreferences, saveUserPreferences } from '@/lib/recommendationEngine';
import { InstitutionLogo } from '@/components/common/InstitutionLogo';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

interface OpportunityTypeCard {
  type: OpportunityType;
  label: string;
  description: string;
}

const OPPORTUNITY_TYPE_CARDS: OpportunityTypeCard[] = [
  {
    type: 'INTERNSHIP',
    label: 'Estágios & Trainee',
    description: 'Vagas no mercado corporativo, indústria e startups',
  },
  {
    type: 'SCHOLARSHIP',
    label: 'Bolsas de Estudo & Auxílios',
    description: 'Apoio financeiro governamental e institucional',
  },
  {
    type: 'HACKATHON',
    label: 'Hackathons & Maratonas',
    description: 'Competições de ideação, design e tecnologia',
  },
  {
    type: 'RESEARCH',
    label: 'Iniciação Científica & Pesquisa',
    description: 'Editais PIBIC, PIBITI, laboratórios e publicações',
  },
  {
    type: 'COURSE',
    label: 'Cursos & Certificações',
    description: 'Formações acadêmicas e técnicas certificadas',
  },
  {
    type: 'WORKSHOP',
    label: 'Workshops & Oficinas',
    description: 'Treinamentos práticos intensivos de curta duração',
  },
  {
    type: 'EVENT',
    label: 'Eventos & Congressos',
    description: 'Simpósios, conferências, fóruns e palestras',
  },
  {
    type: 'INNOVATION',
    label: 'Inovação & Startups',
    description: 'Incubadoras, programas de aceleração e ideação',
  },
  {
    type: 'EXCHANGE_PROGRAM',
    label: 'Intercâmbio & Mobilidade',
    description: 'Bolsas internacionais e cooperação entre instituições',
  },
  {
    type: 'VOLUNTEERING',
    label: 'Voluntariado & Extensão',
    description: 'Projetos de impacto social e iniciativas comunitárias',
  },
  {
    type: 'GRADUATION',
    label: 'Vestibulares & Graduação',
    description: 'Processos seletivos, transferências e editais de ingresso',
  },
];

interface InstitutionCardData {
  id: string;
  name: string;
  acronym: string;
  badge: string;
}

const INSTITUTION_CARDS: InstitutionCardData[] = [
  {
    id: 'UFPE',
    name: 'Universidade Federal de Pernambuco',
    acronym: 'UFPE',
    badge: 'Federal',
  },
  {
    id: 'IFPE',
    name: 'Instituto Federal de Pernambuco',
    acronym: 'IFPE',
    badge: 'Federal',
  },
  {
    id: 'UPE',
    name: 'Universidade de Pernambuco',
    acronym: 'UPE',
    badge: 'Estadual',
  },
  {
    id: 'PORTO_DIGITAL',
    name: 'Parque Tecnológico Porto Digital',
    acronym: 'Porto Digital',
    badge: 'Polo Tech',
  },
  {
    id: 'CESAR_SCHOOL',
    name: 'CESAR School & Centro de Inovação',
    acronym: 'CESAR School',
    badge: 'Inovação',
  },
  {
    id: 'CIN_UFPE',
    name: 'Centro de Informática da UFPE',
    acronym: 'CIn UFPE',
    badge: 'Referência Tech',
  },
  {
    id: 'FACEPE',
    name: 'Fundação de Amparo à Ciência e Tecnologia de PE',
    acronym: 'FACEPE',
    badge: 'Fomento à Pesquisa',
  },
  {
    id: 'SENAC_PE',
    name: 'Faculdade Senac Pernambuco',
    acronym: 'Senac PE',
    badge: 'Sistema Fecomércio',
  },
  {
    id: 'UNIBRA',
    name: 'Centro Universitário Brasileiro',
    acronym: 'UNIBRA',
    badge: 'Particular',
  },
  {
    id: 'UNIFAFIRE',
    name: 'Centro Universitário Frassinetti do Recife',
    acronym: 'UNIFAFIRE',
    badge: 'Particular',
  },
  {
    id: 'UNICAP',
    name: 'Universidade Católica de Pernambuco',
    acronym: 'UNICAP',
    badge: 'Comunitária',
  },
  {
    id: 'SYMPLA',
    name: 'Sympla Eventos e Workshops Tech',
    acronym: 'Sympla PE',
    badge: 'Eventos Externos',
  },
  {
    id: 'FPS',
    name: 'Faculdade Pernambucana de Saúde',
    acronym: 'FPS',
    badge: 'Saúde',
  },
];

interface GeneralCourseOption {
  audience: TargetCourseAudience;
  label: string;
  description: string;
}

const GENERAL_COURSE_OPTIONS: GeneralCourseOption[] = [
  {
    audience: 'UNIVERSITY_STUDENTS',
    label: 'Estudantes Universitários em Geral',
    description: 'Oportunidades abertas a qualquer curso de graduação ou pós',
  },
  {
    audience: 'TECHNOLOGY_STUDENTS',
    label: 'Estudantes de Tecnologia & Computação',
    description: 'Sistemas, TI, Programação, Dados, Redes e Cibersegurança',
  },
  {
    audience: 'ENGINEERING_STUDENTS',
    label: 'Estudantes de Engenharia',
    description: 'Engenharias Civil, Mecânica, Elétrica, Produção e Química',
  },
  {
    audience: 'EXACT_SCIENCES_STUDENTS',
    label: 'Estudantes de Ciências Exatas',
    description: 'Matemática, Estatística, Física e Química Pura',
  },
  {
    audience: 'HEALTH_STUDENTS',
    label: 'Estudantes de Saúde & Biológicas',
    description: 'Medicina, Enfermagem, Farmácia, Odontologia e Fisioterapia',
  },
  {
    audience: 'BUSINESS_STUDENTS',
    label: 'Estudantes de Gestão & Negócios',
    description: 'Administração, Economia, Contabilidade, Finanças e Marketing',
  },
  {
    audience: 'HUMANITIES_STUDENTS',
    label: 'Estudantes de Humanas & Sociais',
    description: 'Direito, Letras, Pedagogia, Serviço Social e Comunicação',
  },
];

interface SpecificCourseOption {
  audience: TargetCourseAudience;
  label: string;
  category: string;
}

const SPECIFIC_COURSE_OPTIONS: SpecificCourseOption[] = [
  { audience: 'SOFTWARE_ENGINEERING', label: 'Engenharia de Software', category: 'Tecnologia' },
  { audience: 'COMPUTER_SCIENCE', label: 'Ciência da Computação', category: 'Tecnologia' },
  { audience: 'ADS', label: 'Análise e Desenv. de Sistemas (ADS)', category: 'Tecnologia' },
  { audience: 'INFORMATION_SYSTEMS', label: 'Sistemas de Informação', category: 'Tecnologia' },
  { audience: 'COMPUTER_ENGINEERING', label: 'Engenharia da Computação', category: 'Tecnologia' },
  { audience: 'DATA_SCIENCE', label: 'Ciência de Dados & IA', category: 'Tecnologia' },
  { audience: 'BUSINESS_ADMINISTRATION', label: 'Administração', category: 'Negócios' },
  { audience: 'ACCOUNTING', label: 'Ciências Contábeis', category: 'Negócios' },
  { audience: 'ECONOMICS', label: 'Economia', category: 'Negócios' },
  { audience: 'MARKETING', label: 'Marketing', category: 'Negócios' },
  { audience: 'DESIGN', label: 'Design & UX', category: 'Comunicação' },
  { audience: 'JOURNALISM', label: 'Jornalismo', category: 'Comunicação' },
  { audience: 'ADVERTISING', label: 'Publicidade e Propaganda', category: 'Comunicação' },
  { audience: 'MEDICINE', label: 'Medicina', category: 'Saúde' },
  { audience: 'NURSING', label: 'Enfermagem', category: 'Saúde' },
  { audience: 'PHARMACY', label: 'Farmácia', category: 'Saúde' },
  { audience: 'PSYCHOLOGY', label: 'Psicologia', category: 'Saúde' },
  { audience: 'PHYSICAL_THERAPY', label: 'Fisioterapia', category: 'Saúde' },
  { audience: 'BIOMEDICINE', label: 'Biomedicina', category: 'Saúde' },
  { audience: 'NUTRITION', label: 'Nutrição', category: 'Saúde' },
  { audience: 'DENTISTRY', label: 'Odontologia', category: 'Saúde' },
  { audience: 'CIVIL_ENGINEERING', label: 'Engenharia Civil', category: 'Engenharia' },
  { audience: 'ELECTRICAL_ENGINEERING', label: 'Engenharia Elétrica', category: 'Engenharia' },
  { audience: 'MECHANICAL_ENGINEERING', label: 'Engenharia Mecânica', category: 'Engenharia' },
  { audience: 'PRODUCTION_ENGINEERING', label: 'Engenharia de Produção', category: 'Engenharia' },
  { audience: 'CHEMICAL_ENGINEERING', label: 'Engenharia Química', category: 'Engenharia' },
  { audience: 'MATHEMATICS', label: 'Matemática', category: 'Exatas' },
  { audience: 'STATISTICS', label: 'Estatística', category: 'Exatas' },
  { audience: 'PHYSICS', label: 'Física', category: 'Exatas' },
  { audience: 'LAW', label: 'Direito', category: 'Humanas' },
  { audience: 'ARCHITECTURE_AND_URBANISM', label: 'Arquitetura e Urbanismo', category: 'Humanas' },
  { audience: 'PEDAGOGY', label: 'Pedagogia', category: 'Humanas' },
  { audience: 'SOCIAL_WORK', label: 'Serviço Social', category: 'Humanas' },
];

function PreferenciasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isOnboarding = searchParams.get('onboarding') === 'true';
  const rawRedirect = searchParams.get('redirect') || '/';
  const safeRedirect =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [notInCollege, setNotInCollege] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<TargetCourseAudience[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Hidratar preferências da conta do usuário ou armazenamento local
  useEffect(() => {
    queueMicrotask(() => {
      const prefs = getUserPreferences(user?.id);
      setSelectedTypes(prefs.selectedTypes || []);
      const insts = Array.isArray(prefs.institutions)
        ? prefs.institutions
        : (prefs.institution ? [prefs.institution] : []);
      setSelectedInstitutions(insts);
      setNotInCollege(Boolean(prefs.notInCollege));
      setSelectedCourses(prefs.targetCourses || []);
    });
  }, [user]);

  const toggleType = (t: OpportunityType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleInstitution = (id: string) => {
    setNotInCollege(false);
    setSelectedInstitutions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllInstitutions = () => {
    setNotInCollege(false);
    if (selectedInstitutions.length === INSTITUTION_CARDS.length) {
      setSelectedInstitutions([]);
    } else {
      setSelectedInstitutions(INSTITUTION_CARDS.map((i) => i.id));
    }
  };

  const handleSelectNotInCollege = () => {
    setNotInCollege(!notInCollege);
    if (!notInCollege) {
      setSelectedInstitutions([]);
    }
  };

  const toggleCourse = (c: TargetCourseAudience) => {
    setSelectedCourses((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const filteredSpecificCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return SPECIFIC_COURSE_OPTIONS;
    return SPECIFIC_COURSE_OPTIONS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [courseSearch]);

  const handleSavePreferences = () => {
    const existing = getUserPreferences(user?.id);
    const updated: UserPreferences = {
      ...existing,
      userId: user?.id,
      selectedTypes,
      institutions: selectedInstitutions,
      institution: selectedInstitutions[0] || null,
      notInCollege,
      targetCourses: selectedCourses,
      hasCompletedOnboarding: true,
    };

    saveUserPreferences(updated, user?.id);
    setIsSaved(true);

    setTimeout(() => {
      router.push(safeRedirect);
    }, 450);
  };

  const handleSkip = () => {
    if (user?.id) {
      const existing = getUserPreferences(user.id);
      saveUserPreferences({ ...existing, hasCompletedOnboarding: true }, user.id);
    }
    router.push(safeRedirect);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#121417] dark:bg-[#0a0b0d] dark:text-[#f3f4f6] transition-colors duration-200">
      {/* 1. Header Fixo e Minimalista */}
      <header className="sticky top-0 z-30 w-full border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md transition-colors dark:border-[#242831] dark:bg-[#0a0b0d]/90">
        <div className="mx-auto flex h-18 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-8 w-8 items-center justify-center">
              <Image
                src="/coralink-logo.png"
                alt="Coralink Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain dark:invert"
                priority
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#121417] dark:text-white">
              CORALINK
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#121417] transition-all hover:scale-105 dark:border-[#242831] dark:bg-[#15181e] dark:text-white"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-emerald-400" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-semibold text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors px-3 py-1.5"
            >
              Pular por enquanto
            </button>
          </div>
        </div>

        {/* Linha de Progresso do Stepper */}
        <div className="h-1 w-full bg-[#f1f3f6] dark:bg-[#1f232b]">
          <motion.div
            className="h-full bg-[#121417] dark:bg-white"
            initial={false}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* 2. Container Central */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Banner de Contexto de Onboarding */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Preferências Pessoais • Etapa {step} de 3</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#121417] dark:text-white">
            {step === 1 && 'Quais oportunidades mais interessam a você?'}
            {step === 2 && 'Quais instituições e fontes você deseja acompanhar?'}
            {step === 3 && 'Quais cursos ou grandes áreas você prefere?'}
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-[#525866] dark:text-[#9aa1ad] max-w-2xl">
            {step === 1 &&
              'Selecione uma ou mais categorias. Essas preferências guiarão a distribuição de oportunidades no seu feed.'}
            {step === 2 &&
              'Acompanhe quantas instituições desejar. Usamos logomarcas oficiais para facilitar sua identificação.'}
            {step === 3 &&
              'Selecione grandes áreas ou cursos específicos. Fique à vontade para marcar múltiplas opções.'}
          </p>
        </div>

        {/* Indicador de Abas de Navegação Rápida entre Etapas */}
        <div className="mb-8 flex rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-1.5 dark:border-[#242831] dark:bg-[#15181e] max-w-md">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              step === 1
                ? 'bg-white text-[#121417] shadow-xs dark:bg-[#20242b] dark:text-white'
                : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
            }`}
          >
            1. Formatos
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              step === 2
                ? 'bg-white text-[#121417] shadow-xs dark:bg-[#20242b] dark:text-white'
                : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
            }`}
          >
            2. Instituições
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              step === 3
                ? 'bg-white text-[#121417] shadow-xs dark:bg-[#20242b] dark:text-white'
                : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
            }`}
          >
            3. Áreas & Cursos
          </button>
        </div>

        {/* 3. Conteúdo da Etapa */}
        <AnimatePresence mode="wait">
          {/* ETAPA 1: FORMATOS E TIPOS */}
          {step === 1 && (
            <motion.div
              key="step-formats"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f3f6] dark:border-[#20242b]">
                <span className="text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
                  {selectedTypes.length} formato(s) selecionado(s)
                </span>
                {selectedTypes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTypes([])}
                    className="text-xs font-semibold text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white"
                  >
                    Limpar seleção
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPPORTUNITY_TYPE_CARDS.map((item) => {
                  const isSelected = selectedTypes.includes(item.type);
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => toggleType(item.type)}
                      className={`group flex items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-[#121417] bg-[#121417] text-white shadow-sm dark:border-white dark:bg-white dark:text-[#121417]'
                          : 'border-[#e5e7eb] bg-white text-[#121417] hover:border-stone-400 hover:shadow-xs dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                      }`}
                    >
                      <div className="pr-3">
                        <span className="block text-sm font-bold tracking-tight leading-snug">
                          {item.label}
                        </span>
                        <span
                          className={`mt-1 block text-xs leading-relaxed ${
                            isSelected
                              ? 'text-white/80 dark:text-[#121417]/80'
                              : 'text-[#64748b] dark:text-[#9aa1ad]'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? 'border-transparent bg-white text-[#121417] dark:bg-[#121417] dark:text-white'
                            : 'border-[#d1d5db] bg-transparent text-transparent dark:border-[#3a4150]'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ETAPA 2: INSTITUIÇÕES COM LOGOS OFICIAIS */}
          {step === 2 && (
            <motion.div
              key="step-institutions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Opção para quem ainda não está em faculdade */}
              <button
                type="button"
                onClick={handleSelectNotInCollege}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  notInCollege
                    ? 'border-[#121417] bg-[#121417] text-white shadow-sm dark:border-white dark:bg-white dark:text-[#121417]'
                    : 'border-[#e5e7eb] bg-white text-[#121417] hover:border-stone-400 hover:shadow-xs dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      notInCollege
                        ? 'bg-white/15 text-white dark:bg-black/10 dark:text-[#121417]'
                        : 'bg-[#f1f3f6] text-[#121417] dark:bg-[#20242b] dark:text-white'
                    }`}
                  >
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold">
                      Ainda não estou em uma faculdade / Foco em editais abertos a todos
                    </span>
                    <span
                      className={`block text-xs mt-0.5 ${
                        notInCollege
                          ? 'text-white/80 dark:text-[#121417]/80'
                          : 'text-[#64748b] dark:text-[#9aa1ad]'
                      }`}
                    >
                      Priorizaremos vestibulares, editais de acesso e oportunidades de tecnologia abertas ao público
                    </span>
                  </div>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                    notInCollege
                      ? 'border-transparent bg-white text-[#121417] dark:bg-[#121417] dark:text-white'
                      : 'border-[#d1d5db] bg-transparent text-transparent dark:border-[#3a4150]'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </button>

              {/* Botões de Ação Rápida */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
                  {notInCollege
                    ? 'Opção geral selecionada'
                    : `${selectedInstitutions.length} de ${INSTITUTION_CARDS.length} fontes selecionadas`}
                </span>

                <button
                  type="button"
                  onClick={handleSelectAllInstitutions}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#121417] dark:text-white hover:underline cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>
                    {selectedInstitutions.length === INSTITUTION_CARDS.length
                      ? 'Desmarcar todas'
                      : 'Selecionar todas as instituições'}
                  </span>
                </button>
              </div>

              {/* Grid com Logos Oficiais das Instituições */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {INSTITUTION_CARDS.map((inst) => {
                  const isSelected = !notInCollege && selectedInstitutions.includes(inst.id);
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => toggleInstitution(inst.id)}
                      className={`group flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-[#121417] bg-[#121417] text-white shadow-sm dark:border-white dark:bg-white dark:text-[#121417]'
                          : 'border-[#e5e7eb] bg-white text-[#121417] hover:border-stone-400 hover:shadow-xs dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <InstitutionLogo sourceName={inst.id} size={36} className="shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="block text-xs font-bold truncate">
                              {inst.acronym}
                            </span>
                            <span
                              className={`rounded-md px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#121417]'
                                  : 'bg-[#f1f3f6] text-[#64748b] dark:bg-[#20242b] dark:text-[#9aa1ad]'
                              }`}
                            >
                              {inst.badge}
                            </span>
                          </div>
                          <span
                            className={`block text-[11px] truncate mt-0.5 ${
                              isSelected
                                ? 'text-white/80 dark:text-[#121417]/80'
                                : 'text-[#64748b] dark:text-[#9aa1ad]'
                            }`}
                          >
                            {inst.name}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? 'border-transparent bg-white text-[#121417] dark:bg-[#121417] dark:text-white'
                            : 'border-[#d1d5db] bg-transparent text-transparent dark:border-[#3a4150]'
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ETAPA 3: ÁREAS E CURSOS */}
          {step === 3 && (
            <motion.div
              key="step-courses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Grandes Áreas no Topo */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-2.5">
                  Grandes Áreas de Conhecimento
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GENERAL_COURSE_OPTIONS.map((item) => {
                    const isSelected = selectedCourses.includes(item.audience);
                    return (
                      <button
                        key={item.audience}
                        type="button"
                        onClick={() => toggleCourse(item.audience)}
                        className={`flex items-start justify-between rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-[#121417] bg-[#121417] text-white shadow-xs dark:border-white dark:bg-white dark:text-[#121417]'
                            : 'border-[#e5e7eb] bg-white text-[#121417] hover:border-stone-400 dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                        }`}
                      >
                        <div className="pr-2">
                          <span className="block text-xs font-bold leading-snug">
                            {item.label}
                          </span>
                          <span
                            className={`mt-0.5 block text-[11px] leading-snug ${
                              isSelected
                                ? 'text-white/80 dark:text-[#121417]/80'
                                : 'text-[#64748b] dark:text-[#9aa1ad]'
                            }`}
                          >
                            {item.description}
                          </span>
                        </div>

                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                            isSelected
                              ? 'border-transparent bg-white text-[#121417] dark:bg-[#121417] dark:text-white'
                              : 'border-[#d1d5db] bg-transparent text-transparent dark:border-[#3a4150]'
                          }`}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cursos Específicos com Campo de Busca */}
              <div className="pt-2 border-t border-[#f1f3f6] dark:border-[#20242b]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                    Cursos Específicos
                  </span>
                  <span className="text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                    {selectedCourses.length} área(s)/curso(s) marcado(s)
                  </span>
                </div>

                {/* Campo de Busca Rápida */}
                <div className="relative mb-3">
                  <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9aa1ad]" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Filtrar por nome de curso ou área..."
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-[#121417] placeholder:text-[#9aa1ad] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#15181e] dark:text-white transition-colors"
                  />
                </div>

                {/* Chips de Cursos Específicos */}
                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredSpecificCourses.map((c) => {
                    const isSelected = selectedCourses.includes(c.audience);
                    return (
                      <button
                        key={c.audience}
                        type="button"
                        onClick={() => toggleCourse(c.audience)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-[#121417] bg-[#121417] text-white dark:border-white dark:bg-white dark:text-[#121417]'
                            : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#121417] hover:text-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:text-[#9aa1ad] dark:hover:border-stone-500 dark:hover:text-white'
                        }`}
                      >
                        <span>{c.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Barra Inferior de Navegação e Ação */}
        <div className="mt-10 flex items-center justify-between border-t border-[#e5e7eb] pt-6 dark:border-[#242831]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-xs font-bold text-[#121417] transition-all hover:bg-[#f8f9fa] dark:border-[#242831] dark:bg-[#15181e] dark:text-white dark:hover:bg-[#181b22]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Etapa anterior</span>
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao início</span>
            </Link>
          )}

          <div className="flex items-center gap-3">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="flex items-center gap-2 rounded-xl bg-[#121417] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200 cursor-pointer"
              >
                <span>Avançar</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSaved}
                onClick={handleSavePreferences}
                className="flex items-center gap-2 rounded-xl bg-[#121417] px-7 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Salvar preferências</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function PreferenciasLoadingSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fbfbfb] dark:bg-[#0a0b0d]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="text-xs text-[#64748b] dark:text-[#9aa1ad] font-mono">
          Carregando suas preferências...
        </span>
      </div>
    </div>
  );
}

export default function PreferenciasPage() {
  return (
    <Suspense fallback={<PreferenciasLoadingSkeleton />}>
      <PreferenciasContent />
    </Suspense>
  );
}
