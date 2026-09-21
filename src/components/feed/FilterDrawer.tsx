'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  GraduationCap,
  Building2,
  Tag,
  Laptop,
} from 'lucide-react';
import {
  OpportunityType,
  TargetCourseAudience,
  Modality,
} from '@/types/opportunity';
import { useModalScrollLock } from '@/hooks/useModalScrollLock';

export interface AdvancedFilterState {
  course?: TargetCourseAudience;
  institution?: string;
  type?: OpportunityType;
  modality?: Modality;
  isFree?: boolean;
  isForAll?: boolean;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedFilterState;
  onApplyFilters: (filters: AdvancedFilterState) => void;
  onResetFilters: () => void;
}

// Lista curada de cursos mais frequentes na plataforma com distribuição equilibrada
export const COURSE_OPTIONS: { id: TargetCourseAudience; label: string }[] = [
  { id: 'UNIVERSITY_STUDENTS', label: '🎓 Todos os Universitários (Geral)' },
  { id: 'TECHNOLOGY_STUDENTS', label: '💻 Estudantes de Tecnologia (Geral)' },
  { id: 'ENGINEERING_STUDENTS', label: '⚙️ Estudantes de Engenharia (Geral)' },
  { id: 'LAW', label: 'Direito' },
  { id: 'BUSINESS_ADMINISTRATION', label: 'Administração & Gestão' },
  { id: 'MEDICINE', label: 'Medicina' },
  { id: 'NURSING', label: 'Enfermagem' },
  { id: 'PSYCHOLOGY', label: 'Psicologia' },
  { id: 'COMPUTER_SCIENCE', label: 'Ciência da Computação' },
  { id: 'SOFTWARE_ENGINEERING', label: 'Engenharia de Software' },
  { id: 'ADS', label: 'Análise e Desenv. de Sistemas (ADS)' },
  { id: 'CIVIL_ENGINEERING', label: 'Engenharia Civil' },
  { id: 'ARCHITECTURE_AND_URBANISM', label: 'Arquitetura e Urbanismo' },
  { id: 'ACCOUNTING', label: 'Ciências Contábeis' },
  { id: 'DESIGN', label: 'Design & UX' },
  { id: 'NUTRITION', label: 'Nutrição' },
  { id: 'PHARMACY', label: 'Farmácia' },
  { id: 'PHYSICAL_THERAPY', label: 'Fisioterapia' },
  { id: 'PEDAGOGY', label: 'Pedagogia' },
  { id: 'MARKETING', label: 'Marketing & Comunicação' },
  { id: 'BIOMEDICINE', label: 'Biomedicina' },
  { id: 'DENTISTRY', label: 'Odontologia' },
];

// Lista de fontes / instituições monitoradas (12 fontes oficiais da API)
export const INSTITUTION_OPTIONS = [
  { id: 'UFPE', label: 'UFPE' },
  { id: 'CIN_UFPE', label: 'CIn-UFPE' },
  { id: 'IFPE', label: 'IFPE' },
  { id: 'UPE', label: 'UPE' },
  { id: 'PORTO_DIGITAL', label: 'Porto Digital' },
  { id: 'CESAR', label: 'CESAR' },
  { id: 'CESAR_SCHOOL', label: 'CESAR School' },
  { id: 'FACEPE', label: 'FACEPE' },
  { id: 'SENAC_PE', label: 'Senac PE' },
  { id: 'SYMPLA', label: 'Sympla Tech' },
  { id: 'UNIBRA', label: 'UNIBRA' },
  { id: 'UNIFAFIRE', label: 'UNIFAFIRE / Fafire' },
];

// Tipos de oportunidade
export const TYPE_OPTIONS: { id: OpportunityType; label: string }[] = [
  { id: 'INNOVATION', label: 'Inovação & Startups' },
  { id: 'INTERNSHIP', label: 'Estágios & Vagas' },
  { id: 'HACKATHON', label: 'Hackathons & Desafios' },
  { id: 'RESEARCH', label: 'Pesquisa & Iniciação' },
  { id: 'SCHOLARSHIP', label: 'Bolsas de Estudo' },
  { id: 'EVENT', label: 'Eventos & Congressos' },
  { id: 'WORKSHOP', label: 'Workshops & Cursos' },
  { id: 'EXTENSION_PROGRAM', label: 'Extensão Universitária' },
  { id: 'NOTICE', label: 'Comunicados' },
];

