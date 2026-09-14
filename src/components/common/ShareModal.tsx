'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Mail, Share2 } from 'lucide-react';
import { InstitutionLogo } from './InstitutionLogo';
import { formatSourceName } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string | number;
    title: string;
    sourceName: string;
    url?: string;
  };
}

export function ShareModal({ isOpen, onClose, opportunity }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/oportunidades/${opportunity.id}`);
    }
  }, [opportunity.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const formattedSource = formatSourceName(opportunity.sourceName);

  const socialLinks = [
    {
      name: 'WhatsApp',
      bgClass: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white dark:bg-[#25D366]/20',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Confira esta oportunidade no Coralink: ${opportunity.title}\n\n${shareUrl}`
      )}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      bgClass: 'bg-black/10 text-black hover:bg-black hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${opportunity.title} via @Coralink`
      )}&url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      bgClass: 'bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white dark:bg-[#0A66C2]/20',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45 1.45 1.45 0 0 0 1.45 1.45m1.37 9.74v-8.37H5.09v8.37h2.74z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      bgClass: 'bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white dark:bg-[#229ED9]/20',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
        opportunity.title
      )}`,
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.536-.196 1.006.128.832.943z" />
        </svg>
      ),
    },
    {
      name: 'E-mail',
      bgClass: 'bg-slate-500/10 text-slate-700 hover:bg-slate-700 hover:text-white dark:bg-slate-400/10 dark:text-slate-300 dark:hover:bg-white dark:hover:text-black',
      href: `mailto:?subject=${encodeURIComponent(`Oportunidade Coralink: ${opportunity.title}`)}&body=${encodeURIComponent(
        `Encontrei esta oportunidade acadêmica/tech no Coralink e achei relevante:\n\n${opportunity.title} (${formattedSource})\n\nAcesse os detalhes completos aqui:\n${shareUrl}`
      )}`,
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Card do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-2xl transition-colors dark:border-[#242831] dark:bg-[#15181e]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f6] dark:border-[#242831]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8f9fa] text-[#121417] dark:bg-[#1e222a] dark:text-white">
                  <Share2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121417] dark:text-white">
                    Compartilhar Oportunidade
                  </h3>
                  <p className="text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                    Divulgue para colegas, grupos e redes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f3f6] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:bg-[#20242b] dark:hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Preview do Card Resumido */}
            <div className="my-5 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-3.5 dark:border-[#242831] dark:bg-[#1a1d24]">
              <div className="flex items-center gap-2.5">
                <InstitutionLogo sourceName={opportunity.sourceName} size={32} />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                    {formattedSource}
                  </span>
                  <p className="truncate text-xs font-semibold text-[#121417] dark:text-white">
                    {opportunity.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="mb-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-2.5">
                Compartilhar em
              </label>
              <div className="grid grid-cols-5 gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 px-1 transition-all duration-200 ${social.bgClass}`}
                    title={social.name}
                  >
                    {social.icon}
                    <span className="text-[10px] font-semibold">{social.name.split(' ')[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Caixa de Cópia de Link */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-2">
                Ou copie o link direto
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] py-2.5 px-3.5 text-xs text-[#121417] truncate select-all focus:outline-none dark:border-[#242831] dark:bg-[#1e222a] dark:text-[#f3f4f6]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-xs ${
                    copied
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                      : 'bg-[#121417] text-white hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
