import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

export default function OpportunityDetailLoading() {
  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#121417] transition-colors duration-200 dark:bg-[#0a0b0d] dark:text-[#f3f4f6]">
      {/* Header Padronizada */}
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navegação Superior: Voltar ao Feed e Breadcrumbs Skeleton */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-semibold text-[#121417] shadow-xs dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6]">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao feed</span>
          </div>

          <div
            aria-hidden="true"
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#64748b] dark:text-[#9aa1ad]"
          >
            <span>Início</span>
            <span>/</span>
            <span>Feed</span>
            <span>/</span>
            <div className="h-3.5 w-36 rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
          </div>
        </div>

        {/* Artigo da Oportunidade */}
        <article className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#242831] dark:bg-[#15181e]">
          {/* Banner Hero Skeleton */}
          <div className="relative h-64 sm:h-80 md:h-[420px] w-full overflow-hidden rounded-t-3xl bg-[#121417] animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badges Flutuantes sobre a Imagem */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2.5">
              <div className="h-6 w-24 rounded-full bg-white/30 backdrop-blur-md animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-white/20 backdrop-blur-md animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-white/20 backdrop-blur-md animate-pulse" />
            </div>
          </div>

          {/* Cabeçalho Editorial com Instituição */}
          <div className="border-b border-[#f1f3f6] p-6 sm:p-8 md:p-10 dark:border-[#242831]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Logo Institucional Skeleton */}
                <div className="h-11 w-11 shrink-0 rounded-xl bg-[#e5e7eb] dark:bg-[#20242b] animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-28 rounded bg-[#f1f3f6] dark:bg-[#1c2027] animate-pulse" />
                    <div className="h-3.5 w-20 rounded bg-[#f1f3f6] dark:bg-[#1c2027] animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Status do Prazo */}
              <div className="h-9 w-36 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#242831] dark:bg-[#181b22] animate-pulse" />
            </div>

            {/* Bloco de Título Principal */}
            <div className="mt-6 space-y-3">
              <div className="h-8 sm:h-9 md:h-10 w-4/5 rounded-xl bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
              <div className="h-8 sm:h-9 md:h-10 w-3/5 rounded-xl bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
            </div>

            {/* Área de Conhecimento */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-7 w-44 rounded-xl bg-[#f1f3f6] dark:bg-[#20242b] animate-pulse" />
            </div>
          </div>

          {/* Grid de 2 Colunas: Conteúdo Principal + Barra Fixa Lateral */}
          <div className="grid grid-cols-1 gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-3">
            {/* Coluna Principal (2 colunas) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resumo Executivo em Destaque */}
              <div className="rounded-2xl border-l-4 border-[#121417] bg-[#f8f9fa] p-5 dark:border-white dark:bg-[#181b22]">
                <div className="h-3 w-20 rounded bg-[#e5e7eb] dark:bg-[#2b303a] animate-pulse" />
                <div className="mt-3 space-y-2.5">
                  <div className="h-4 w-full rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  <div className="h-4 w-[96%] rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  <div className="h-4 w-[88%] rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  <div className="h-4 w-[65%] rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                </div>
              </div>

              {/* Informações Estruturadas de Datas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#e5e7eb] p-4.5 bg-white dark:border-[#242831] dark:bg-[#181b22]">
                  <div className="h-3.5 w-36 rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  <div className="mt-2 h-4 w-44 rounded bg-[#e5e7eb] dark:bg-[#2b303a] animate-pulse" />
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] p-4.5 bg-white dark:border-[#242831] dark:bg-[#181b22]">
                  <div className="h-3.5 w-36 rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  <div className="mt-2 h-4 w-40 rounded bg-[#e5e7eb] dark:bg-[#2b303a] animate-pulse" />
                </div>
              </div>

              {/* Público-Alvo e Cursos Elegíveis */}
              <div className="rounded-2xl border border-[#e5e7eb] p-6 bg-white dark:border-[#242831] dark:bg-[#181b22]">
                <div className="h-4 w-48 rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                <div className="mt-2 h-3 w-80 max-w-full rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-7 w-32 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#2b303a] dark:bg-[#20242b] animate-pulse" />
                  <div className="h-7 w-40 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#2b303a] dark:bg-[#20242b] animate-pulse" />
                  <div className="h-7 w-28 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#2b303a] dark:bg-[#20242b] animate-pulse" />
                  <div className="h-7 w-36 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#2b303a] dark:bg-[#20242b] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Coluna Lateral: Card Fixo de Ação */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-6 dark:border-[#242831] dark:bg-[#181b22]">
                <div className="h-3 w-20 rounded bg-[#e5e7eb] dark:bg-[#2b303a] animate-pulse" />

                {/* Botão Principal: Acessar Edital Oficial */}
                <div className="h-12 w-full rounded-2xl bg-[#121417] dark:bg-white animate-pulse" />

                {/* Botão Secundário: Compartilhar */}
                <div className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white dark:border-[#2b303a] dark:bg-[#20242b] animate-pulse" />

                {/* Garantia de Fonte Verificada */}
                <div className="border-t border-[#e5e7eb] pt-4 dark:border-[#242831] space-y-2">
                  <div className="h-3.5 w-36 rounded bg-[#e5e7eb] dark:bg-[#2b303a] animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-full rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
                    <div className="h-3 w-4/5 rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Seção de Oportunidades Relacionadas */}
        <section className="mt-16 border-t border-[#e5e7eb] pt-10 dark:border-[#242831]">
          <div className="mb-6 space-y-2">
            <div className="h-6 w-56 rounded-md bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
            <div className="h-3.5 w-80 max-w-full rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
          </div>

          {/* Grid Bento de 3 cards skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={`skeleton-related-${item}`}
                className="flex flex-col justify-between w-full overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white p-5 sm:p-6 shadow-sm dark:border-[#242831] dark:bg-[#15181e]"
              >
                <div>
                  {/* Header Tags */}
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-20 rounded-full bg-[#f1f3f6] dark:bg-[#20242b] animate-pulse" />
                    <div className="h-5 w-16 rounded-full bg-[#f1f3f6] dark:bg-[#20242b] animate-pulse" />
                  </div>

                  {/* Title */}
                  <div className="mt-3 space-y-2">
                    <div className="h-5 w-4/5 rounded-md bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                    <div className="h-5 w-3/5 rounded-md bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                  </div>

                  {/* Framed Media Preview */}
                  <div className="mt-4 h-48 sm:h-56 w-full rounded-2xl bg-[#f1f3f6] dark:bg-[#20242b] animate-pulse" />

                  {/* Excerpt */}
                  <div className="mt-3 space-y-1.5">
                    <div className="h-3.5 w-full rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
                    <div className="h-3.5 w-5/6 rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-[#f1f3f6] pt-3.5 dark:border-[#242831]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-[#e5e7eb] dark:bg-[#20242b] animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-24 rounded bg-[#e5e7eb] dark:bg-[#242831] animate-pulse" />
                      <div className="h-3 w-16 rounded bg-[#f1f3f6] dark:bg-[#1e222b] animate-pulse" />
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#2b303a] dark:bg-[#1c2027] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Rodapé Padronizado */}
      <Footer />
    </div>
  );
}
