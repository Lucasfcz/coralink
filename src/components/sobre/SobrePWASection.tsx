'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Wifi, Battery, Search, Sparkles } from 'lucide-react';
import { InstallModal } from '@/components/pwa/InstallModal';

interface MiniCard {
  institution: string;
  logo: string;
  badge: string;
  badgeColor: string;
  title: string;
  deadline: string;
}

const FEATURED_ITEMS = [
  {
    institution: 'UFPE',
    tag: 'PESQUISA',
    title: 'Edital PIBIC 2026/2027',
    desc: 'Bolsas de Iniciação Científica • R$ 700/mês',
    border: 'border-emerald-500/30',
    tagBg: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    institution: 'CESAR School',
    tag: 'ESTÁGIO',
    title: 'Summer Job Tech 2026',
    desc: 'Vagas em IA e Engenharia de Software',
    border: 'border-sky-500/30',
    tagBg: 'bg-sky-500/20 text-sky-300',
  },
  {
    institution: 'Porto Digital',
    tag: 'FORMAÇÃO',
    title: 'Embarque Digital 2026',
    desc: 'Graduação 100% custeada no Recife',
    border: 'border-purple-500/30',
    tagBg: 'bg-purple-500/20 text-purple-300',
  },
  {
    institution: 'FACEPE',
    tag: 'INOVAÇÃO',
    title: 'Aceleração de Startups',
    desc: 'Fomento a projetos acadêmicos inovadores',
    border: 'border-amber-500/30',
    tagBg: 'bg-amber-500/20 text-amber-300',
  },
];

const RECENT_ITEMS: MiniCard[] = [
  {
    institution: 'UFPE',
    logo: '/institutions/ufpe.png',
    badge: 'Inscrições abertas',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Edital PROPESQI Nº 04/2026: Bolsas CNPq',
    deadline: 'Até 15/04',
  },
  {
    institution: 'CESAR',
    logo: '/institutions/cesar.png',
    badge: 'Remunerado',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    title: 'Residência Tecnológica em Inteligência Artificial',
    deadline: 'Até 22/04',
  },
  {
    institution: 'IFPE',
    logo: '/institutions/ifpe.png',
    badge: 'Bolsa Ativa',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'Programa de Monitoria Acadêmica 2026.1',
    deadline: 'Até 30/04',
  },
];

