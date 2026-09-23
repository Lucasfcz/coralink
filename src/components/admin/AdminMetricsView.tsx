'use client';

import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Building,
  TrendingUp,
  Activity,
  ExternalLink,
  Globe,
  Users,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { DashboardMetricsResponse } from '@/services/admin';

interface AdminMetricsViewProps {
  metrics: DashboardMetricsResponse | null;
  isLoading: boolean;
}

export function AdminMetricsView({ metrics, isLoading }: AdminMetricsViewProps) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-[#e5e7eb] bg-white p-5 dark:border-[#242831] dark:bg-[#15181e]"
          />
        ))}
      </div>
    );
  }

  const acceptanceRateFormatted = (metrics.aiScreeningAcceptanceRate * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. Grade Bento: Indicadores Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Oportunidades Ativas */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:border-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-[#383f4d]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
              Oportunidades Ativas
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#121417] dark:text-white">
            {metrics.totalActiveOpportunities}
          </p>
          <span className="mt-1 block text-xs text-[#64748b] dark:text-[#9aa1ad]">
            Vigentes e visíveis no feed público
          </span>
        </div>

        {/* Notícias Coletadas */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:border-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-[#383f4d]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
              Matérias Capturadas
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#121417] dark:text-white">
            {metrics.totalRawCollected}
          </p>
          <span className="mt-1 block text-xs text-[#64748b] dark:text-[#9aa1ad]">
            Coletadas pelos crawlers das instituições
          </span>
        </div>

        {/* Taxa de Conversão da Triagem IA */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:border-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-[#383f4d]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
              Taxa de Relevância IA
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#121417] dark:text-white">
            {acceptanceRateFormatted}%
          </p>
          <span className="mt-1 block text-xs text-[#64748b] dark:text-[#9aa1ad]">
            {metrics.totalScreenedRelevant} aprovadas / {metrics.totalScreenedIrrelevant} descartadas
          </span>
        </div>

        {/* Extrações Falhas */}
        <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:border-[#121417] dark:border-[#242831] dark:bg-[#15181e] dark:hover:border-[#383f4d]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
              Falhas na Extração
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#121417] dark:text-white">
            {metrics.failedExtractionsCount}
          </p>
          <span className="mt-1 block text-xs text-[#64748b] dark:text-[#9aa1ad]">
            Matérias que excederam 3 tentativas
          </span>
        </div>
      </div>

      {/* 2. Banner de Telemetria e Audiência Vercel Analytics */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-gradient-to-br from-white via-white to-[#f8f9fa] p-6 shadow-xs dark:border-[#242831] dark:from-[#15181e] dark:via-[#15181e] dark:to-[#1a1e26]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Telemetria Ativa
              </span>
              <span className="rounded-full bg-[#f1f3f6] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748b] dark:bg-[#20242b] dark:text-[#9aa1ad]">
                @vercel/analytics
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#121417] dark:text-white" />
              <h3 className="text-base sm:text-lg font-bold text-[#121417] dark:text-white">
                Tráfego & Audiência em Tempo Real
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#9aa1ad] max-w-2xl">
              Rastreamento de visitantes únicos, visualizações de páginas, fontes de tráfego (referrers),
              dispositivos e cidades em produção com privacidade garantida e conformidade LGPD.
            </p>

            {/* Badges de Métricas Monitoradas */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-[#4b5563] dark:text-[#9aa1ad]">
              <span className="inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1 dark:border-[#2b303a] dark:bg-[#1a1e27]">
                <Users className="h-3 w-3 text-sky-500" />
                Visitantes Únicos
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1 dark:border-[#2b303a] dark:bg-[#1a1e27]">
                <Eye className="h-3 w-3 text-emerald-500" />
                Pageviews & Rotas
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1 dark:border-[#2b303a] dark:bg-[#1a1e27]">
                <Globe className="h-3 w-3 text-indigo-500" />
                Geolocalização & Referrers
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white px-2.5 py-1 dark:border-[#2b303a] dark:bg-[#1a1e27]">
                <ShieldCheck className="h-3 w-3 text-amber-500" />
                Cookieless / LGPD
              </span>
            </div>
          </div>

          {/* Botão de Ação Rápida: Dashboard Vercel */}
          <div className="shrink-0">
            <a
              href="https://vercel.com/lucasfcz/coralink/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#121417] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
            >
              <span>Abrir Painel no Vercel</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Seção de Gráficos e Distribuições */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria / Tipo */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#121417] dark:text-white" />
            <h3 className="text-sm font-bold text-[#121417] dark:text-white uppercase tracking-wider">
              Distribuição por Categoria
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(metrics.opportunitiesByType || {}).length === 0 ? (
              <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">Nenhuma oportunidade registrada.</p>
            ) : (
              Object.entries(metrics.opportunitiesByType).map(([type, count]) => {
                const total = metrics.totalActiveOpportunities || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#121417] dark:text-[#f3f4f6]">
                      <span className="capitalize">{type.toLowerCase().replace(/_/g, ' ')}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f3f6] dark:bg-[#20242b]">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Distribuição por Instituição / Fonte */}
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-4 w-4 text-[#121417] dark:text-white" />
            <h3 className="text-sm font-bold text-[#121417] dark:text-white uppercase tracking-wider">
              Distribuição por Instituição
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(metrics.opportunitiesBySource || {}).length === 0 ? (
              <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">Nenhuma fonte registrada.</p>
            ) : (
              Object.entries(metrics.opportunitiesBySource).map(([source, count]) => {
                const total = metrics.totalActiveOpportunities || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={source} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#121417] dark:text-[#f3f4f6]">
                      <span>{source}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f3f6] dark:bg-[#20242b]">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
