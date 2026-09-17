'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Opportunity } from '@/types/opportunity';
import { BentoCard } from './BentoCard';
import { FeedSkeleton } from './FeedSkeleton';
import { FeedPeekSkeleton } from './FeedPeekSkeleton';
import { FilterOption } from './CategoryFilter';
import { AdvancedFilterState } from './FilterDrawer';
import { getOpportunities } from '@/services/opportunities';
import { Flame, CheckCircle2 } from 'lucide-react';

interface BentoFeedProps {
  initialOpportunities: Opportunity[];
  totalElements?: number;
  selectedFilter: FilterOption;
  advancedFilters?: AdvancedFilterState;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export function BentoFeed({
  initialOpportunities,
  selectedFilter,
  advancedFilters,
  onSelectOpportunity,
}: BentoFeedProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Efeito ao trocar os filtros: resetar página e buscar novos dados
  useEffect(() => {
    let isCancelled = false;

    async function applyFilter() {
      setIsFilterLoading(true);
      try {
        const res = await getOpportunities({
          type: advancedFilters?.type || selectedFilter.type,
          targetCourseAudience: advancedFilters?.course,
          sourceName: advancedFilters?.institution,
          modality: advancedFilters?.modality,
          isFree: advancedFilters?.isFree !== undefined ? advancedFilters.isFree : selectedFilter.isFree,
          isForAll: advancedFilters?.isForAll !== undefined ? advancedFilters.isForAll : selectedFilter.isForAll,
          page: 0,
          size: 9,
        });

        if (!isCancelled) {
          setOpportunities(res.content || []);
          setPage(0);
          setHasMore(!res.last && (res.content?.length ?? 0) > 0);
        }
      } catch (error) {
        console.error('Erro ao filtrar oportunidades:', error);
      } finally {
        if (!isCancelled) {
          setIsFilterLoading(false);
        }
      }
    }

    applyFilter();

    return () => {
      isCancelled = true;
    };
  }, [selectedFilter, advancedFilters]);

  // Função para carregar próxima página (Scroll Infinito com peek discreto)
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore || isFilterLoading) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const [res] = await Promise.all([
        getOpportunities({
          type: advancedFilters?.type || selectedFilter.type,
          targetCourseAudience: advancedFilters?.course,
          sourceName: advancedFilters?.institution,
          modality: advancedFilters?.modality,
          isFree: advancedFilters?.isFree !== undefined ? advancedFilters.isFree : selectedFilter.isFree,
          isForAll: advancedFilters?.isForAll !== undefined ? advancedFilters.isForAll : selectedFilter.isForAll,
          page: nextPage,
          size: 9,
        }),
        // Garante que a prévia discreta apareça com suavidade
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);

      if (res.content && res.content.length > 0) {
        setOpportunities((prev) => {
          // Evitar duplicatas por ID
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNew = res.content.filter((item) => !existingIds.has(item.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
        setHasMore(!res.last);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro no scroll infinito:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore, isFilterLoading, selectedFilter, advancedFilters]);

  // Observer do Sentinel para disparar automaticamente antes de chegar ao fim
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore && hasMore) {
          loadNextPage();
        }
      },
      {
        rootMargin: '80px', // Aciona suavemente ao se aproximar do final da página
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage, hasMore, isLoadingMore]);

  // Agrupar oportunidades em blocos Bento editoriais
  // Bloco Bento: 1 Hero (2 cols) + 2 Stacked (1 col) + 2 Editorial (1.5 cols cada ou grid normal)
  const renderBentoBlocks = () => {
    const blocks: React.ReactNode[] = [];
    const chunkSize = 5;

    for (let i = 0; i < opportunities.length; i += chunkSize) {
      const chunk = opportunities.slice(i, i + chunkSize);
      const heroItem = chunk[0];
      const stackedItems = chunk.slice(1, 3);
      const editorialItems = chunk.slice(3, 5);

      blocks.push(
        <div key={`bento-block-${i}`} className="flex flex-col gap-6">
          {/* Top Row: Hero Card (Left 2 cols) + Stacked Cards (Right 1 col) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {heroItem && (
              <BentoCard
                opportunity={heroItem}
                variant="hero"
                onSelect={onSelectOpportunity}
              />
            )}

            {stackedItems.length > 0 && (
              <div className="flex flex-col gap-6 justify-between">
                {stackedItems.map((item) => (
                  <BentoCard
                    key={`stacked-${item.id}`}
                    opportunity={item}
                    variant="stacked"
                    onSelect={onSelectOpportunity}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Row: Editorial Cards lado a lado */}
          {editorialItems.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {editorialItems.map((item) => (
                <BentoCard
                  key={`editorial-${item.id}`}
                  opportunity={item}
                  variant="editorial"
                  onSelect={onSelectOpportunity}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return blocks;
  };

  return (
    <section id="feed" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Feed Section Header (Estilo image.png) */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[#e5e7eb] pb-5 dark:border-[#242831]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#121417] dark:text-white">✦</span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#121417] dark:text-white">
              Feed de Oportunidades
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#64748b] dark:text-[#9aa1ad]">
            Atualizações em tempo real em todas as fontes monitoradas
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{opportunities.length} oportunidades exibidas</span>
        </div>
      </div>

      {/* Feed Content */}
      {isFilterLoading ? (
        <FeedSkeleton />
      ) : opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#d1d5db] bg-white p-12 text-center dark:border-[#242831] dark:bg-[#15181e]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f3f6] text-[#64748b] mb-4 dark:bg-[#20242b] dark:text-[#9aa1ad]">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#121417] dark:text-white">
            Nenhuma oportunidade encontrada
          </h3>
          <p className="mt-1 max-w-sm text-xs text-[#64748b] dark:text-[#9aa1ad]">
            Não há oportunidades vigentes com o filtro selecionado no momento. Tente selecionar outra categoria.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {renderBentoBlocks()}

          {/* Prévia discreta (peek) dos cards seguintes durante o carregamento */}
          {isLoadingMore && <FeedPeekSkeleton />}

          {/* Sentinel do IntersectionObserver para scroll infinito */}
          <div ref={sentinelRef} className="h-6 w-full" />

          {/* Mensagem de Fim de Feed */}
          {!hasMore && opportunities.length > 0 && (
            <div className="my-10 flex flex-col items-center justify-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-2 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                Você está em dia com todas as novidades!
              </p>
              <p className="text-xs text-[#64748b] mt-0.5 dark:text-[#9aa1ad]">
                Todas as oportunidades ativas do ecossistema foram carregadas.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
