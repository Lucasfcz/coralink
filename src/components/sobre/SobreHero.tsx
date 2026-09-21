'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

export function SobreHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-28 border-b border-[#e5e7eb] dark:border-[#242831]/60">
      {/* Background Dinâmico de Recife (Cais da Aurora - Dia no modo claro / Noite no modo escuro) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Imagem Diurna (Modo Claro) - Crossfade Suave */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100 dark:opacity-0 pointer-events-none">
          <Image
            src="/images/recife-cais-day.jpg"
            alt="Vista matutina do Cais da Aurora e pontes históricas do Recife"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          {/* Overlays editoriais para legibilidade e fusão com a página */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/80 to-[#fbfbfb]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/30 to-white/70" />
        </div>

        {/* Imagem Noturna (Modo Escuro) - Crossfade Suave */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100 pointer-events-none">
          <Image
            src="/images/recife-cais-night.jpg"
            alt="Vista noturna cinematográfica do Cais da Aurora e pontes iluminadas do Recife"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          {/* Overlays cinematográficos para legibilidade e fusão com o modo escuro */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0d]/92 via-[#0a0b0d]/80 to-[#0a0b0d]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0a0b0d]/30 to-[#0a0b0d]/70" />
        </div>
      </div>

      {/* Conteúdo Editorial Sobreposto */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Letras Monumentais em Full-Width */}
          <motion.div variants={itemVariants} className="w-full select-none">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[168px] font-black tracking-tighter uppercase leading-[0.88] text-[#121417] dark:text-white transition-colors">
              CORALINK
            </h1>
          </motion.div>

          {/* Subtítulo Editorial com Foco em Estudantes */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[#374151] dark:text-[#d1d5db] font-normal drop-shadow-xs"
          >
            Editais, bolsas de iniciação científica, estágios e congressos dos maiores polos acadêmicos
            e tecnológicos de Pernambuco, centralizados e curados para você.
          </motion.p>

          {/* CTAs de Navegação Direta de Alto Contraste */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/#feed"
              className="inline-flex items-center justify-center rounded-full bg-[#121417] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
            >
              <span>Explorar Oportunidades</span>
            </Link>

            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/80 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#121417] shadow-xs backdrop-blur-md transition-all hover:border-[#121417] hover:bg-white dark:border-white/20 dark:bg-[#121417]/80 dark:text-white dark:hover:border-white/40 dark:hover:bg-[#181b22]"
            >
              <span>Como Funciona</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Régua Tipográfica de Métricas Suíças */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-black/10 dark:border-white/10 backdrop-blur-xs">
          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              12
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad]">
              Fontes Oficiais Ativas
            </span>
          </div>

          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              24h
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad]">
              Coleta Autônoma
            </span>
          </div>

          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              100%
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad]">
              Links Oficiais Diretos
            </span>
          </div>

          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              Grátis
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad]">
              Para Qualquer Estudante
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
