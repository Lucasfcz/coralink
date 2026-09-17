'use client';

import { useState } from 'react';
import { Opportunity } from '@/types/opportunity';
import { Header } from '@/components/layout/Header';
import { FeaturedMarquee } from '@/components/featured/FeaturedMarquee';
import { CategoryFilter, FilterOption, CATEGORY_FILTERS } from '@/components/feed/CategoryFilter';
import { BentoFeed } from '@/components/feed/BentoFeed';
import { FilterDrawer, AdvancedFilterState } from '@/components/feed/FilterDrawer';
import { OpportunityModal } from '@/components/modal/OpportunityModal';
import { SearchModal } from '@/components/modal/SearchModal';
import { Footer } from '@/components/layout/Footer';

interface CoralinkAppProps {
  initialFeatured: Opportunity[];
  initialOpportunities: Opportunity[];
  totalCount: number;
}

export function CoralinkApp({
  initialFeatured,
  initialOpportunities,
  totalCount,
}: CoralinkAppProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(CATEGORY_FILTERS[0]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleRemoveAdvancedFilter = (key: keyof AdvancedFilterState) => {
    setAdvancedFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleResetAllFilters = () => {
    setAdvancedFilters({});
    setSelectedFilter(CATEGORY_FILTERS[0]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbfb] dark:bg-[#0a0b0d] text-[#121417] dark:text-[#f3f4f6] transition-colors duration-200">
      {/* 1. Sticky Editorial Header */}
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      {/* 2. Oportunidades em Destaque (Marquee Infinito deslisando para a direita) */}
      <main className="flex-1">
        <FeaturedMarquee
          opportunities={initialFeatured}
          onSelectOpportunity={setSelectedOpportunity}
        />

        {/* 3. Category Pill Filter Bar + Advanced Filter Trigger & Badges */}
        <CategoryFilter
          selectedFilter={selectedFilter.id}
          onSelectFilter={setSelectedFilter}
          totalCount={totalCount}
          advancedFilters={advancedFilters}
          onOpenDrawer={() => setIsFilterDrawerOpen(true)}
          onRemoveAdvancedFilter={handleRemoveAdvancedFilter}
          onResetAllFilters={handleResetAllFilters}
        />

        {/* 4. Bento Feed com Scroll Infinito (Peek suave dos cards) */}
        <BentoFeed
          initialOpportunities={initialOpportunities}
          totalElements={totalCount}
          selectedFilter={selectedFilter}
          advancedFilters={advancedFilters}
          onSelectOpportunity={setSelectedOpportunity}
        />
      </main>

      {/* 5. Minimalist Editorial Footer */}
      <Footer />

      {/* 6. Modals & Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={advancedFilters}
        onApplyFilters={setAdvancedFilters}
        onResetFilters={() => setAdvancedFilters({})}
      />

      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectOpportunity={setSelectedOpportunity}
      />
    </div>
  );
}
