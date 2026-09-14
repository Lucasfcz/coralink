'use client';

import { OpportunityType } from '@/types/opportunity';

export interface FilterOption {
  id: string;
  label: string;
  type?: OpportunityType;
  isFree?: boolean;
  isForAll?: boolean;
}

interface CategoryFilterProps {
  selectedFilter: string;
  onSelectFilter: (filter: FilterOption) => void;
  totalCount?: number;
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

export function CategoryFilter({
  selectedFilter,
  onSelectFilter,
  totalCount,
}: CategoryFilterProps) {
  return (
    <div className="w-full border-y border-[#e5e7eb] bg-[#fbfbfb]/80 py-4 backdrop-blur-sm dark:border-[#242831] dark:bg-[#0a0b0d]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = selectedFilter === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectFilter(cat)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
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
    </div>
  );
}
