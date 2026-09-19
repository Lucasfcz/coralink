'use client';

import { motion } from 'framer-motion';

export function SobrePipelineSteps() {
  const steps = [
    {
      phase: 'FASE 01',
      title: 'Coleta das oportunidades',
      description:
        'Bots de coleta visitam os portais oficiais de universidades, centros de pesquisa e parques tecnológicos de Pernambuco diariamente, identificando novos editais, eventos, bolsas, competições, programas de extensão... Tudo que o universitário não pode perder.',
      detail: 'todas as fontes são monitoradas 24 horas por dia.',
    },
    {
      phase: 'FASE 02',
      title: 'Classificação com Inteligência Artificial',
      description:
        'Modelos de inteligência artificial analisam a oportunidade por completo: extraem datas críticas de inscrição, valor de bolsas, vagas, benefícios, pré-requisitos e o público de cursos elegíveis.',
      detail: 'Elimina burocracia e transforma PDFs de 30 páginas em resumos objetivos. Facilitando que o universitário ache as informações mais importantes logo de cara.',
    },
    {
      phase: 'FASE 03',
      title: 'Entrega Direta no Feed',
      description:
        'As oportunidades catalogadas chegam instantaneamente à sua tela, com filtros por curso e instituição, permitindo que você encontre eventos em poucos segundos. Sem precisar entrar em 15 sites diferentes todos os dias.',
      detail: 'Links diretos para o edital oficial e canais de inscrição verificados pela comunidade.',
    },
  ];

  return (
    <section id="como-funciona" className="relative py-20 md:py-32 border-b border-[#e5e7eb] dark:border-[#242831]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho Editorial com Tipografia de Grande Porte */}
        <div className="max-w-3xl">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#697282] dark:text-[#9aa1ad]">
            O COMO A MÁGICA ACONTECE
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-[#121417] dark:text-white leading-[1.02]">
            <span className="block">COLETA</span>
            <span className="block">CLASSIFICAÇÃO</span>
            <span className="block">ENTREGA</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4b5563] dark:text-[#9aa1ad] leading-relaxed">
            Como o Coralink monitora, processa e disponibiliza oportunidades de forma 100%
            autônoma para os estudantes.
          </p>
        </div>

        {/* Faixa Horizontal Contínua (Inspirada no Pôster MAFIA) */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e5e7eb] dark:divide-[#242831]/80 border-y border-[#e5e7eb] dark:border-[#242831]/80">
          {steps.map((step, idx) => (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="py-10 md:py-12 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9aa1ad] dark:text-[#697282]">
                  {step.phase}
                </span>

                <h3 className="mt-3 text-xl sm:text-2xl font-black tracking-tight text-[#121417] dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#4b5563] dark:text-[#9aa1ad]">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e5e7eb]/60 dark:border-[#242831]/40">
                <span className="block text-xs font-mono leading-normal text-[#697282] dark:text-[#9aa1ad]">
                  {step.detail}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
