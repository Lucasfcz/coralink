'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Wifi, Battery, Sparkles } from 'lucide-react';
import { InstallModal } from '@/components/pwa/InstallModal';

export function SobrePWASection() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-20 md:py-28 border-b border-[#e5e7eb] dark:border-[#242831]/60 overflow-hidden">
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

            {/* Lado Direito: Showcase Minimalista de Tela Inicial Mobile */}
            <div className="relative shrink-0 flex items-center justify-center py-4">
              {/* Brilho de profundidade suave */}
              <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />

              {/* Mockup de Celular */}
              <div className="relative w-[280px] sm:w-[300px] h-[460px] rounded-[42px] border-[6px] border-[#1e232d] bg-[#0c0e12] p-3.5 shadow-2xl dark:border-[#242a36] flex flex-col justify-between select-none">
                {/* Topo do Celular: Alto-Falante e Notificação */}
                <div>
                  <div className="mx-auto h-3.5 w-18 rounded-full bg-[#1e232d] dark:bg-[#242a36] mb-2" />

                  {/* Barra de Status */}
                  <div className="flex items-center justify-between px-2 text-[10px] font-bold text-stone-400">
                    <span>14:30</span>
                    <div className="flex items-center gap-1.5">
                      <Wifi className="h-3 w-3" />
                      <Battery className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Widget de Notificação Flutuante */}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        <span>Coralink</span>
                      </div>
                      <span>Agora</span>
                    </div>
                    <p className="text-[11px] font-medium text-stone-200 leading-tight">
                      Novo edital de bolsa publicado na UFPE
                    </p>
                  </div>
                </div>

                {/* Grade de Apps da Tela Inicial: Destaque para o Coralink */}
                <div className="my-auto py-2">
                  <div className="grid grid-cols-4 gap-3 px-1 text-center items-center">
                    {/* App Fictício 1 */}
                    <div className="flex flex-col items-center gap-1 opacity-25">
                      <div className="h-11 w-11 rounded-[14px] bg-stone-700" />
                      <span className="text-[9px] text-stone-400">Email</span>
                    </div>

                    {/* Ícone Hero do Coralink (Squircle Arredondado) */}
                    <div className="col-span-2 flex flex-col items-center gap-1.5 scale-105">
                      <div className="relative h-16 w-16 overflow-hidden rounded-[20px] bg-white p-2 shadow-xl ring-2 ring-emerald-500/40 transition-transform hover:scale-105">
                        <Image
                          src="/icons/icon-512x512.png"
                          alt="Ícone do Coralink"
                          width={64}
                          height={64}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-white tracking-wide">Coralink</span>
                    </div>

                    {/* App Fictício 2 */}
                    <div className="flex flex-col items-center gap-1 opacity-25">
                      <div className="h-11 w-11 rounded-[14px] bg-stone-700" />
                      <span className="text-[9px] text-stone-400">Notas</span>
                    </div>
                  </div>
                </div>

                {/* Dock Inferior do Celular */}
                <div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md flex justify-around items-center">
                    <div className="h-8 w-8 rounded-xl bg-stone-700/60" />
                    <div className="h-8 w-8 rounded-xl bg-stone-700/60" />
                    <div className="h-8 w-8 rounded-xl bg-stone-700/60" />
                    <div className="h-8 w-8 rounded-xl bg-stone-700/60" />
                  </div>
                  {/* Barra Home */}
                  <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-white/30" />
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
