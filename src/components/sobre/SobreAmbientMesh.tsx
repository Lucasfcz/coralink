'use client';

import { motion } from 'framer-motion';

/**
 * SobreAmbientMesh
 * Fundo ambiente com malha gradiente acelerada por hardware (GPU),
 * proporcionando iluminação suave e dimensional sem impacto de performance.
 * Totalmente adaptado para os modos dark e light do Coralink.
 */
export function SobreAmbientMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Light Mode Gradients */}
      <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-700">
        {/* Orb 1: Coral / Cyan subtle warmth top-right */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[15%] right-[-5%] h-[550px] w-[550px] rounded-full bg-gradient-to-br from-emerald-100/60 via-teal-100/40 to-cyan-100/20 blur-[110px] will-change-transform"
        />

        {/* Orb 2: Slate / Indigo soft illumination left */}
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[35%] -left-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-sky-100/50 via-indigo-100/30 to-purple-100/20 blur-[130px] will-change-transform"
        />

        {/* Orb 3: Subtle neutral glow bottom-center */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full bg-stone-200/40 blur-[120px] will-change-transform"
        />
      </div>

      {/* Dark Mode Gradients (Deep Carbon, Emerald, Cyan and Indigo hues) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
        {/* Orb 1: Deep Emerald / Mint glow top-right */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -35, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[18%] -right-[8%] h-[620px] w-[620px] rounded-full bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-cyan-500/5 blur-[140px] will-change-transform"
        />

        {/* Orb 2: Electric Indigo / Cyan deep atmosphere middle-left */}
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 45, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[30%] -left-[15%] h-[680px] w-[680px] rounded-full bg-gradient-to-tr from-cyan-600/10 via-blue-600/8 to-indigo-600/5 blur-[150px] will-change-transform"
        />

        {/* Orb 3: Subtle Carbon Violet glow bottom */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-12%] left-[25%] h-[540px] w-[540px] rounded-full bg-gradient-to-t from-emerald-600/8 via-cyan-900/10 to-transparent blur-[130px] will-change-transform"
        />
      </div>

      {/* Subtle Micro-Grid Texture Overlay for editorial tactile depth */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
