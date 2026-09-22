'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Smartphone, WifiOff, Zap, ShieldCheck } from 'lucide-react';
import { InstallModal } from '@/components/pwa/InstallModal';

export function SobrePWASection() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-16 md:py-24 border-b border-[#e5e7eb] dark:border-[#242831]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-gradient-to-b from-[#f8f9fa] to-white p-8 sm:p-12 md:p-16 dark:border-[#242831] dark:from-[#0e1117] dark:to-[#0a0b0d]">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/15" />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left Column: Text & CTA */}
              <div className="max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-400">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>PROGRESSIVE WEB APP • ACESSO DIRETO</span>
                </div>

                <h3 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#121417] dark:text-white">
                  Facilite o acesso. <br className="hidden sm:inline" />
                  Coralink sempre à mão no seu celular.
                </h3>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#4b5563] dark:text-[#9aa1ad]">
                  Instale o Coralink diretamente na tela inicial do seu celular ou computador como um
                  Progressive Web App (PWA). Sem depender de lojas de aplicativos, sem consumir a
                  memória do aparelho e com navegação garantida até quando a internet do campus oscilar.
                </p>

                {/* Micro-features grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="rounded-2xl border border-[#e5e7eb] bg-white/70 p-4 backdrop-blur-xs dark:border-[#242831] dark:bg-[#14171f]/70">
                    <Zap className="h-5 w-5 text-amber-500 mb-2" />
                    <h4 className="text-xs font-bold text-[#121417] dark:text-white">Sem Lojas de Apps</h4>
                    <p className="mt-1 text-[11px] text-[#64748b] dark:text-[#9aa1ad] leading-tight">
                      Instale em 1 toque sem filas de download ou cadastros pesados.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5e7eb] bg-white/70 p-4 backdrop-blur-xs dark:border-[#242831] dark:bg-[#14171f]/70">
                    <WifiOff className="h-5 w-5 text-emerald-500 mb-2" />
                    <h4 className="text-xs font-bold text-[#121417] dark:text-white">Acesso Offline</h4>
                    <p className="mt-1 text-[11px] text-[#64748b] dark:text-[#9aa1ad] leading-tight">
                      Editais e oportunidades abertas continuam salvos no cache.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#e5e7eb] bg-white/70 p-4 backdrop-blur-xs dark:border-[#242831] dark:bg-[#14171f]/70">
                    <ShieldCheck className="h-5 w-5 text-sky-500 mb-2" />
                    <h4 className="text-xs font-bold text-[#121417] dark:text-white">Menos de 2 MB</h4>
                    <p className="mt-1 text-[11px] text-[#64748b] dark:text-[#9aa1ad] leading-tight">
                      Atualizações silenciosas e economia total de dados móveis.
                    </p>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    type="button"
                    onClick={() => setIsInstallModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#121417] px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Instalar Aplicativo</span>
                  </button>

                  <span className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
                    Disponível para Android, iPhone e Computadores
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Card Preview with Icon */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative group p-6 rounded-[28px] border border-[#e5e7eb] bg-white shadow-xl dark:border-[#242831] dark:bg-[#151820]">
                  <div className="relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-inner dark:border-[#2a303c] dark:bg-[#1b1f28]">
                    <Image
                      src="/icons/icon-512x512.png"
                      alt="Aplicativo Coralink"
                      width={160}
                      height={160}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="font-extrabold text-sm tracking-tight text-[#121417] dark:text-white">
                      Coralink App
                    </span>
                    <p className="text-[11px] text-[#64748b] dark:text-[#9aa1ad]">v1.0 • PWA</p>
                  </div>
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
