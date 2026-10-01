'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Zap,
  Microscope,
  BookOpen,
  PenTool,
  Calendar,
  Rocket,
  Globe,
  HeartHandshake,
  Search,
  Compass,
} from 'lucide-react';
import { OpportunityType, TargetCourseAudience } from '@/types/opportunity';
import { UserPreferences } from '@/types/userPreferences';
import { getUserPreferences, saveUserPreferences } from '@/lib/recommendationEngine';
import { useModalScrollLock } from '@/hooks/useModalScrollLock';

interface ForYouOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

interface OpportunityTypeOption {
  type: OpportunityType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OPPORTUNITY_TYPE_OPTIONS: OpportunityTypeOption[] = [
  {
    type: 'INTERNSHIP',
    label: 'Estágios & Trainee',
    description: 'Vagas no mercado corporativo e startups',
    icon: Briefcase,
  },
  {
    type: 'SCHOLARSHIP',
    label: 'Bolsas de Estudo & Auxílios',
    description: 'Incentivos financeiros e bolsas acadêmicas',
    icon: Award,
  },
  {
    type: 'HACKATHON',
    label: 'Hackathons & Maratonas',
    description: 'Competições de desenvolvimento e ideação',
    icon: Zap,
  },
  {
    type: 'RESEARCH',
    label: 'Iniciação Científica & Pesquisa',
    description: 'Editais PIBIC, PIBITI e laboratórios',
    icon: Microscope,
  },
  {
    type: 'COURSE',
    label: 'Cursos & Certificações',
    description: 'Capacitações com certificado oficial',
    icon: BookOpen,
  },
  {
    type: 'WORKSHOP',
    label: 'Workshops & Oficinas',
    description: 'Imersões práticas de curta duração',
    icon: PenTool,
  },
  {
    type: 'EVENT',
    label: 'Eventos & Congressos',
    description: 'Palestras, simpósios e conferências',
    icon: Calendar,
  },
  {
    type: 'INNOVATION',
    label: 'Inovação & Startups',
    description: 'Incubadoras, aceleradoras e editais',
    icon: Rocket,
  },
  {
    type: 'EXCHANGE_PROGRAM',
    label: 'Intercâmbio & Mobilidade',
    description: 'Estudos e experiências internacionais',
    icon: Globe,
  },
  {
    type: 'VOLUNTEERING',
    label: 'Voluntariado & Extensão',
    description: 'Ações comunitárias e projetos sociais',
    icon: HeartHandshake,
  },
  {
    type: 'GRADUATION',
    label: 'Vestibulares & Graduação',
    description: 'Processos seletivos e novas turmas',
    icon: GraduationCap,
  },
];

interface InstitutionOption {
  id: string;
  name: string;
  acronym: string;
  category: 'FEDERAL' | 'ESTADUAL' | 'ECOSSISTEMA' | 'OUTRA';
}

const INSTITUTION_OPTIONS: InstitutionOption[] = [
  { id: 'UFPE', name: 'Universidade Federal de Pernambuco', acronym: 'UFPE', category: 'FEDERAL' },
  { id: 'IFPE', name: 'Instituto Federal de Pernambuco', acronym: 'IFPE', category: 'FEDERAL' },
  { id: 'UPE', name: 'Universidade de Pernambuco', acronym: 'UPE', category: 'ESTADUAL' },
  { id: 'PORTO_DIGITAL', name: 'Parque Tecnológico Porto Digital', acronym: 'Porto Digital', category: 'ECOSSISTEMA' },
  { id: 'CESAR_SCHOOL', name: 'CESAR School & Centro de Inovação', acronym: 'CESAR', category: 'ECOSSISTEMA' },
  { id: 'UFRPE', name: 'Universidade Federal Rural de Pernambuco', acronym: 'UFRPE', category: 'FEDERAL' },
  { id: 'UNICAP', name: 'Universidade Católica de Pernambuco', acronym: 'UNICAP', category: 'OUTRA' },
  { id: 'SENAC_PE', name: 'Faculdade Senac Pernambuco', acronym: 'Senac PE', category: 'OUTRA' },
  { id: 'FPS', name: 'Faculdade Pernambucana de Saúde', acronym: 'FPS', category: 'OUTRA' },
  { id: 'OUTRA', name: 'Outra Faculdade / Instituição', acronym: 'Outra', category: 'OUTRA' },
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
    description: 'Oportunidades abertas a qualquer área de formação',
  },
  {
    audience: 'TECHNOLOGY_STUDENTS',
    label: 'Estudantes de Tecnologia',
    description: 'Computação, TI, Dados, Redes e Desenvolvimento',
  },
  {
    audience: 'ENGINEERING_STUDENTS',
    label: 'Estudantes de Engenharia',
    description: 'Engenharias Civil, Mecânica, Elétrica, Produção e outras',
  },
  {
    audience: 'EXACT_SCIENCES_STUDENTS',
    label: 'Estudantes de Exatas',
    description: 'Matemática, Estatística, Física e Química',
  },
  {
    audience: 'HEALTH_STUDENTS',
    label: 'Estudantes da Saúde',
    description: 'Medicina, Enfermagem, Farmácia, Odontologia e afins',
  },
  {
    audience: 'BUSINESS_STUDENTS',
    label: 'Estudantes de Negócios e Gestão',
    description: 'Administração, Economia, Contabilidade e Marketing',
  },
  {
    audience: 'HUMANITIES_STUDENTS',
    label: 'Estudantes de Humanas',
    description: 'Direito, Pedagogia, Letras, Serviço Social e Comunicação',
  },
];