// Modalidades
export const MODALITY_OPTIONS: { id: Modality; label: string }[] = [
  { id: 'ONLINE', label: 'Online / Remoto' },
  { id: 'IN_PERSON', label: 'Presencial' },
  { id: 'HYBRID', label: 'Híbrido' },
];

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: FilterDrawerProps) {
  useModalScrollLock(isOpen);
  const activeCount = [
    filters.course,
    filters.institution,
    filters.type,
    filters.modality,
    filters.isFree,
    filters.isForAll,
  ].filter(Boolean).length;

  const handleSelectCourse = (courseId: TargetCourseAudience) => {
    onApplyFilters({
      ...filters,
      course: filters.course === courseId ? undefined : courseId,
    });
  };

  const handleSelectInstitution = (instId: string) => {
    onApplyFilters({
      ...filters,
      institution: filters.institution === instId ? undefined : instId,
    });
  };

  const handleSelectType = (typeId: OpportunityType) => {
    onApplyFilters({
      ...filters,
      type: filters.type === typeId ? undefined : typeId,
    });
  };

  const handleSelectModality = (modalityId: Modality) => {
    onApplyFilters({
      ...filters,
      modality: filters.modality === modalityId ? undefined : modalityId,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Lateral */}
          <motion.aside
            key="filter-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#e5e7eb] bg-white shadow-2xl dark:border-[#242831] dark:bg-[#121417]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5 dark:border-[#242831]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f3f6] text-[#121417] dark:bg-[#20242b] dark:text-white">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#121417] dark:text-white">
                    Filtros Avançados
                  </h3>
                  <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
                    Refine por curso, faculdade e formato
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar filtros"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] text-[#64748b] transition-colors hover:bg-[#f1f3f6] hover:text-[#121417] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027] dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Scrollable */}
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* 1. SEÇÃO CURSO */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="h-4 w-4 text-[#64748b] dark:text-[#9aa1ad]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                    Curso / Formação
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COURSE_OPTIONS.map((c) => {
                    const isSelected = filters.course === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCourse(c.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#121417] text-white shadow-xs dark:bg-white dark:text-[#121417]'
                            : 'border border-[#e5e7eb] bg-[#f8f9fa] text-[#4b5563] hover:border-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad] dark:hover:border-stone-500'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. SEÇÃO FACULDADE / INSTITUIÇÃO */}
              <div className="border-t border-[#f1f3f6] pt-5 dark:border-[#242831]">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-[#64748b] dark:text-[#9aa1ad]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                    Faculdade / Instituição
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INSTITUTION_OPTIONS.map((inst) => {
                    const isSelected = filters.institution === inst.id;
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => handleSelectInstitution(inst.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#121417] text-white shadow-xs dark:bg-white dark:text-[#121417]'
                            : 'border border-[#e5e7eb] bg-[#f8f9fa] text-[#4b5563] hover:border-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad] dark:hover:border-stone-500'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{inst.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. SEÇÃO TIPO DE OPORTUNIDADE */}
              <div className="border-t border-[#f1f3f6] pt-5 dark:border-[#242831]">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-[#64748b] dark:text-[#9aa1ad]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                    Tipo de Oportunidade
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((t) => {
                    const isSelected = filters.type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectType(t.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#121417] text-white shadow-xs dark:bg-white dark:text-[#121417]'
                            : 'border border-[#e5e7eb] bg-[#f8f9fa] text-[#4b5563] hover:border-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad] dark:hover:border-stone-500'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. SEÇÃO FORMATO / MODALIDADE */}
              <div className="border-t border-[#f1f3f6] pt-5 dark:border-[#242831]">
                <div className="flex items-center gap-2 mb-3">
                  <Laptop className="h-4 w-4 text-[#64748b] dark:text-[#9aa1ad]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                    Modalidade
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MODALITY_OPTIONS.map((m) => {
                    const isSelected = filters.modality === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModality(m.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#121417] text-white shadow-xs dark:bg-white dark:text-[#121417]'
                            : 'border border-[#e5e7eb] bg-[#f8f9fa] text-[#4b5563] hover:border-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad] dark:hover:border-stone-500'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. SEÇÃO CARACTERÍSTICAS ADICIONAIS */}
              <div className="border-t border-[#f1f3f6] pt-5 dark:border-[#242831]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121417] mb-3 dark:text-white">
                  Outras Preferências
                </h4>
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!filters.isFree}
                      onChange={(e) =>
                        onApplyFilters({
                          ...filters,
                          isFree: e.target.checked ? true : undefined,
                        })
                      }
                      className="h-4 w-4 rounded-sm border-[#d1d5db] text-[#121417] focus:ring-0 dark:border-[#374151] dark:bg-[#181b22]"
                    />
                    <span className="text-xs text-[#121417] dark:text-[#f3f4f6]">
                      Apenas oportunidades 100% gratuitas
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!filters.isForAll}
                      onChange={(e) =>
                        onApplyFilters({
                          ...filters,
                          isForAll: e.target.checked ? true : undefined,
                        })
                      }
                      className="h-4 w-4 rounded-sm border-[#d1d5db] text-[#121417] focus:ring-0 dark:border-[#374151] dark:bg-[#181b22]"
                    />
                    <span className="text-xs text-[#121417] dark:text-[#f3f4f6]">
                      Abertas para estudantes de qualquer faculdade
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="border-t border-[#e5e7eb] bg-[#f8f9fa] px-6 py-4 flex items-center justify-between dark:border-[#242831] dark:bg-[#15181e]">
              <button
                type="button"
                onClick={onResetFilters}
                disabled={activeCount === 0}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] hover:text-[#121417] disabled:opacity-40 disabled:cursor-not-allowed dark:text-[#9aa1ad] dark:hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Limpar filtros</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#121417] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
              >
                Ver resultados {activeCount > 0 ? `(${activeCount})` : ''}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
