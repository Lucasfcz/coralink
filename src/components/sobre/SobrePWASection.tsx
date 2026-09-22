'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { InstallModal } from '@/components/pwa/InstallModal';

export function SobrePWASection() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-16 md:py-24 border-b border-[#e5e7eb] dark:border-[#242831]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 px-8 sm:px-12 rounded-[28px] border border-[#e5e7eb] dark:border-[#242831] bg-[#f8f9fa] dark:bg-[#0e1117] transition-all">
            <div className="max-w-2xl">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#697282] dark:text-[#9aa1ad]">
                FACILITE O ACESSO
              </span>

              <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
                Tenha o Coralink sempre com você
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4b5563] dark:text-[#9aa1ad]">
                Adicione o Coralink direto à tela inicial do seu celular ou computador para abrir como
                aplicativo. Inicialização rápida, sem ocupar espaço da memória do aparelho e com
                consulta aos editais mesmo sem conexão com a internet.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsInstallModalOpen(true)}
                  className="inline-flex items-center gap-3 rounded-full bg-[#121417] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Instalar Aplicativo</span>
                </button>

                <span className="text-xs text-[#697282] dark:text-[#9aa1ad]">
                  Disponível para Android, iPhone e Computadores
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#e5e7eb] bg-white shadow-md transition-transform hover:scale-105 dark:border-[#242831]">
                <Image
                  src="/icons/icon-512x512.png"
                  alt="Ícone do Coralink"
                  width={112}
                  height={112}
                  className="h-full w-full object-contain p-2"
                />
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
