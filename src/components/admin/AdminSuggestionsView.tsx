'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Bug,
  Globe,
  HelpCircle,
  RefreshCw,
  Mail,
  Calendar,
} from 'lucide-react';
import { adminService, UserHelpResponse, SuggestionType } from '@/services/admin';

export function AdminSuggestionsView() {
  const [suggestions, setSuggestions] = useState<UserHelpResponse[]>([]);
  const [selectedType, setSelectedType] = useState<SuggestionType | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const typeFilter = selectedType === 'ALL' ? undefined : selectedType;
      const res = await adminService.getUserSuggestions(currentPage, 20, typeFilter);
      setSuggestions(res.content || []);
    } catch (err) {
      console.error('Erro ao buscar sugestões:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedType]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchSuggestions();
    });
  }, [fetchSuggestions]);

  const getCategoryBadge = (type: SuggestionType) => {
    switch (type) {
      case 'BUG':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <Bug className="h-3 w-3" />
            Problema / Bug
          </span>
        );
      case 'NEW_SOURCE':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <Globe className="h-3 w-3" />
            Nova Instituição / Fonte
          </span>
        );
      case 'SUGGESTION':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <HelpCircle className="h-3 w-3" />
            Sugestão Geral
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior de Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedType('ALL');
              setCurrentPage(0);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedType === 'ALL'
                ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417]'
                : 'text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedType('BUG');
              setCurrentPage(0);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedType === 'BUG'
                ? 'bg-rose-500 text-white'
                : 'text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]'
            }`}
          >
            Bugs & Problemas
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedType('NEW_SOURCE');
              setCurrentPage(0);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedType === 'NEW_SOURCE'
                ? 'bg-blue-500 text-white'
                : 'text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]'
            }`}
          >
            Novas Fontes
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedType('SUGGESTION');
              setCurrentPage(0);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedType === 'SUGGESTION'
                ? 'bg-indigo-500 text-white'
                : 'text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]'
            }`}
          >
            Sugestões
          </button>
        </div>

        <button
          type="button"
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#64748b] hover:bg-[#f8f9fa] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-[#181b22]"
          title="Atualizar"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Lista de Sugestões */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-[#e5e7eb] bg-white p-5 dark:border-[#242831] dark:bg-[#15181e]"
            />
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-12 text-center shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
          <MessageSquare className="mx-auto h-8 w-8 text-[#64748b] dark:text-[#9aa1ad] opacity-40 mb-2" />
          <h3 className="text-sm font-bold text-[#121417] dark:text-white">
            Nenhuma sugestão registrada
          </h3>
          <p className="mt-1 text-xs text-[#64748b] dark:text-[#9aa1ad]">
            Quando os estudantes enviarem feedbacks ou sugestões de novas fontes, eles aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:border-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-[#383f4d]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {getCategoryBadge(item.type)}
                  <span className="font-mono text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                    #{item.id}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#121417] dark:text-[#f3f4f6]">
                  &ldquo;{item.suggestion}&rdquo;
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#f1f3f6] pt-3 text-[11px] text-[#64748b] dark:border-[#242831] dark:text-[#9aa1ad]">
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.userEmail || 'Estudante anônimo'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
