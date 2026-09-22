'use client';

import { useState } from 'react';
import { Opportunity } from '@/types/opportunity';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/modal/SearchModal';
import { OpportunityModal } from '@/components/modal/OpportunityModal';
import {
  SobreAmbientMesh,
  SobreHero,
  SobrePipelineSteps,
  SobreSourcesGrid,
  SobrePWASection,
  SobreOpenSourceCall,
  SobreManifesto,
  SobreSuggestionForm,
} from '@/components/sobre';

export default function SobrePage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fbfbfb] text-[#121417] transition-colors duration-200 dark:bg-[#0a0b0d] dark:text-[#f3f4f6]">
      {/* 1. Malha ambiente acelerada por GPU */}
      <SobreAmbientMesh />

      {/* 2. Header de Navegação Editorial */}
      <Header onSearchClick={() => setIsSearchOpen(true)} />

      {/* 3. Composição Editorial Principal */}
      <main className="flex-1">
        <SobreHero />
        <SobrePipelineSteps />
        <SobreSourcesGrid />
        <SobrePWASection />
        <SobreOpenSourceCall />
        <SobreManifesto />
        <SobreSuggestionForm />
      </main>

      {/* 4. Footer com links rápidos e manifesto */}
      <Footer />

      {/* 5. Modais de Interação Global (Busca & Detalhe de Oportunidade) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectOpportunity={setSelectedOpportunity}
      />

      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
