'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import { getOpportunities } from '@/services/opportunities';
import { getOpportunityTypeLabel } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectOpportunity,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getOpportunities({ title: query.trim(), size: 6 });
        setResults(res.content || []);
      } catch (err) {
        console.error('Erro na pesquisa:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl dark:border-[#242831] dark:bg-[#15181e]"
        >
          {/* Input Header */}
          <div className="flex items-center border-b border-[#e5e7eb] px-4 py-3.5 dark:border-[#242831]">
            <Search className="h-5 w-5 text-[#9aa1ad] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, instituição ou tema..."
              className="ml-3 flex-1 bg-transparent text-sm text-[#121417] placeholder-[#9aa1ad] outline-none dark:text-white"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-[#64748b] mr-2 dark:text-[#9aa1ad]" />}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-[#9aa1ad] hover:bg-[#f1f3f6] hover:text-[#121417] dark:hover:bg-[#20242b] dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results list */}
          <div className="max-h-96 overflow-y-auto p-2">
            {query.trim() && !loading && results.length === 0 && (
              <div className="p-8 text-center text-xs text-[#64748b] dark:text-[#9aa1ad]">
                Nenhuma oportunidade encontrada para &ldquo;{query}&rdquo;
              </div>
            )}

            {results.map((opp) => (
              <button
                key={`search-${opp.id}`}
                type="button"
                onClick={() => {
                  onSelectOpportunity(opp);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-[#f8f9fa] dark:hover:bg-[#1c2027]"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748b] dark:text-[#9aa1ad]">
                    <span>{getOpportunityTypeLabel(opp.type)}</span>
                    <span>•</span>
                    <span>{opp.sourceName}</span>
                  </div>
                  <h4 className="mt-0.5 text-xs font-semibold text-[#121417] line-clamp-1 dark:text-[#f3f4f6]">
                    {opp.title}
                  </h4>
                </div>
                <ArrowRight className="h-4 w-4 text-[#9aa1ad] shrink-0" />
              </button>
            ))}

            {!query.trim() && (
              <div className="p-6 text-center text-xs text-[#64748b] dark:text-[#9aa1ad]">
                Digite para buscar em tempo real entre mais de 140 oportunidades.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
