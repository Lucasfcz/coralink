'use client';

import { useState } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  ShieldCheck,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import {
  formatDate,
  formatDeadlineBadge,
  getCleanImageUrl,
  getFallbackImageUrl,
  getOpportunityTypeLabel,
  getModalityLabel,
  formatSourceName,
  formatTargetAudience,
} from '@/lib/utils';
import { InstitutionLogo } from '@/components/common/InstitutionLogo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BentoCard } from '@/components/feed/BentoCard';
import { OpportunityModal } from '@/components/modal/OpportunityModal';

import { ShareModal } from '@/components/common/ShareModal';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  relatedOpportunities: Opportunity[];
}

export function OpportunityDetailView({
  opportunity,
  relatedOpportunities,
}: OpportunityDetailViewProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedRelated, setSelectedRelated] = useState<Opportunity | null>(null);

  const imageUrl = getCleanImageUrl(opportunity.imageUrl, opportunity.id);
  const deadlineBadge = formatDeadlineBadge(opportunity.registrationDeadline);
  const typeLabel = getOpportunityTypeLabel(opportunity.type);
  const modalityLabel = getModalityLabel(opportunity.modality);
  const formattedSource = formatSourceName(opportunity.sourceName);

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#121417] transition-colors duration-200 dark:bg-[#0a0b0d] dark:text-[#f3f4f6]">
      {/* Header Padronizada */}
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navegação Superior: Voltar ao Feed e Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/#feed"
            className="group inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-semibold text-[#121417] shadow-xs transition-all hover:border-[#121417] hover:bg-[#121417] hover:text-white dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6] dark:hover:border-white dark:hover:bg-white dark:hover:text-[#121417]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Voltar ao feed</span>
          </Link>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#64748b] dark:text-[#9aa1ad]">
            <Link href="/" className="hover:text-[#121417] dark:hover:text-white">Início</Link>
            <span>/</span>
            <Link href="/#feed" className="hover:text-[#121417] dark:hover:text-white">Feed</Link>
            <span>/</span>
            <span className="text-[#121417] font-semibold truncate max-w-[280px] dark:text-white">
              {opportunity.title}
            </span>
          </nav>
        </div>

        {/* Artigo da Oportunidade */}
        <article className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#242831] dark:bg-[#15181e]">
          {/* Banner de Mídia em Alta Resolução */}
          <div className="relative h-64 sm:h-80 md:h-[420px] w-full overflow-hidden bg-[#121417]">
            <SafeImage
              src={imageUrl}
              fallbackSrc={getFallbackImageUrl(opportunity.id)}
              alt={opportunity.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badges Flutuantes sobre a Imagem */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#121417] shadow-sm dark:bg-[#121417] dark:text-white">
                {typeLabel}
              </span>
              <span className="rounded-full bg-black/60 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                {modalityLabel}
              </span>
              {opportunity.isFree && (
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Gratuito
                </span>
              )}
              {opportunity.isForAll && (
                <span className="rounded-full bg-indigo-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Aberto a Todos
                </span>
              )}
            </div>
          </div>

          {/* Cabeçalho Editorial com Instituição */}
          <div className="border-b border-[#f1f3f6] p-6 sm:p-8 md:p-10 dark:border-[#242831]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <InstitutionLogo sourceName={opportunity.sourceName} size={44} />
                <div>
                  <h3 className="text-sm font-bold text-[#121417] dark:text-[#f3f4f6]">
                    {formattedSource}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#64748b] dark:text-[#9aa1ad]">
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] font-semibold dark:bg-emerald-950/40 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" /> Verificado por IA
                    </span>
                    {opportunity.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#9aa1ad]" />
                          {opportunity.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status do Prazo */}
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-2 text-xs font-semibold dark:border-[#242831] dark:bg-[#181b22]">
                <Clock className="h-4 w-4 text-[#9aa1ad]" />
                <span className={deadlineBadge.isUrgent ? 'text-rose-600 font-bold dark:text-rose-400' : 'text-[#121417] dark:text-[#f3f4f6]'}>
                  {deadlineBadge.label}
                </span>
              </div>
            </div>

            {/* Título Principal */}
            <h1 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-[#121417] dark:text-white">
              {opportunity.title}
            </h1>

            {/* Área de Conhecimento diretamente abaixo do título */}
            {opportunity.thematicArea && (
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-xl bg-[#f1f3f6] px-3.5 py-1.5 text-xs font-bold text-[#121417] dark:bg-[#20242b] dark:text-[#f3f4f6]">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Área: {opportunity.thematicArea}</span>
                </span>
              </div>
            )}
          </div>

          {/* Grid de 2 Colunas: Conteúdo Principal + Barra Fixa Lateral */}
          <div className="grid grid-cols-1 gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-3">
            {/* Coluna Principal (2 colunas) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resumo Executivo em Destaque */}
              <div className="rounded-2xl border-l-4 border-[#121417] bg-[#f8f9fa] p-5 dark:border-white dark:bg-[#181b22]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                  Visão Geral
                </h4>
                <p className="mt-2 text-base leading-relaxed text-[#121417] font-medium dark:text-[#f3f4f6]">
                  {opportunity.summary}
                </p>
              </div>

              {/* Informações Estruturadas de Datas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#e5e7eb] p-4.5 bg-white dark:border-[#242831] dark:bg-[#181b22]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
                    <Calendar className="h-4 w-4 text-[#9aa1ad]" />
                    <span>Período do Evento / Início</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-[#121417] dark:text-white">
                    {opportunity.startDate ? formatDate(opportunity.startDate) : 'Data flexível ou a definir'}
                    {opportunity.endDate && ` até ${formatDate(opportunity.endDate)}`}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5e7eb] p-4.5 bg-white dark:border-[#242831] dark:bg-[#181b22]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
                    <Clock className="h-4 w-4 text-[#9aa1ad]" />
                    <span>Término das Inscrições</span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-[#121417] dark:text-white">
                    {opportunity.registrationDeadline
                      ? formatDate(opportunity.registrationDeadline)
                      : 'Inscrições em fluxo contínuo'}
                  </p>
                </div>
              </div>

              {/* Público-Alvo e Cursos Elegíveis */}
              {opportunity.targetCourseAudiences && opportunity.targetCourseAudiences.length > 0 && (
                <div className="rounded-2xl border border-[#e5e7eb] p-6 bg-white dark:border-[#242831] dark:bg-[#181b22]">
                  <h3 className="text-sm font-bold text-[#121417] dark:text-white">
                    Público-Alvo e Cursos Elegíveis
                  </h3>
                  <p className="mt-1 text-xs text-[#64748b] dark:text-[#9aa1ad]">
                    Estudantes matriculados ou graduados nas seguintes áreas possuem elegibilidade prioritária:
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {opportunity.targetCourseAudiences.map((aud) => (
                      <span
                        key={aud}
                        className="rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-1.5 text-xs font-medium text-[#121417] dark:border-[#2b303a] dark:bg-[#20242b] dark:text-[#f3f4f6]"
                      >
                        {formatTargetAudience(aud)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Coluna Lateral: Card Fixo de Ação (Sticky Sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-6 dark:border-[#242831] dark:bg-[#181b22]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                  Ação Oficial
                </h4>

                {/* Botão Principal: Acessar Edital Oficial */}
                <a
                  href={opportunity.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#121417] py-3.5 px-4 text-xs font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <span>Acessar Edital / Inscrição</span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                {/* Botão de Compartilhar Oportunidade */}
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white py-3 px-4 text-xs font-semibold text-[#121417] shadow-2xs transition-all hover:bg-[#f1f3f6] dark:border-[#2b303a] dark:bg-[#20242b] dark:text-white dark:hover:bg-[#262c36]"
                >
                  <Share2 className="h-4 w-4 text-[#64748b] dark:text-[#9aa1ad]" />
                  <span>Compartilhar oportunidade</span>
                </button>

                {/* Garantia de Fonte Verificada */}
                <div className="border-t border-[#e5e7eb] pt-4 text-[11px] text-[#64748b] leading-relaxed dark:border-[#242831] dark:text-[#9aa1ad]">
                  <div className="flex items-center gap-1.5 font-semibold text-[#121417] dark:text-white mb-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Fonte Oficial Monitorada</span>
                  </div>
                  Esta oportunidade foi capturada e processada diretamente dos canais públicos de {formattedSource}. Todos os links redirecionam para o domínio institucional oficial.
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Seção de Oportunidades Relacionadas */}
        {relatedOpportunities.length > 0 && (
          <section className="mt-16 border-t border-[#e5e7eb] pt-10 dark:border-[#242831]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#121417] dark:text-white">
                  Oportunidades Relacionadas
                </h2>
                <p className="mt-1 text-xs text-[#64748b] dark:text-[#9aa1ad]">
                  Editais e eventos de mesmo formato ou da mesma instituição que podem te interessar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedOpportunities.slice(0, 3).map((item) => (
                <BentoCard
                  key={`related-${item.id}`}
                  opportunity={item}
                  variant="editorial"
                  onSelect={(opp) => setSelectedRelated(opp)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal de Preview para itens relacionados */}
      {selectedRelated && (
        <OpportunityModal
          opportunity={selectedRelated}
          onClose={() => setSelectedRelated(null)}
        />
      )}

      {/* Modal Padronizado de Compartilhamento */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        opportunity={{
          id: opportunity.id,
          title: opportunity.title,
          sourceName: opportunity.sourceName,
          url: opportunity.officialUrl,
        }}
      />

      {/* Rodapé Padronizado */}
      <Footer />
    </div>
  );
}
