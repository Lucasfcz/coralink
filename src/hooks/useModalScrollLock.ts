'use client';

import { useEffect } from 'react';

/**
 * Hook para bloquear a rolagem da página principal (body) e pausar o motor
 * Lenis Smooth Scroll enquanto um modal ou drawer estiver aberto.
 *
 * Garante que apenas o conteúdo interno do modal role caso exceda a altura da tela.
 */
export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    // 1. Bloqueia o scroll nativo do body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2. Pausa o motor Lenis Smooth Scroll se ativo
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();

    return () => {
      // Restaura o scroll nativo
      document.body.style.overflow = originalOverflow || 'unset';
      // Reativa o Lenis
      lenis?.start();
    };
  }, [isOpen]);
}
