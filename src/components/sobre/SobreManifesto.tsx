'use client';

import { motion } from 'framer-motion';
import { Heart, MapPin, Quote, Sparkles } from 'lucide-react';

export function SobreManifesto() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[#e5e7eb] bg-gradient-to-b from-white/90 to-white/60 p-8 sm:p-12 md:p-16 text-center shadow-sm backdrop-blur-xl dark:border-[#242831] dark:from-[#15181e]/90 dark:to-[#0e1015]/80"
        >
          {/* Ícone Aspas Decorativo Superior */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white text-[#121417] shadow-xs dark:border-[#242831] dark:bg-[#181b22] dark:text-white">
            <Quote className="h-6 w-6 text-emerald-500" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#697282] dark:text-[#9aa1ad]">
            Manifesto Coralink
          </span>

          {/* Declaração Principal */}
          <blockquote className="mt-6 text-2xl font-bold tracking-tight text-[#121417] sm:text-3xl md:text-4xl dark:text-white leading-snug sm:leading-tight">
            &ldquo;O Coralink nasceu da necessidade real dos estudantes de Pernambuco. Nosso
            propósito é garantir que nenhum universitário perca uma bolsa, estágio ou congresso por
            falta de acesso à informação.&rdquo;
          </blockquote>

          {/* Divisor Delicado */}
          <div className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-[#d2d6dc] to-transparent dark:via-[#374151]" />

          {/* Assinatura e Origem */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-[#697282] dark:text-[#9aa1ad]">
            <div className="flex items-center gap-1.5 font-semibold text-[#121417] dark:text-white">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span>Iniciativa Estudantil & Open Source</span>
            </div>

            <span className="hidden sm:inline text-[#d2d6dc] dark:text-[#374151]">•</span>

            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="h-4 w-4 text-cyan-500" />
              <span>Recife, Pernambuco</span>
            </div>

            <span className="hidden sm:inline text-[#d2d6dc] dark:text-[#374151]">•</span>

            <div className="flex items-center gap-1.5 font-medium">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Pela Educação Pública & Acessível</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