interface SpecificCourseOption {
  audience: TargetCourseAudience;
  label: string;
  category: string;
}

const SPECIFIC_COURSE_OPTIONS: SpecificCourseOption[] = [
  // Tecnologia
  { audience: 'SOFTWARE_ENGINEERING', label: 'Engenharia de Software', category: 'Tecnologia' },
  { audience: 'COMPUTER_SCIENCE', label: 'Ciência da Computação', category: 'Tecnologia' },
  { audience: 'ADS', label: 'Análise e Desenv. de Sistemas (ADS)', category: 'Tecnologia' },
  { audience: 'INFORMATION_SYSTEMS', label: 'Sistemas de Informação', category: 'Tecnologia' },
  { audience: 'COMPUTER_ENGINEERING', label: 'Engenharia da Computação', category: 'Tecnologia' },
  { audience: 'DATA_SCIENCE', label: 'Ciência de Dados & IA', category: 'Tecnologia' },
  // Negócios & Comunicação
  { audience: 'BUSINESS_ADMINISTRATION', label: 'Administração', category: 'Negócios' },
  { audience: 'ACCOUNTING', label: 'Ciências Contábeis', category: 'Negócios' },
  { audience: 'ECONOMICS', label: 'Economia', category: 'Negócios' },
  { audience: 'MARKETING', label: 'Marketing', category: 'Negócios' },
  { audience: 'DESIGN', label: 'Design & UX', category: 'Comunicação' },
  { audience: 'JOURNALISM', label: 'Jornalismo', category: 'Comunicação' },
  { audience: 'ADVERTISING', label: 'Publicidade e Propaganda', category: 'Comunicação' },
  // Saúde
  { audience: 'MEDICINE', label: 'Medicina', category: 'Saúde' },
  { audience: 'NURSING', label: 'Enfermagem', category: 'Saúde' },
  { audience: 'PHARMACY', label: 'Farmácia', category: 'Saúde' },
  { audience: 'PSYCHOLOGY', label: 'Psicologia', category: 'Saúde' },
  { audience: 'PHYSICAL_THERAPY', label: 'Fisioterapia', category: 'Saúde' },
  { audience: 'BIOMEDICINE', label: 'Biomedicina', category: 'Saúde' },
  { audience: 'NUTRITION', label: 'Nutrição', category: 'Saúde' },
  { audience: 'DENTISTRY', label: 'Odontologia', category: 'Saúde' },
  // Engenharias & Exatas
  { audience: 'CIVIL_ENGINEERING', label: 'Engenharia Civil', category: 'Engenharia' },
  { audience: 'ELECTRICAL_ENGINEERING', label: 'Engenharia Elétrica', category: 'Engenharia' },
  { audience: 'MECHANICAL_ENGINEERING', label: 'Engenharia Mecânica', category: 'Engenharia' },
  { audience: 'PRODUCTION_ENGINEERING', label: 'Engenharia de Produção', category: 'Engenharia' },
  { audience: 'CHEMICAL_ENGINEERING', label: 'Engenharia Química', category: 'Engenharia' },
  { audience: 'MATHEMATICS', label: 'Matemática', category: 'Exatas' },
  { audience: 'STATISTICS', label: 'Estatística', category: 'Exatas' },
  { audience: 'PHYSICS', label: 'Física', category: 'Exatas' },
  // Humanas & Jurídico
  { audience: 'LAW', label: 'Direito', category: 'Humanas' },
  { audience: 'ARCHITECTURE_AND_URBANISM', label: 'Arquitetura e Urbanismo', category: 'Humanas' },
  { audience: 'PEDAGOGY', label: 'Pedagogia', category: 'Humanas' },
  { audience: 'SOCIAL_WORK', label: 'Serviço Social', category: 'Humanas' },
];

