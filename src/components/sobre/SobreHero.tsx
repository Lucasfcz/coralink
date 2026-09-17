'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

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
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#e5e7eb] dark:border-[#242831]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow de Alto Impacto Editorial (Estilo Pôster Suíço) */}
          <motion.div variants={itemVariants} className="mb-4">
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#697282] dark:text-[#9aa1ad]">
              OPORTUNIDADES REAIS • CRITÉRIOS CLAROS • FUTURO UNIVERSITÁRIO
            </span>
          </motion.div>

          {/* Letras Monumentais em Full-Width (Inspirado no Pôster MAFIA) */}
          <motion.div variants={itemVariants} className="w-full select-none">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[168px] font-black tracking-tighter uppercase leading-[0.88] text-[#121417] dark:text-white transition-all">
              CORALINK
            </h1>
          </motion.div>

          {/* Subtítulo Editorial com Foco em Estudantes */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[#4b5563] dark:text-[#9aa1ad]"
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
              className="inline-flex items-center gap-2.5 rounded-full bg-[#121417] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
            >
              <span>Explorar Oportunidades</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white/70 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#121417] shadow-xs backdrop-blur-md transition-all hover:border-[#121417] hover:bg-white dark:border-[#242831] dark:bg-[#121417]/80 dark:text-white dark:hover:border-white/40 dark:hover:bg-[#181b22]"
            >
              <span>Como Funciona</span>
              <ArrowDown className="h-4 w-4 opacity-70" />
            </a>
          </motion.div>
        </motion.div>

        {/* Fotografia Arquitetônica Cinematográfica Integrada ao Hero */}
        <div className="relative mt-12 sm:mt-16 w-full h-[280px] sm:h-[400px] md:h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#e5e7eb] dark:border-[#242831] shadow-2xl bg-black">
          <Image
            src="/images/coralink-editorial-hero.jpg"
            alt="Arquitetura contemporânea de pesquisa e inovação universitária em Pernambuco"
            fill
            className="object-cover object-center brightness-90 contrast-105"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          {/* Vinheta atmosférica superior e inferior para fusão com a página */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Legenda Editorial Sutil no Canto Inferior */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-8 sm:right-8 flex items-center justify-between text-white/90 text-xs font-mono">
            <span className="uppercase tracking-wider">
              Ecossistema Universitário de Pernambuco
            </span>
            <span className="hidden sm:inline-block text-white/60">
              Recife • Agreste • Sertão
            </span>
          </div>
        </div>

        {/* Régua Tipográfica de Métricas Suíças (Sem nenhum card flutuante!) */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#e5e7eb] dark:border-[#242831]/60">
          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              12
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#697282] dark:text-[#9aa1ad]">
              Fontes Oficiais Ativas
            </span>
          </div>

          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              24h
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#697282] dark:text-[#9aa1ad]">
              Varredura Autônoma
            </span>
          </div>

          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              100%
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#697282] dark:text-[#9aa1ad]">
              Links Oficiais Diretos
            </span>
          </div>

          <div>
            <span className="block text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              Grátis
            </span>
            <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-[#697282] dark:text-[#9aa1ad]">
              Para Qualquer Estudante
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
