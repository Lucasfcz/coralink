'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import {
  formatDate,
  getCleanImageUrl,
  getFallbackImageUrl,
  getOpportunityTypeLabel,
  getModalityLabel,
  formatSourceName,
} from '@/lib/utils';
import { InstitutionLogo } from '@/components/common/InstitutionLogo';
import { SafeImage } from '@/components/common/SafeImage';

interface FeaturedCardProps {
  opportunity: Opportunity;
  onSelect: (opportunity: Opportunity) => void;
}

export function FeaturedCard({ opportunity, onSelect }: FeaturedCardProps) {
  const imageUrl = getCleanImageUrl(opportunity.imageUrl, opportunity.id);
  const fallbackUrl = getFallbackImageUrl(opportunity.id);
  const typeLabel = getOpportunityTypeLabel(opportunity.type);
  const modalityLabel = getModalityLabel(opportunity.modality);

  const displayDate = opportunity.startDate
    ? formatDate(opportunity.startDate)
    : opportunity.registrationDeadline
    ? `Inscrições até ${formatDate(opportunity.registrationDeadline)}`
    : 'Inscrições Abertas';

  return (
    <motion.article
      onClick={() => onSelect(opportunity)}
      className="group relative flex flex-col w-[84vw] max-w-[340px] sm:w-[480px] md:w-[520px] shrink-0 cursor-pointer pt-1 pb-6 transition-transform duration-300 hover:-translate-y-1"
    >
      {/* 1. Retângulo Maior: Imagem da Oportunidade (Conforme esboço) */}
      <div className="relative h-[210px] sm:h-[280px] w-full overflow-hidden rounded-[22px] sm:rounded-[28px] border border-[#e5e7eb] bg-[#121417] shadow-sm dark:border-[#242831]">
        <SafeImage
          src={imageUrl}
          fallbackSrc={fallbackUrl}
          alt={opportunity.title}
          fill
          sizes="(max-width: 640px) 340px, (max-width: 768px) 480px, 520px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      </div>

      {/* 2. Retângulo Menor Sobreposto: Título e Informações (Conforme esboço) */}
      <div className="relative -mt-14 sm:-mt-20 mx-3 sm:mx-6 z-10 rounded-[18px] sm:rounded-[22px] border border-white/70 bg-white/92 p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.09)] backdrop-blur-xl transition-all duration-300 group-hover:bg-white group-hover:shadow-xl dark:border-[#2b303a] dark:bg-[#15181e]/95 dark:group-hover:bg-[#181b22] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
        {/* Top row: Badges informativos essenciais da API */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#121417] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-2xs dark:bg-white dark:text-[#121417]">
            {typeLabel}
          </span>
          <span className="text-[#9aa1ad] text-xs">•</span>
          <span className="text-[11px] font-semibold text-[#525866] truncate dark:text-[#9aa1ad]">
            {displayDate}
          </span>
          <span className="text-[#9aa1ad] text-xs">•</span>
          <span className="text-[11px] font-medium text-[#525866] dark:text-[#9aa1ad]">
            {modalityLabel}
          </span>
          {opportunity.isFree && (
            <>
              <span className="text-[#9aa1ad] text-xs">•</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                Gratuito
              </span>
            </>
          )}
        </div>

        {/* Título da Oportunidade */}
        <h3 className="mt-2.5 font-bold text-[17px] sm:text-[19px] leading-snug tracking-tight text-[#121417] line-clamp-2 group-hover:text-black dark:text-[#f3f4f6] dark:group-hover:text-white">
          {opportunity.title}
        </h3>

        {/* Resumo/Descrição Teaser */}
        <p className="mt-1.5 text-xs leading-relaxed text-[#525866] line-clamp-2 dark:text-[#9aa1ad]">
          {opportunity.summary}
        </p>

        {/* Rodapé do card: Instituição e Botão circular de ação */}
        <div className="mt-3.5 flex items-center justify-between border-t border-[#f1f3f6] pt-2.5 dark:border-[#242831]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] truncate max-w-[80%] dark:text-[#9aa1ad]">
            <InstitutionLogo sourceName={opportunity.sourceName} size={22} />
            <span className="truncate text-[#121417] font-semibold dark:text-[#f3f4f6]">{formatSourceName(opportunity.sourceName)}</span>
            {opportunity.location && (
              <span className="text-[#9aa1ad] font-normal truncate hidden sm:inline">
                ({opportunity.location})
              </span>
            )}
          </div>

          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-[#121417] text-white shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-black dark:bg-white dark:text-[#121417] dark:group-hover:bg-white/90">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
