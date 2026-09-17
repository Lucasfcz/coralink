'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Building2, RefreshCw, Sparkles } from 'lucide-react';

export function SobreHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Pílula Editorial com Indicador Pulsante */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs backdrop-blur-md transition-colors hover:border-emerald-500/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="tracking-wide">
                100% Estudantil & Open Source • Feito em Pernambuco
              </span>
            </div>
          </motion.div>

          {/* Título de Alto Padrão Editorial */}
          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-4xl font-extrabold tracking-tight text-[#121417] sm:text-5xl md:text-6xl lg:text-7xl dark:text-white leading-[1.08]"
          >
            Conectando você às{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              melhores oportunidades
            </span>{' '}
            acadêmicas de Pernambuco.
          </motion.h1>

          {/* Subtítulo Humanizado */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base text-[#4b5563] sm:text-lg md:text-xl dark:text-[#9aa1ad] leading-relaxed"
          >
            Editais, bolsas de iniciação científica, estágios e eventos dos maiores centros de ensino
            e tecnologia do estado, centralizados e organizados para você.
          </motion.p>

          {/* CTAs de Navegação Direta */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#121417] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg dark:bg-white dark:text-[#121417] dark:hover:bg-stone-100"
            >
              <span>Explorar Oportunidades</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#fontes"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white/80 px-6 py-3 text-sm font-semibold text-[#121417] shadow-xs backdrop-blur-md transition-all hover:border-[#121417] hover:bg-white dark:border-[#242831] dark:bg-[#15181e]/80 dark:text-white dark:hover:border-stone-500 dark:hover:bg-[#181b22]"
            >
              <Building2 className="h-4 w-4 text-[#697282] dark:text-[#9aa1ad]" />
              <span>Ver Fontes Monitoradas</span>
            </a>
          </motion.div>

          {/* Métricas em Destaque (3 Pilares Fundamentais) */}
          <motion.div
            variants={itemVariants}
            className="mt-14 sm:mt-18 w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Métrica 1: 12 instituições monitoradas */}
              <div className="group relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white/70 p-6 text-left shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#d2d6dc] hover:shadow-md dark:border-[#242831] dark:bg-[#121417]/70 dark:hover:border-[#374151] dark:hover:bg-[#15181e]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-[#121417] dark:text-white">
                    12
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-3 text-base font-bold text-[#121417] dark:text-white">
                  Instituições monitoradas
                </h3>
                <p className="mt-1.5 text-xs text-[#697282] dark:text-[#9aa1ad] leading-relaxed">
                  Centros de excelência, universidades e polos de tecnologia de Pernambuco em um único feed.
                </p>
              </div>

              {/* Métrica 2: Coleta diária autônoma */}
              <div className="group relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white/70 p-6 text-left shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#d2d6dc] hover:shadow-md dark:border-[#242831] dark:bg-[#121417]/70 dark:hover:border-[#374151] dark:hover:bg-[#15181e]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-[#121417] dark:text-white">
                    Diária
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-3 text-base font-bold text-[#121417] dark:text-white">
                  Coleta diária autônoma
                </h3>
                <p className="mt-1.5 text-xs text-[#697282] dark:text-[#9aa1ad] leading-relaxed">
                  Robôs exploradores escaneiam os canais oficiais para catalogar novas oportunidades pontualmente.
                </p>
              </div>

              {/* Métrica 3: Curadoria assistida por IA */}
              <div className="group relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white/70 p-6 text-left shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#d2d6dc] hover:shadow-md dark:border-[#242831] dark:bg-[#121417]/70 dark:hover:border-[#374151] dark:hover:bg-[#15181e]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-[#121417] dark:text-white">
                    IA Ativa
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-3 text-base font-bold text-[#121417] dark:text-white">
                  Curadoria assistida por IA
                </h3>
                <p className="mt-1.5 text-xs text-[#697282] dark:text-[#9aa1ad] leading-relaxed">
                  Modelos de linguagem analisam os editais, extraindo requisitos, prazos e benefícios com precisão.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
