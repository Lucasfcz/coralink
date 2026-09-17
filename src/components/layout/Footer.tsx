'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#e5e7eb] bg-white py-12 dark:border-[#242831] dark:bg-[#0a0b0d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#f1f3f6] dark:border-[#242831]">
          {/* Logo & Manifesto */}
          <div className="flex flex-col gap-2 max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#e5e7eb] p-1.5 shadow-sm dark:bg-[#15181e] dark:border-[#242831]">
                <Image
                  src="/coralink-logo.png"
                  alt="Coralink Logo"
                  width={28}
                  height={28}
                  className="object-contain dark:invert"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#121417] dark:text-white">
                CORALINK
              </span>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed dark:text-[#9aa1ad]">
              Ecossistema inteligente que monitora, filtra e conecta universitários e recém-formados às melhores oportunidades acadêmicas e de tecnologia.
            </p>
          </div>

          {/* Quick links & Back to Top */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#4b5563] dark:text-[#9aa1ad]">
            <Link
              href="/sobre"
              className="hover:text-[#121417] dark:hover:text-white transition-colors"
            >
              Sobre o Coralink
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-1.5 hover:border-[#121417] hover:text-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:hover:border-stone-500 dark:hover:text-white"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Copyright & Links Legais */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9aa1ad] dark:text-[#697282]">
          <p>© {new Date().getFullYear()} Coralink. Todos os direitos reservados.</p>
          <div className="flex items-center gap-3 font-medium">
            <Link
              href="/termos-de-uso"
              className="hover:text-[#121417] dark:hover:text-white transition-colors"
            >
              Termos de Uso
            </Link>
            <span>•</span>
            <Link
              href="/politica-de-privacidade"
              className="hover:text-[#121417] dark:hover:text-white transition-colors"
            >
              Política de Privacidade
            </Link>
          </div>
          <p>Feito com foco em design editorial e inteligência artificial.</p>
        </div>
      </div>
    </footer>
  );
}
