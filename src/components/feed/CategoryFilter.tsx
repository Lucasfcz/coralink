'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { OpportunityType } from '@/types/opportunity';
import {
  AdvancedFilterState,
  COURSE_OPTIONS,
  INSTITUTION_OPTIONS,
  TYPE_OPTIONS,
  MODALITY_OPTIONS,
} from './FilterDrawer';

export interface FilterOption {
  id: string;
  label: string;
  type?: OpportunityType;
  isFree?: boolean;
  isForAll?: boolean;
}

export const CATEGORY_FILTERS: FilterOption[] = [
  { id: 'ALL', label: 'Todas as Oportunidades' },
  { id: 'HACKATHON', label: 'Hackathons & Desafios', type: 'HACKATHON' },
  { id: 'INTERNSHIP', label: 'Estágios & Vagas', type: 'INTERNSHIP' },
  { id: 'RESEARCH', label: 'Pesquisa & Iniciação', type: 'RESEARCH' },
  { id: 'SCHOLARSHIP', label: 'Bolsas de Estudo', type: 'SCHOLARSHIP' },
  { id: 'EVENT', label: 'Eventos & Congressos', type: 'EVENT' },
  { id: 'WORKSHOP', label: 'Workshops & Cursos', type: 'WORKSHOP' },
  { id: 'FREE', label: 'Apenas Gratuitas', isFree: true },
  { id: 'FOR_ALL', label: 'Abertas a Todas Faculdades', isForAll: true },
];

interface CategoryFilterProps {
  selectedFilter: string;
  onSelectFilter: (filter: FilterOption) => void;
  totalCount?: number;
  advancedFilters?: AdvancedFilterState;
  onOpenDrawer?: () => void;
  onRemoveAdvancedFilter?: (key: keyof AdvancedFilterState) => void;
  onResetAllFilters?: () => void;
}

export function CategoryFilter({
  selectedFilter,
  onSelectFilter,
  totalCount,
  advancedFilters = {},
  onOpenDrawer,
  onRemoveAdvancedFilter,
  onResetAllFilters,
}: CategoryFilterProps) {
  // Contabilizar filtros avançados ativos
  const activeKeys = (Object.keys(advancedFilters) as (keyof AdvancedFilterState)[]).filter(
    (key) => advancedFilters[key] !== undefined
  );
  const activeCount = activeKeys.length;

  // Montar etiquetas legíveis para badges de filtros avançados
  const activeBadges: { key: keyof AdvancedFilterState; label: string }[] = [];

  if (advancedFilters.course) {
    const found = COURSE_OPTIONS.find((c) => c.id === advancedFilters.course);
    activeBadges.push({
      key: 'course',
      label: `Curso: ${found ? found.label : advancedFilters.course}`,
    });
  }

  if (advancedFilters.institution) {
    const found = INSTITUTION_OPTIONS.find((i) => i.id === advancedFilters.institution);
    activeBadges.push({
      key: 'institution',
      label: `Faculdade: ${found ? found.label : advancedFilters.institution}`,
    });
  }

  if (advancedFilters.type) {
    const found = TYPE_OPTIONS.find((t) => t.id === advancedFilters.type);
    activeBadges.push({
      key: 'type',
      label: `Tipo: ${found ? found.label : advancedFilters.type}`,
    });
  }

  if (advancedFilters.modality) {
    const found = MODALITY_OPTIONS.find((m) => m.id === advancedFilters.modality);
    activeBadges.push({
      key: 'modality',
      label: `Modalidade: ${found ? found.label : advancedFilters.modality}`,
    });
  }

  if (advancedFilters.isFree) {
    activeBadges.push({ key: 'isFree', label: 'Gratuito' });
  }

  if (advancedFilters.isForAll) {
    activeBadges.push({ key: 'isForAll', label: 'Aberto a Todos' });
  }

  return (
    <div className="w-full border-y border-[#e5e7eb] bg-[#fbfbfb]/80 py-3.5 backdrop-blur-sm dark:border-[#242831] dark:bg-[#0a0b0d]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Botão Gatilho Filtros Avançados */}
          {onOpenDrawer && (
            <button
              type="button"
              onClick={onOpenDrawer}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                activeCount > 0
                  ? 'bg-[#121417] text-white shadow-sm dark:bg-white dark:text-[#121417]'
                  : 'border border-[#e5e7eb] bg-white text-[#121417] hover:border-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:text-white dark:hover:border-stone-500'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filtros</span>
              {activeCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-extrabold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          )}

          <div className="h-5 w-px bg-[#e5e7eb] shrink-0 dark:bg-[#242831]" />

          {/* Pílulas de Categoria Rápidas com Scroll Horizontal */}
          <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = selectedFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectFilter(cat)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#121417] text-white shadow-sm dark:bg-white dark:text-[#121417]'
                      : 'border border-[#e5e7eb] bg-white text-[#4b5563] hover:border-[#121417] hover:text-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:text-[#9aa1ad] dark:hover:border-stone-500 dark:hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.id === 'ALL' && totalCount !== undefined && totalCount > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#121417]'
                          : 'bg-[#f1f3f6] text-[#64748b] dark:bg-[#20242b] dark:text-[#9aa1ad]'
                      }`}
                    >
                      {totalCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Linha de Tags de Filtros Avançados Ativos com Remoção Rápida */}
        {activeBadges.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#f1f3f6] pt-2.5 dark:border-[#20242b]">
            <span className="text-[11px] font-semibold text-[#64748b] dark:text-[#9aa1ad]">
              Filtros aplicados:
            </span>
            {activeBadges.map((b) => (
              <span
                key={b.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-2.5 py-1 text-[11px] font-medium text-[#121417] shadow-2xs dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6]"
              >
                <span>{b.label}</span>
                {onRemoveAdvancedFilter && (
                  <button
                    type="button"
                    onClick={() => onRemoveAdvancedFilter(b.key)}
                    className="text-[#64748b] hover:text-rose-600 dark:text-[#9aa1ad] dark:hover:text-rose-400"
                    aria-label={`Remover filtro ${b.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {onResetAllFilters && (
              <button
                type="button"
                onClick={onResetAllFilters}
                className="ml-1 text-[11px] font-semibold text-[#64748b] hover:text-[#121417] hover:underline dark:text-[#9aa1ad] dark:hover:text-white"
              >
                Limpar todos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
