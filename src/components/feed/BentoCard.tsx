'use client';

import { motion } from 'framer-motion';
import { SafeImage } from '@/components/common/SafeImage';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import {
  formatDeadlineBadge,
  getCleanImageUrl,
  getFallbackImageUrl,
  getOpportunityTypeLabel,
  getModalityLabel,
  formatSourceName,
} from '@/lib/utils';
import { InstitutionLogo } from '@/components/common/InstitutionLogo';

interface BentoCardProps {
  opportunity: Opportunity;
  variant?: 'hero' | 'stacked' | 'editorial';
  onSelect: (opportunity: Opportunity) => void;
}

export function BentoCard({
  opportunity,
  variant = 'editorial',
  onSelect,
}: BentoCardProps) {
  const imageUrl = getCleanImageUrl(opportunity.imageUrl, opportunity.id);
  const fallbackUrl = getFallbackImageUrl(opportunity.id);
  const deadlineBadge = formatDeadlineBadge(opportunity.registrationDeadline);
  const typeLabel = getOpportunityTypeLabel(opportunity.type);
  const modalityLabel = getModalityLabel(opportunity.modality);
  const formattedSource = formatSourceName(opportunity.sourceName);

  // 1. VARIANT: HERO (Card Amplo com overlay flutuante inferior)
  if (variant === 'hero') {
    return (
      <motion.article
        onClick={() => onSelect(opportunity)}
        className="group relative min-h-[420px] sm:min-h-[480px] w-full cursor-pointer overflow-hidden rounded-3xl border border-[#e5e7eb] bg-[#121417] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl lg:col-span-2 dark:border-[#242831] will-change-transform"
      >
        <div className="relative h-full w-full min-h-[420px] sm:min-h-[480px] overflow-hidden">
          <SafeImage
            src={imageUrl}
            fallbackSrc={fallbackUrl}
            alt={opportunity.title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Floating Glassmorphism overlay */}
        <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-white/60 bg-white/92 p-5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:bg-white dark:border-[#2b303a] dark:bg-[#15181e]/95 dark:group-hover:bg-[#181b22]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#121417] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white dark:bg-white dark:text-[#121417]">
              {typeLabel}
            </span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <div className="flex items-center gap-1.5">
              <InstitutionLogo sourceName={opportunity.sourceName} size={20} />
              <span className="text-xs font-semibold text-[#121417] dark:text-[#f3f4f6]">
                {formattedSource}
              </span>
            </div>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="text-xs font-medium text-[#64748b] dark:text-[#9aa1ad]">
              {modalityLabel}
            </span>
            {opportunity.isFree && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                Gratuito
              </span>
            )}
          </div>

          <h3 className="mt-3 font-bold text-xl sm:text-2xl leading-snug tracking-tight text-[#121417] line-clamp-2 dark:text-[#f3f4f6]">
            {opportunity.title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-[#525866] line-clamp-2 dark:text-[#9aa1ad]">
            {opportunity.summary}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-[#f1f3f6] pt-3 dark:border-[#242831]">
            <div className="flex items-center gap-4 text-xs text-[#64748b] dark:text-[#9aa1ad]">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-[#9aa1ad]" />
                <span className={deadlineBadge.isUrgent ? 'font-semibold text-rose-600 dark:text-rose-400' : ''}>
                  {deadlineBadge.label}
                </span>
              </span>
              {opportunity.location && (
                <span className="hidden sm:flex items-center gap-1.5 text-[#64748b] truncate max-w-[200px] dark:text-[#9aa1ad]">
                  <MapPin className="h-4 w-4 text-[#9aa1ad]" />
                  <span className="truncate">{opportunity.location}</span>
                </span>
              )}
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#121417] text-white shadow transition-transform group-hover:scale-110 dark:bg-white dark:text-[#121417]">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // 2. VARIANT: STACKED (Cards compactos empilhados)
  if (variant === 'stacked') {
    return (
      <motion.article
        onClick={() => onSelect(opportunity)}
        className="group flex flex-col sm:flex-row h-full w-full cursor-pointer overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#d1d5db] hover:shadow-lg dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-stone-600 will-change-transform"
      >
        <div className="relative h-44 sm:h-auto sm:w-44 shrink-0 overflow-hidden rounded-2xl bg-[#f1f3f6] dark:bg-[#20242b]">
          <SafeImage
            src={imageUrl}
            fallbackSrc={fallbackUrl}
            alt={opportunity.title}
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between pt-3 sm:pt-0 sm:pl-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InstitutionLogo sourceName={opportunity.sourceName} size={20} />
                <span className="rounded-full bg-[#f1f3f6] px-2 py-0.5 text-[10px] font-bold text-[#121417] dark:bg-[#20242b] dark:text-[#f3f4f6]">
                  {typeLabel}
                </span>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="text-[11px] font-semibold text-[#121417] dark:text-[#f3f4f6]">
                  {formattedSource}
                </span>
              </div>
            </div>

            <h4 className="mt-2 font-bold text-base leading-snug tracking-tight text-[#121417] line-clamp-2 group-hover:text-black dark:text-[#f3f4f6] dark:group-hover:text-white">
              {opportunity.title}
            </h4>

            <p className="mt-1 text-xs text-[#64748b] line-clamp-2 dark:text-[#9aa1ad]">
              {opportunity.summary}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#f1f3f6] pt-2 dark:border-[#242831]">
            <span className="text-[11px] font-medium text-[#64748b] dark:text-[#9aa1ad]">
              <span className={deadlineBadge.isUrgent ? 'font-semibold text-rose-600 dark:text-rose-400' : ''}>
                {deadlineBadge.label}
              </span>
            </span>

            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#121417] transition-colors group-hover:bg-[#121417] group-hover:text-white dark:border-[#2b303a] dark:bg-[#1c2027] dark:text-white dark:group-hover:bg-white dark:group-hover:text-[#121417]">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // 3. VARIANT: EDITORIAL (Cards com foto da universidade/empresa no rodapé e sem botão de salvar)
  return (
    <motion.article
      onClick={() => onSelect(opportunity)}
      className="group flex flex-col justify-between w-full cursor-pointer overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#d1d5db] hover:shadow-xl dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-stone-600 will-change-transform"
    >
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#f1f3f6] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#121417] dark:bg-[#20242b] dark:text-[#f3f4f6]">
              {typeLabel}
            </span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="text-xs font-medium text-[#64748b] dark:text-[#9aa1ad]">
              {modalityLabel}
            </span>
            {opportunity.isFree && (
              <>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60">
                  Gratuito
                </span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-bold text-lg sm:text-xl leading-snug tracking-tight text-[#121417] line-clamp-2 group-hover:text-black dark:text-[#f3f4f6] dark:group-hover:text-white">
          {opportunity.title}
        </h3>

        {/* Framed 16:9 Media Preview */}
        <div className="relative mt-4 h-48 sm:h-56 w-full overflow-hidden rounded-2xl bg-[#f1f3f6] dark:bg-[#20242b]">
          <SafeImage
            src={imageUrl}
            fallbackSrc={fallbackUrl}
            alt={opportunity.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Excerpt */}
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#525866] line-clamp-3 dark:text-[#9aa1ad]">
          {opportunity.summary}
        </p>
      </div>

      {/* Footer com logo oficial da universidade/empresa ao invés de iniciais */}
      <div className="mt-5 flex items-center justify-between border-t border-[#f1f3f6] pt-3.5 dark:border-[#242831]">
        <div className="flex items-center gap-2.5">
          <InstitutionLogo sourceName={opportunity.sourceName} size={36} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#121417] dark:text-[#f3f4f6]">
              {formattedSource}
            </span>
            <span className="text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
              <span className={deadlineBadge.isUrgent ? 'font-semibold text-rose-600 dark:text-rose-400' : ''}>
                {deadlineBadge.label}
              </span>
            </span>
          </div>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] transition-all group-hover:bg-[#121417] group-hover:text-white dark:border-[#2b303a] dark:bg-[#1c2027] dark:text-white dark:group-hover:bg-white dark:group-hover:text-[#121417]">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.article>
  );
}
