'use client';

import { useState } from 'react';
import { Opportunity } from '@/types/opportunity';
import { Header } from '@/components/layout/Header';
import { FeaturedMarquee } from '@/components/featured/FeaturedMarquee';
import { CategoryFilter, FilterOption, CATEGORY_FILTERS } from '@/components/feed/CategoryFilter';
import { BentoFeed } from '@/components/feed/BentoFeed';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

        {/* 3. Category Pill Filter Bar */}
        <CategoryFilter
          selectedFilter={selectedFilter.id}
          onSelectFilter={setSelectedFilter}
          totalCount={totalCount}
        />

        {/* 4. Bento Feed com Scroll Infinito estilo YouTube */}
        <BentoFeed
          initialOpportunities={initialOpportunities}
          totalElements={totalCount}
          selectedFilter={selectedFilter}
          onSelectOpportunity={setSelectedOpportunity}
        />
      </main>

      {/* 5. Minimalist Editorial Footer */}
      <Footer />

      {/* 6. Modals (Preview Responsivo + Busca em Tempo Real) */}
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