export function ForYouOnboardingModal({
  isOpen,
  onClose,
  onCompleted,
}: ForYouOnboardingModalProps) {
  useModalScrollLock(isOpen);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [notInCollege, setNotInCollege] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<TargetCourseAudience[]>([]);
  const [courseSearch, setCourseSearch] = useState('');

  // Hidrata preferências pré-existentes se houver
  useEffect(() => {
    if (!isOpen) return;
    queueMicrotask(() => {
      const current = getUserPreferences();
      setSelectedTypes(current.selectedTypes || []);
      setSelectedInstitution(current.institution || null);
      setNotInCollege(Boolean(current.notInCollege));
      setSelectedCourses(current.targetCourses || []);
      setStep(1);
    });
  }, [isOpen]);

  // Alterna tipo de oportunidade (múltipla escolha)
  const toggleType = (t: OpportunityType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  // Alterna curso (múltipla escolha)
  const toggleCourse = (c: TargetCourseAudience) => {
    setSelectedCourses((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  // Seleção de faculdade
  const handleSelectInstitution = (instId: string) => {
    setSelectedInstitution(instId);
    setNotInCollege(false);
  };

  const handleSelectNotInCollege = () => {
    setNotInCollege(true);
    setSelectedInstitution(null);
  };

  // Cursos filtrados pela busca
  const filteredSpecificCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return SPECIFIC_COURSE_OPTIONS;
    return SPECIFIC_COURSE_OPTIONS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [courseSearch]);

  const handleFinish = () => {
    const current = getUserPreferences();
    const updated: UserPreferences = {
      ...current,
      selectedTypes,
      institution: selectedInstitution,
      notInCollege,
      targetCourses: selectedCourses,
      hasCompletedOnboarding: true,
    };
    saveUserPreferences(updated);
    onCompleted?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
          {/* Backdrop escuro com desfoque de alta fidelidade */}
          <motion.div
            key="foryou-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            key="foryou-container"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            className="relative z-10 flex w-full max-w-2xl max-h-[92vh] flex-col overflow-hidden rounded-t-[32px] sm:rounded-[28px] border border-[#e5e7eb] bg-white shadow-2xl dark:border-[#242831] dark:bg-[#15181e]"
          >
            {/* Mobile Handle Drag Indicator */}
            <div className="flex sm:hidden w-full items-center justify-center pt-3 pb-1 bg-white dark:bg-[#15181e]">
              <div className="h-1.5 w-12 rounded-full bg-[#d1d5db] dark:bg-[#2b303a]" />
            </div>

            {/* Top Bar: Stepper e Botão Fechar */}
            <div className="flex items-center justify-between border-b border-[#f1f3f6] px-5 sm:px-8 py-4 dark:border-[#242831]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#121417] text-white dark:bg-white dark:text-[#121417]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                    Personalização
                  </span>
                  <p className="text-xs font-semibold text-[#121417] dark:text-white">
                    Etapa {step} de 3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors"
                >
                  Pular por enquanto
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar modal"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#64748b] transition-all hover:bg-[#121417] hover:text-white dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-white dark:hover:text-[#121417]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Linha de Progresso Visual */}
            <div className="h-1 w-full bg-[#f1f3f6] dark:bg-[#242831]">
              <motion.div
                className="h-full bg-[#121417] dark:bg-white"
                initial={false}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Conteúdo Rolável do Passo Ativo */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 overscroll-contain">
              <AnimatePresence mode="wait">
                {/* ETAPA 1: TIPOS DE OPORTUNIDADE (Múltipla Escolha) */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121417] dark:text-white">
                        O que você mais busca no momento?
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#64748b] dark:text-[#9aa1ad]">
                        Selecione um ou mais formatos para priorizarmos no seu feed (múltipla escolha).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {OPPORTUNITY_TYPE_OPTIONS.map((item) => {
                        const isSelected = selectedTypes.includes(item.type);
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => toggleType(item.type)}
                            className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                              isSelected
                                ? 'border-[#121417] bg-[#121417] text-white shadow-xs dark:border-white dark:bg-white dark:text-[#121417]'
                                : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] hover:border-stone-400 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                isSelected
                                  ? 'bg-white/15 text-white dark:bg-black/10 dark:text-[#121417]'
                                  : 'bg-white text-[#121417] dark:bg-[#20242b] dark:text-white'
                              }`}
                            >
                              <IconComponent className="h-4.5 w-4.5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold leading-tight">
                                  {item.label}
                                </span>
                                {isSelected && (
                                  <div
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                      isSelected
                                        ? 'bg-white text-[#121417] dark:bg-[#121417] dark:text-white'
                                        : ''
                                    }`}
                                  >
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <p
                                className={`mt-0.5 text-[11px] leading-snug line-clamp-1 ${
                                  isSelected
                                    ? 'text-white/80 dark:text-[#121417]/80'
                                    : 'text-[#64748b] dark:text-[#9aa1ad]'
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 2: INSTITUIÇÃO DE ENSINO */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121417] dark:text-white">
                        Qual a sua faculdade ou ecossistema acadêmico?
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#64748b] dark:text-[#9aa1ad]">
                        Isso nos ajuda a destacar editais locais ou iniciativas abertas ao público.
                      </p>
                    </div>

                    {/* Destaque Primário: Caso o usuário não esteja em faculdade */}
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={handleSelectNotInCollege}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                          notInCollege
                            ? 'border-[#121417] bg-[#121417] text-white shadow-xs dark:border-white dark:bg-white dark:text-[#121417]'
                            : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] hover:border-stone-400 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              notInCollege
                                ? 'bg-white/15 text-white dark:bg-black/10 dark:text-[#121417]'
                                : 'bg-white text-[#121417] dark:bg-[#20242b] dark:text-white'
                            }`}
                          >
                            <Compass className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-bold block">
                              Ainda não estou em uma faculdade
                            </span>
                            <span
                              className={`text-[11px] block mt-0.5 ${
                                notInCollege
                                  ? 'text-white/80 dark:text-[#121417]/80'
                                  : 'text-[#64748b] dark:text-[#9aa1ad]'
                              }`}
                            >
                              Destacaremos vestibulares, editais de ingresso e oportunidades abertas a todos
                            </span>
                          </div>
                        </div>

                        {notInCollege && (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#121417] dark:bg-[#121417] dark:text-white">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    </div>

                    <div className="relative my-4 flex items-center justify-center">
                      <div className="w-full border-t border-[#f1f3f6] dark:border-[#242831]" />
                      <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:bg-[#15181e] dark:text-[#9aa1ad]">
                        Ou selecione sua instituição
                      </span>
                    </div>

                    {/* Grade de Instituições */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {INSTITUTION_OPTIONS.map((inst) => {
                        const isSelected = !notInCollege && selectedInstitution === inst.id;
                        return (
                          <button
                            key={inst.id}
                            type="button"
                            onClick={() => handleSelectInstitution(inst.id)}
                            className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                              isSelected
                                ? 'border-[#121417] bg-[#121417] text-white shadow-xs dark:border-white dark:bg-white dark:text-[#121417]'
                                : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] hover:border-stone-400 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Building2 className="h-4 w-4 shrink-0 opacity-70" />
                              <div className="min-w-0">
                                <span className="text-xs font-bold block truncate">
                                  {inst.acronym}
                                </span>
                                <span
                                  className={`text-[10px] block truncate ${
                                    isSelected
                                      ? 'text-white/80 dark:text-[#121417]/80'
                                      : 'text-[#64748b] dark:text-[#9aa1ad]'
                                  }`}
                                >
                                  {inst.name}
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[#121417] dark:bg-[#121417] dark:text-white">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 3: CURSOS E ÁREAS DE INTERESSE (Múltipla Escolha, Termos Gerais no Topo) */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#121417] dark:text-white">
                        Quais cursos e áreas você tem interesse?
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-[#64748b] dark:text-[#9aa1ad]">
                        Você pode marcar áreas gerais e também cursos específicos (múltipla escolha).
                      </p>
                    </div>

                    {/* TERMOS GERAIS NO INÍCIO */}
                    <div className="mb-6">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                        Grandes Áreas de Formação
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                  : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] hover:border-stone-400 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <span className="text-xs font-bold block leading-tight">
                                  {item.label}
                                </span>
                                <span
                                  className={`mt-0.5 text-[10px] block leading-snug ${
                                    isSelected
                                      ? 'text-white/80 dark:text-[#121417]/80'
                                      : 'text-[#64748b] dark:text-[#9aa1ad]'
                                  }`}
                                >
                                  {item.description}
                                </span>
                              </div>

                              {isSelected && (
                                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[#121417] dark:bg-[#121417] dark:text-white">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CURSOS ESPECÍFICOS */}
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                          Cursos Específicos
                        </span>
                        <span className="text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                          {selectedCourses.length} selecionado(s)
                        </span>
                      </div>

                      {/* Campo de Filtro Rápido */}
                      <div className="relative mb-3">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa1ad]" />
                        <input
                          type="text"
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          placeholder="Filtrar curso (ex: Ciência da Computação, Direito, Medicina...)"
                          className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] py-2 pr-3 pl-8 text-xs font-medium text-[#121417] placeholder:text-[#9aa1ad] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
                        />
                      </div>

                      {/* Chips de Cursos */}
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredSpecificCourses.map((c) => {
                          const isSelected = selectedCourses.includes(c.audience);
                          return (
                            <button
                              key={c.audience}
                              type="button"
                              onClick={() => toggleCourse(c.audience)}
                              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                                isSelected
                                  ? 'border-[#121417] bg-[#121417] text-white dark:border-white dark:bg-white dark:text-[#121417]'
                                  : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] hover:border-stone-400 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:hover:border-stone-600'
                              }`}
                            >
                              <span>{c.label}</span>
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rodapé de Navegação do Stepper */}
            <div className="flex items-center justify-between border-t border-[#f1f3f6] px-5 sm:px-8 py-4 dark:border-[#242831] bg-white dark:bg-[#15181e]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-xs font-bold text-[#121417] transition-all hover:bg-[#f8f9fa] dark:border-[#242831] dark:text-white dark:hover:bg-[#181b22]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#121417] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <span>Continuar</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-2 rounded-xl bg-[#121417] px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Concluir e ver feed</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
