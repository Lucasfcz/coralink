'use client';

import { motion } from 'framer-motion';
import { Bot, BrainCircuit, LayoutGrid, CheckCircle2 } from 'lucide-react';

export function SobrePipelineSteps() {
  const steps = [
    {
      number: '01',
      title: 'Robôs Exploradores',
      subtitle: 'Varredura Contínua',
      description:
        'Nossos robôs visitam os portais oficiais de universidades e institutos de Pernambuco diariamente, identificando editais e notícias no momento em que são publicados.',
      icon: Bot,
      pillColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badge: 'Coleta Autônoma',
      highlights: ['Verificação diária', 'Links originais auditados'],
    },
    {
      number: '02',
      title: 'Inteligência Artificial Curadora',
      subtitle: 'Compreensão Profunda',
      description:
        'Uma IA especializada lê cada edital na íntegra, filtra o que é relevante e extrai requisitos, datas de inscrição, bolsas e benefícios.',
      icon: BrainCircuit,
      pillColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      badge: 'IA & NLP',
      highlights: ['Extração de prazos', 'Eliminação de ruídos'],
    },
    {
      number: '03',
      title: 'Seu Feed em Tempo Real',
      subtitle: 'Acesso Direto',
      description:
        'As oportunidades chegam prontas, categorizadas por instituição e área, para você nunca mais perder um prazo importante.',
      icon: LayoutGrid,
      pillColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      badge: 'Entrega Instantânea',
      highlights: ['Filtros por área', 'Zero enrolação'],
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-[#e5e7eb] bg-white/70 px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#697282] uppercase dark:border-[#242831] dark:bg-[#121417]/70 dark:text-[#9aa1ad]">
            Engenharia Simples & Eficiente
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#121417] sm:text-4xl md:text-5xl dark:text-white">
            Como o Coralink Funciona
          </h2>

          <p className="mt-4 max-w-2xl text-base text-[#697282] sm:text-lg dark:text-[#9aa1ad]">
            A tecnologia do ecossistema explicada sem jargões e complicações.
          </p>
        </div>

        {/* Grade de 3 Passos */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white/80 p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#d2d6dc] hover:shadow-lg dark:border-[#242831] dark:bg-[#121417]/80 dark:hover:border-[#374151] dark:hover:bg-[#15181e]"
              >
                {/* Linha de Destaque Superior Sutil */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d2d6dc] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-[#374151]" />

                <div>
                  {/* Topo do Card: Número Gigante Editorial e Ícone */}
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-4xl sm:text-5xl font-black tracking-tighter text-[#e5e7eb] transition-colors duration-300 group-hover:text-emerald-500/40 dark:text-[#20242b] dark:group-hover:text-emerald-400/30">
                      {step.number}
                    </span>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${step.pillColor} shadow-2xs transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Tag de identificação */}
                  <div className="mt-4">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#9aa1ad] dark:text-[#697282]">
                      Passo {index + 1} • {step.badge}
                    </span>
                    <h3 className="mt-1 text-xl font-bold tracking-tight text-[#121417] dark:text-white">
                      {step.title}
                    </h3>
                  </div>

                  {/* Descrição Humanizada */}
                  <p className="mt-3.5 text-sm text-[#4b5563] dark:text-[#9aa1ad] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Destaques / Benefícios no Rodapé do Card */}
                <div className="mt-6 pt-5 border-t border-[#f1f3f6] dark:border-[#1e2229]">
                  <ul className="space-y-1.5">
                    {step.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs font-medium text-[#697282] dark:text-[#9aa1ad]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
