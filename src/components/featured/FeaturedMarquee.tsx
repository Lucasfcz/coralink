'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const xPosRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const hasMovedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Duplicar a lista para garantir loop contínuo e infinito no marquee
  const marqueeItems = [...opportunities, ...opportunities];

  useEffect(() => {
    if (!opportunities || opportunities.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    let halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) {
      halfWidth = 2000;
    }
    xPosRef.current = -halfWidth / 2;

    const baseSpeed = 0.65; // Velocidade suave e contínua

    const step = () => {
      if (trackRef.current) {
        const currentHalfWidth = trackRef.current.scrollWidth / 2;

        if (!isDraggingRef.current) {
          // Se há inércia do arraste do usuário
          if (Math.abs(velocityRef.current) > 0.05) {
            xPosRef.current += velocityRef.current;
            velocityRef.current *= 0.93; // Fricção
          } else {
            // Movimento automático padrão para a direita se não estiver em hover
            if (!isHoveredRef.current) {
              xPosRef.current += baseSpeed;
            }
          }

          // Loop infinito contínuo e imperceptível
          if (currentHalfWidth > 0) {
            if (xPosRef.current >= 0) {
              xPosRef.current -= currentHalfWidth;
            } else if (xPosRef.current <= -currentHalfWidth) {
              xPosRef.current += currentHalfWidth;
            }
          }

          trackRef.current.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`;
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(step);
    };

    animationFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [opportunities]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    velocityRef.current = 0;
    hasMovedRef.current = false;

    if (containerRef.current) {
      try {
        containerRef.current.setPointerCapture(e.pointerId);
      } catch {
        // Ignora erro de captura se não suportado
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;

    const dx = e.clientX - lastDragXRef.current;
    const now = performance.now();
    const dt = now - lastDragTimeRef.current;

    if (Math.abs(e.clientX - dragStartXRef.current) > 5) {
      hasMovedRef.current = true;
    }

    xPosRef.current += dx;

    const currentHalfWidth = trackRef.current.scrollWidth / 2;
    if (currentHalfWidth > 0) {
      if (xPosRef.current >= 0) {
        xPosRef.current -= currentHalfWidth;
      } else if (xPosRef.current <= -currentHalfWidth) {
        xPosRef.current += currentHalfWidth;
      }
    }

    trackRef.current.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`;

    if (dt > 0) {
      velocityRef.current = (dx / dt) * 16;
      if (velocityRef.current > 20) velocityRef.current = 20;
      if (velocityRef.current < -20) velocityRef.current = -20;
    }

    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      if (containerRef.current?.hasPointerCapture(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignora erro de liberação de captura
    }
  };

  const handleSelectCard = useCallback(
    (opp: Opportunity) => {
      // Se foi um movimento de arraste deliberado, não dispara a abertura do modal
      if (hasMovedRef.current) {
        return;
      }
      onSelectOpportunity(opp);
    },
    [onSelectOpportunity]
  );

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <section
      id="destaques"
      aria-label="Oportunidades em Destaque"
      className="relative w-full max-w-full overflow-hidden pt-4 pb-10 min-h-[380px] sm:min-h-[420px]"
    >
      {/* Contêiner de Arraste e Marquee Interativo */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full max-w-full overflow-hidden select-none touch-pan-y [contain:paint] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          ref={trackRef}
          className="flex flex-nowrap shrink-0 gap-8 sm:gap-9 md:gap-10 px-4 sm:px-6 md:px-8 py-3 will-change-transform"
        >
          {marqueeItems.map((opp, idx) => (
            <FeaturedCard
              key={`featured-${opp.id}-${idx}`}
              opportunity={opp}
              onSelect={handleSelectCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
