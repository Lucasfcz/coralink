'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Search } from 'lucide-react';
import { InstallModal } from '@/components/pwa/InstallModal';

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
                  {/* Topo: Status Bar Oficial do iOS 18 */}
                  <div className="pt-2 px-4 shrink-0 flex items-center justify-between text-white">
                    {/* Horário 9:41 (Alinhado à esquerda) */}
                    <span className="font-bold text-[10px] tracking-tight pl-1">9:41</span>

                    {/* Espaço central reservado para a Dynamic Island */}
                    <div className="w-[74px] h-[22px]" />

                    {/* Ícones oficiais Apple (Sinal 4 barras, Wi-Fi sólido, Bateria horizontal) */}
                    <div className="flex items-center gap-1.5 pr-1">
                      {/* Sinal celular 4 barras em escada */}
                      <svg className="w-3.5 h-2.5 fill-current" viewBox="0 0 17 12">
                        <rect x="0" y="9" width="2.6" height="3" rx="0.8" />
                        <rect x="4.8" y="6" width="2.6" height="6" rx="0.8" />
                        <rect x="9.6" y="3" width="2.6" height="9" rx="0.8" />
                        <rect x="14.4" y="0" width="2.6" height="12" rx="0.8" />
                      </svg>

                      {/* Wi-Fi 3 arcos concêntricos sólidos */}
                      <svg className="w-3.5 h-2.5 fill-current" viewBox="0 0 16 12">
                        <path d="M8 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3.8-4.2a5.5 5.5 0 017.6 0 .8.8 0 101.1-1.1 7.1 7.1 0 00-9.8 0 .8.8 0 001.1 1.1zm-2.8-2.8a9.5 9.5 0 0113.2 0 .8.8 0 101.1-1.1 11.1 11.1 0 00-15.4 0 .8.8 0 001.1 1.1z" />
                      </svg>

                      {/* Bateria iOS com corpo sólido e polo positivo */}
                      <div className="flex items-center gap-[1px]">
                        <div className="w-[17px] h-[8.5px] rounded-[2.8px] border border-white p-[1px] flex items-center">
                          <div className="h-full w-full bg-white rounded-[1.2px]" />
                        </div>
                        <div className="w-[1.2px] h-[3px] bg-white rounded-r-[0.6px]" />
                      </div>
                    </div>
                  </div>

                  {/* Micro Header Coralink */}
                  <div className="px-3.5 pt-1.5 pb-2 shrink-0 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="relative h-3.5 w-3.5">
                        <Image
                          src="/coralink-logo.png"
                          alt="Coralink"
                          fill
                          className="object-contain invert"
                        />
                      </div>
                      <span className="font-extrabold text-[10.5px] tracking-tight">CORALINK</span>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8.5px] text-stone-300">
                      <Search className="h-2 w-2 text-stone-400" />
                      <span>Buscar...</span>
                    </div>
                  </div>

                  {/* Feed com Cadência Alternada: Hero Amplo + Cards Laterais (Fiel a media_1790115048519.jpg) */}
                  <div className="px-3 py-1.5 space-y-2 overflow-hidden flex-1 flex flex-col justify-between">
                    {/* 1. Card Amplo (Hero com foto de capa e overlay de informações) */}
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#12151c] flex flex-col shadow-xs">
                      {/* Foto de Capa do Campus */}
                      <div className="relative h-19 w-full bg-stone-900">
                        <Image
                          src="/images/auth-visual.jpg"
                          alt="Campus IFPE"
                          fill
                          className="object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>

                      {/* Conteúdo Informativo */}
                      <div className="p-2">
                        {/* Linha de Tags */}
                        <div className="flex items-center gap-1">
                          <span className="bg-black/80 px-1 py-0.2 rounded-xs text-[7px] font-black uppercase text-white tracking-wider">
                            EVENTO
                          </span>
                          <span className="text-stone-500 text-[7px]">•</span>
                          <div className="flex items-center gap-0.5">
                            <Image
                              src="/institutions/ifpe.png"
                              alt="IFPE"
                              width={10}
                              height={10}
                              className="object-contain"
                            />
                            <span className="text-[7.5px] font-bold text-stone-300">IFPE</span>
                          </div>
                          <span className="text-stone-500 text-[7px]">•</span>
                          <span className="bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded-xs text-[7px] font-bold">
                            Gratuito
                          </span>
                        </div>

                        {/* Título do Edital */}
                        <p className="mt-1 text-[8.5px] font-bold text-white leading-snug line-clamp-2">
                          IFPE Recife prorroga prazo de submissão de atividades e trabalhos para a 23ª SNCT – 2026
                        </p>

                        {/* Rodapé com Prazo Vermelho e Botão de Ação Circular */}
                        <div className="mt-1.5 flex items-center justify-between border-t border-white/5 pt-1">
                          <span className="text-[7.5px] font-bold text-rose-400">
                            Termina hoje
                          </span>
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black shadow-xs">
                            <span className="text-[8px] font-bold leading-none">→</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Sub-cabeçalho de Atualizações Recentes */}
                    <div className="flex items-center justify-between text-[7.5px] font-mono uppercase text-stone-400 px-0.5">
                      <span>ATUALIZAÇÕES DE IFPE E UPE</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                        AO VIVO
                      </span>
                    </div>

                    {/* 3. Cards Laterais Compactos (Foto quadrada na esquerda + texto na direita) */}
                    <div className="space-y-1.5">
                      {/* Card Lateral 1: Graduação IFPE */}
                      <div className="rounded-xl border border-white/10 bg-[#12151c] p-1.5 flex items-center gap-2">
                        {/* Imagem Lateral Quadrada */}
                        <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-stone-800">
                          <Image
                            src="/images/recife-cais-day.jpg"
                            alt="Seleção IFPE"
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Conteúdo Textual */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[7px] font-medium text-stone-400">Graduação</span>
                            <span className="text-stone-600 text-[6px]">•</span>
                            <span className="text-[7px] font-bold text-stone-300">IFPE</span>
                          </div>
                          <p className="text-[8px] font-semibold text-white truncate leading-tight mt-0.5">
                            Inscrições abertas para seleção de portadores de diploma...
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[7px] font-bold text-rose-400">Termina amanhã</span>
                            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 text-white">
                              <span className="text-[7px] font-bold leading-none">→</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Lateral 2: Evento UPE */}
                      <div className="rounded-xl border border-white/10 bg-[#12151c] p-1.5 flex items-center gap-2">
                        {/* Imagem Lateral Quadrada */}
                        <div className="relative h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-stone-800">
                          <Image
                            src="/images/coralink-editorial-hero.jpg"
                            alt="Semana Universitária UPE"
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Conteúdo Textual */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[7px] font-medium text-stone-400">Evento</span>
                            <span className="text-stone-600 text-[6px]">•</span>
                            <span className="text-[7px] font-bold text-stone-300">UPE</span>
                          </div>
                          <p className="text-[8px] font-semibold text-white truncate leading-tight mt-0.5">
                            Semana Universitária UPE 2026 prorroga inscrições...
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[7px] font-bold text-rose-400">3 dias restantes</span>
                            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/10 text-white">
                              <span className="text-[7px] font-bold leading-none">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Base: Barra Home Indicator do iOS */}
                  <div className="pb-1.5 pt-1 flex justify-center shrink-0">
                    <div className="h-1 w-20 rounded-full bg-white/30" />
                  </div>
                </div>

                {/* 2. Moldura Fotográfica Transparente do iPhone 16 Pro (Camada Z-20) */}
                <Image
                  src="/images/iphone-16-pro-frame.png"
                  alt="Moldura iPhone 16 Pro Coralink"
                  fill
                  sizes="(max-width: 640px) 285px, 315px"
                  priority
                  className="pointer-events-none absolute inset-0 z-20 object-contain drop-shadow-2xl"
                />

                {/* 3. Dynamic Island Sólida Matte Black (Camada Z-30 que veda qualquer reflexo estranho da lente) */}
                <div
                  className="pointer-events-none absolute z-30 bg-black rounded-full shadow-inner"
                  style={{
                    top: '5.03%',
                    left: '50.07%',
                    width: '26.6%',
                    height: '3.9%',
                    transform: 'translateX(-50%)',
                  }}
                />

                {/* 4. Reflexo Sutil de Vidro (Camada Z-35) */}
                <div
                  className="pointer-events-none absolute z-35 overflow-hidden"
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
