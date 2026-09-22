'use client';

import { useState, useEffect } from 'react';
import { SafeImage } from '@/components/common/SafeImage';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Calendar,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Share2,
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
import { ShareModal } from '@/components/common/ShareModal';

import { useModalScrollLock } from '@/hooks/useModalScrollLock';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export function OpportunityModal({
  opportunity,
  onClose,
}: OpportunityModalProps) {
  useModalScrollLock(!!opportunity);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!opportunity) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [opportunity, onClose]);

  const imageUrl = opportunity
    ? getCleanImageUrl(opportunity.imageUrl, opportunity.id)
    : '';
  const deadlineBadge = opportunity
    ? formatDeadlineBadge(opportunity.registrationDeadline)
    : { label: '', isUrgent: false };
  const typeLabel = opportunity
    ? getOpportunityTypeLabel(opportunity.type)
    : '';
  const modalityLabel = opportunity
    ? getModalityLabel(opportunity.modality)
    : '';

  return (
    <AnimatePresence mode="wait">
      {opportunity && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
          {/* Backdrop escuro com blur cinematográfico e animação impeccable */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal Container com animação fluida acelerada por hardware */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            className="relative z-10 flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] sm:rounded-[28px] border border-[#e5e7eb] bg-white shadow-2xl dark:border-[#242831] dark:bg-[#15181e]"
          >
            {/* Mobile Handle Drag Indicator */}
            <div className="flex sm:hidden w-full items-center justify-center pt-3 pb-1 bg-white dark:bg-[#15181e]">
              <div className="h-1.5 w-12 rounded-full bg-[#d1d5db] dark:bg-[#2b303a]" />
            </div>

            {/* Top Action Buttons no topo direito */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                aria-label="Compartilhar oportunidade"
                title="Compartilhar oportunidade"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#121417] shadow-md backdrop-blur-md transition-all hover:bg-[#121417] hover:text-white dark:bg-[#1c2027]/90 dark:text-[#f3f4f6] dark:hover:bg-white dark:hover:text-[#121417]"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar preview"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#121417] shadow-md backdrop-blur-md transition-all hover:bg-[#121417] hover:text-white dark:bg-[#1c2027]/90 dark:text-[#f3f4f6] dark:hover:bg-white dark:hover:text-[#121417]"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable Content Container com data-lenis-prevent para permitir rolagem nativa interna */}
            <div
              data-lenis-prevent="true"
              className="overflow-y-auto overscroll-contain flex-1"
            >
              {/* Cover Banner */}
              <div className="relative h-56 sm:h-64 w-full bg-[#121417]">
                <SafeImage
                  src={imageUrl}
                  fallbackSrc={getFallbackImageUrl(opportunity.id)}
                  alt={opportunity.title}
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badges sobre a imagem */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#121417] shadow dark:bg-[#121417] dark:text-white">
                    {typeLabel}
                  </span>
                  <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {modalityLabel}
                  </span>
                  {opportunity.isFree && (
                    <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white shadow">
                      Gratuito
                    </span>
                  )}
                  {opportunity.isForAll && (
                    <span className="rounded-full bg-indigo-500/90 px-3 py-1 text-xs font-bold text-white shadow flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Aberto a Todos
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                {/* Institution / Source */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
                  <InstitutionLogo sourceName={opportunity.sourceName} size={22} />
                  <span className="uppercase tracking-wider">
                    Publicado por {formatSourceName(opportunity.sourceName)}
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] dark:bg-emerald-950/50 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> Verificado por IA
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-2.5 text-xl sm:text-2xl font-extrabold leading-snug tracking-tight text-[#121417] dark:text-[#f3f4f6]">
                  {opportunity.title}
                </h2>

                {/* Key Highlights Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#181b22]">
                  {/* Prazo de Inscrição */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e5e7eb] text-[#121417] shadow-xs dark:border-[#2b303a] dark:bg-[#20242b] dark:text-white">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-[#64748b] dark:text-[#9aa1ad]">
                        Inscrições / Prazo
                      </span>
                      <span className="text-xs font-bold text-[#121417] dark:text-white">
                        {opportunity.registrationDeadline
                          ? formatDate(opportunity.registrationDeadline)
                          : 'Fluxo Contínuo / Aberto'}
                      </span>
                      <span
                        className={`text-[10px] ${
                          deadlineBadge.isUrgent
                            ? 'font-bold text-rose-600 dark:text-rose-400'
                            : 'text-[#64748b] dark:text-[#9aa1ad]'
                        }`}
                      >
                        {deadlineBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Localização / Modalidade */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-[#e5e7eb] text-[#121417] shadow-xs dark:border-[#2b303a] dark:bg-[#20242b] dark:text-white">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-[#64748b] dark:text-[#9aa1ad]">
                        Localização / Formato
                      </span>
                      <span className="text-xs font-bold text-[#121417] truncate max-w-[200px] dark:text-white">
                        {opportunity.location ||
                          (opportunity.modality === 'ONLINE'
                            ? '100% Remoto / Online'
                            : 'Pernambuco / RMR')}
                      </span>
                      <span className="text-[10px] text-[#64748b] dark:text-[#9aa1ad]">
                        {modalityLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="mt-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-[#f3f4f6]">
                    Resumo da Oportunidade
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#374151] whitespace-pre-line dark:text-[#d2d6dc]">
                    {opportunity.summary}
                  </p>
                </div>

                {/* Target Course Audiences */}
                {opportunity.targetCourseAudiences &&
                  opportunity.targetCourseAudiences.length > 0 && (
                    <div className="mt-6 border-t border-[#f1f3f6] pt-5 dark:border-[#242831]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                        Público-Alvo
                      </span>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {opportunity.targetCourseAudiences
                          .slice(0, 6)
                          .map((aud) => (
                            <span
                              key={aud}
                              className="rounded-full border border-[#e5e7eb] bg-white px-2.5 py-1 text-[11px] font-medium text-[#4b5563] dark:border-[#2b303a] dark:bg-[#20242b] dark:text-[#e5e7eb]"
                            >
                              {formatTargetAudience(aud)}
                            </span>
                          ))}
                        {opportunity.targetCourseAudiences.length > 6 && (
                          <span className="rounded-full bg-[#f1f3f6] px-2 py-1 text-[11px] font-semibold text-[#64748b] dark:bg-[#242831] dark:text-[#9aa1ad]">
                            +{opportunity.targetCourseAudiences.length - 6} áreas
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Modal Actions Footer com suporte a safe area do iOS */}
              <div className="sticky bottom-0 border-t border-[#e5e7eb] bg-white/95 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 dark:border-[#242831] dark:bg-[#15181e]/95">
                <Link
                  href={`/oportunidades/${opportunity.id}`}
                  onClick={onClose}
                  className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-5 py-2.5 text-xs font-bold text-[#121417] transition-all hover:border-[#121417] hover:bg-white dark:border-[#242831] dark:bg-[#1c2027] dark:text-white dark:hover:border-stone-500"
                >
                  <span>Ver página completa</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href={opportunity.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#121417] px-7 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <span>Acessar Edital Oficial</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Modal de Compartilhamento */}
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
        </div>
      )}
    </AnimatePresence>
  );
}
