'use client';

import { motion } from 'framer-motion';

export function SobreManifesto() {
  return (
    <section className="relative py-24 md:py-36 border-b border-[#e5e7eb] dark:border-[#242831]/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#697282] dark:text-[#9aa1ad]">
            NOSSO OBJETIVO
          </span>

          <blockquote className="mt-8 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#121417] dark:text-white leading-[1.18] sm:leading-[1.15]">
            &ldquo;Oportunidades acadêmicas não deveriam depender de sorte, corredores de faculdade ou grupos fechados. O Coralink existe para que nenhum universitário em Pernambuco fique para trás por falta de acesso à informação.&rdquo;
          </blockquote>

          <div className="mt-10 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-[#697282] dark:text-[#9aa1ad]">
            <span>Recife</span>
            <span>•</span>
            <span>Pernambuco</span>
            <span>•</span>
            <span>Feito por Estudantes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