export function SobrePWASection() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-20 md:py-32 border-b border-[#e5e7eb] dark:border-[#242831]/60 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Lado Esquerdo: Conteúdo Editorial e Ação */}
            <div className="max-w-xl text-center lg:text-left">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#697282] dark:text-[#9aa1ad]">
                FACILITE O ACESSO
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#121417] dark:text-white leading-[1.08]">
                Tenha o Coralink sempre com você
              </h2>

              <p className="mt-5 text-sm sm:text-base md:text-lg text-[#4b5563] dark:text-[#9aa1ad] leading-relaxed">
                Sem filas em lojas de aplicativos e sem ocupar a memória do aparelho. Adicione
                direto à tela inicial do seu celular ou computador para abrir instantaneamente e
                consultar oportunidades mesmo quando faltar internet no campus.
              </p>

              {/* Indicadores Rápidos de Vantagens */}
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start items-center gap-2.5 text-xs font-semibold text-[#4b5563] dark:text-[#9aa1ad]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-1.5 dark:border-[#242831] dark:bg-[#14171f] dark:text-[#d1d5db]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Funciona sem internet
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-1.5 dark:border-[#242831] dark:bg-[#14171f] dark:text-[#d1d5db]">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  Menos de 2 MB
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-1.5 dark:border-[#242831] dark:bg-[#14171f] dark:text-[#d1d5db]">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Abertura instantânea
                </span>
              </div>

              {/* Botão de Ação */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => setIsInstallModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#121417] px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Instalar Aplicativo</span>
                </button>

                <span className="text-xs text-[#697282] dark:text-[#9aa1ad]">
                  Disponível para Android, iPhone e Computadores
                </span>
              </div>
            </div>

            {/* Lado Direito: iPhone 16 Pro com Mini-Feed Interativo */}
            <div className="relative shrink-0 flex items-center justify-center py-4">
              {/* Brilho atmosférico sutil atrás do dispositivo */}
              <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />

              {/* Container Proporcional do iPhone 16 Pro */}
              <div className="relative w-[285px] sm:w-[315px] aspect-[1406/2822] select-none">
                {/* 1. Tela Viva do Mini-Feed (Abaixo da moldura) */}
                <div
                  className="absolute overflow-hidden flex flex-col justify-between bg-[#0a0b0d] text-white"
                  style={{
                    top: '3.54%',
                    bottom: '3.54%',
                    left: '7.25%',
                    right: '6.97%',
                    borderRadius: '40px',
                  }}
                >
                  {/* Topo: Status Bar do iOS + Micro Header do Coralink */}
                  <div className="pt-3 px-4 shrink-0">
                    {/* Status bar */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 px-1">
                      <span>09:41</span>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-2.5 w-2.5" />
                        <Battery className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Espaço para a Dynamic Island que está na camada PNG superior */}
                    <div className="h-5" />

                    {/* Micro Header Coralink */}
                    <div className="mt-1 flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="relative h-4 w-4">
                          <Image
                            src="/coralink-logo.png"
                            alt="Coralink"
                            fill
                            className="object-contain invert"
                          />
                        </div>
                        <span className="font-extrabold text-[11px] tracking-tight">CORALINK</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-stone-300">
                        <Search className="h-2.5 w-2.5 text-stone-400" />
                        <span>Buscar</span>
                      </div>
                    </div>
                  </div>

                  {/* Meio: Mini Carrossel Marquee de Destaques em Loop Contínuo */}
                  <div className="py-2 overflow-hidden shrink-0">
                    <div className="px-4 mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-300">
                          DESTAQUES
                        </span>
                      </div>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    {/* Trilho Contínuo Infinito do Marquee */}
                    <div className="overflow-hidden flex">
                      <div className="flex gap-2 animate-mini-marquee whitespace-nowrap px-2">
                        {[...FEATURED_ITEMS, ...FEATURED_ITEMS].map((item, idx) => (
                          <div
                            key={`mini-featured-${item.institution}-${idx}`}
                            className={`shrink-0 w-36 rounded-xl border ${item.border} bg-[#13161c] p-2 flex flex-col justify-between shadow-xs`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[8px] font-bold text-stone-300 truncate">
                                {item.institution}
                              </span>
                              <span
                                className={`text-[7px] font-extrabold px-1 py-0.2 rounded-sm uppercase ${item.tagBg}`}
                              >
                                {item.tag}
                              </span>
                            </div>
                            <p className="mt-1 text-[9px] font-bold text-white leading-tight truncate">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-[8px] text-stone-400 truncate">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Feed Recente de Oportunidades (Mini Cards) */}
                  <div className="px-3.5 space-y-1.5 overflow-hidden flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-[8px] font-mono uppercase text-stone-400 px-0.5">
                      <span>FEED RECENTE</span>
                      <span className="text-emerald-400 font-bold">AO VIVO</span>
                    </div>

                    {RECENT_ITEMS.map((card) => (
                      <div
                        key={card.title}
                        className="rounded-xl border border-white/10 bg-[#12151c] p-2 flex items-center gap-2 transition-transform hover:scale-[1.01]"
                      >
                        <div className="relative h-6 w-6 shrink-0 rounded-lg overflow-hidden bg-white/5 p-1 border border-white/10 flex items-center justify-center">
                          <Image
                            src={card.logo}
                            alt={card.institution}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[8px] font-bold text-stone-300">
                              {card.institution}
                            </span>
                            <span
                              className={`text-[7px] font-bold px-1 rounded-sm border ${card.badgeColor}`}
                            >
                              {card.badge}
                            </span>
                          </div>
                          <p className="text-[9px] font-semibold text-white truncate leading-tight mt-0.5">
                            {card.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Base: Barra Home Indicator do iOS */}
                  <div className="pb-1.5 pt-1 flex justify-center shrink-0">
                    <div className="h-1 w-24 rounded-full bg-white/30" />
                  </div>
                </div>

                {/* 2. Moldura Fotográfica Transparente do iPhone 16 Pro (Camada Frontal Z-20) */}
                <Image
                  src="/images/iphone-16-pro-frame.png"
                  alt="Moldura iPhone 16 Pro Coralink"
                  fill
                  sizes="(max-width: 640px) 285px, 315px"
                  priority
                  className="pointer-events-none absolute inset-0 z-20 object-contain drop-shadow-2xl"
                />

                {/* 3. Reflexo Sutil de Vidro (Camada Z-30) */}
                <div
                  className="pointer-events-none absolute z-30 overflow-hidden"
                  style={{
                    top: '3.54%',
                    bottom: '3.54%',
                    left: '7.25%',
                    right: '6.97%',
                    borderRadius: '40px',
                  }}
                >
                  <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </>
  );
}
