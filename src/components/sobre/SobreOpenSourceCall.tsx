'use client';

import { ExternalLink } from 'lucide-react';

export function SobreOpenSourceCall() {
  return (
    <section className="relative py-16 md:py-24 border-b border-[#e5e7eb] dark:border-[#242831]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 px-8 sm:px-12 rounded-[28px] border border-[#e5e7eb] dark:border-[#242831] bg-[#f8f9fa] dark:bg-[#0e1117] transition-all">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#697282] dark:text-[#9aa1ad]">
              COMUNIDADE ABERTA
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              Construído por estudantes, aberto para Pernambuco
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4b5563] dark:text-[#9aa1ad]">
              O Coralink é uma iniciativa colaborativa de código aberto. Se você é desenvolvedor e quer
              ajudar a expandir a plataforma ou adicionar novos coletores para o seu centro acadêmico,
              participe do projeto no GitHub.
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <a
              href="https://github.com/Lucasfcz/coralinkAPI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#121417] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Ver Código no GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
