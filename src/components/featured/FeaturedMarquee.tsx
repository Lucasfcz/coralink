'use client';

import { useRef, useState } from 'react';
import { Opportunity } from '@/types/opportunity';
import { FeaturedCard } from './FeaturedCard';

interface FeaturedMarqueeProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

export function FeaturedMarquee({
  opportunities,
  onSelectOpportunity,
}: FeaturedMarqueeProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  // Duplicar a lista para garantir loop contínuo e infinito no marquee
  const marqueeItems = [...opportunities, ...opportunities];

  return (
    <section
      id="destaques"
      aria-label="Oportunidades em Destaque"
      className="relative w-full max-w-full overflow-hidden pt-4 pb-10 min-h-[380px] sm:min-h-[420px]"
    >

      {/* Marquee Track (Smooth Continuous Slide to the Right com espaçamento 20-30% maior) */}
      <div
        ref={scrollContainerRef}
        className="relative w-full max-w-full overflow-hidden select-none [contain:paint]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          className={`animate-marquee-right flex flex-nowrap shrink-0 gap-8 sm:gap-9 md:gap-10 px-4 sm:px-6 md:px-8 py-3 ${
            isPaused ? '[animation-play-state:paused!important]' : ''
          }`}
        >
          {marqueeItems.map((opp, idx) => (
            <FeaturedCard
              key={`featured-${opp.id}-${idx}`}
              opportunity={opp}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
