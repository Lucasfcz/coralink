'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WifiOff, RotateCcw, Home } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#fbfbfb] text-[#121417] dark:bg-[#0a0b0d] dark:text-[#f3f4f6]">
      <div className="w-full max-w-md text-center p-8 rounded-3xl border border-[#e5e7eb] bg-white shadow-xl dark:border-[#242831] dark:bg-[#12151b]">
        {/* Logo & Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 p-3 dark:bg-[#1a1e27]">
            <Image
              src="/coralink-logo.png"
              alt="Coralink"
              width={48}
              height={48}
              className="object-contain dark:invert"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-4">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Sem conexão à internet</span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-[#121417] dark:text-white mb-2">
          Você está offline
        </h1>

        <p className="text-sm text-[#4b5563] dark:text-[#9aa1ad] mb-8 leading-relaxed">
          Não se preocupe: os editais e oportunidades que você já carregou anteriormente continuam
          armazenados no seu dispositivo. Assim que o sinal voltar, novas oportunidades serão
          sincronizadas automaticamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#121417] px-4 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-black active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Tentar Novamente</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 text-xs font-bold text-[#121417] transition-all hover:bg-[#f1f3f5] dark:border-[#242831] dark:bg-[#181b22] dark:text-white dark:hover:bg-[#20242d]"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Ir para o Início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
