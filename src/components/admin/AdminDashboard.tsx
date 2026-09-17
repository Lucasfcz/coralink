'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Briefcase,
  Cpu,
  MessageSquare,
  Shield,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { adminService, DashboardMetricsResponse } from '@/services/admin';
import { AdminMetricsView } from './AdminMetricsView';
import { AdminOpportunitiesTable } from './AdminOpportunitiesTable';
import { AdminPipelineRunner } from './AdminPipelineRunner';
import { AdminSuggestionsView } from './AdminSuggestionsView';

type AdminTab = 'METRICS' | 'OPPORTUNITIES' | 'PIPELINE' | 'SUGGESTIONS';

export function AdminDashboard() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('METRICS');
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    setIsUnauthorized(false);
    try {
      const data = await adminService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      if ((err as { status?: number })?.status === 401) {
        setIsUnauthorized(true);
      }
      console.error('Erro ao buscar métricas do dashboard:', err);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      fetchMetrics();
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#121417] dark:bg-[#0c0d0f] dark:text-[#f3f4f6]">
      {/* Barra de Navegação Superior da Administração */}
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/80 backdrop-blur-xl dark:border-[#242831] dark:bg-[#121417]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#64748b] hover:border-[#121417] hover:text-[#121417] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:border-white dark:hover:text-white"
              title="Voltar ao portal público"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#121417] text-white dark:bg-white dark:text-[#121417]">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black tracking-tight text-[#121417] dark:text-white">
                    Coralink Admin
                  </h1>
                  <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Master
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                  Controle da Plataforma & Automação com IA
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
              <span>Logado como:</span>
              <strong className="text-[#121417] dark:text-white truncate max-w-[180px]">
                {user?.name || user?.email}
              </strong>
            </div>

            <button
              type="button"
              onClick={fetchMetrics}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#64748b] hover:bg-[#f1f3f6] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-[#181b22]"
              title="Recarregar dados"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
            {[
              {
                id: 'METRICS',
                label: 'Métricas & Painel',
                icon: BarChart3,
              },
              {
                id: 'OPPORTUNITIES',
                label: 'Gestão de Oportunidades',
                icon: Briefcase,
              },
              {
                id: 'PIPELINE',
                label: 'Esteira Scraping & IA',
                icon: Cpu,
              },
              {
                id: 'SUGGESTIONS',
                label: 'Sugestões de Alunos',
                icon: MessageSquare,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCurrentTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#121417] text-white shadow-xs dark:bg-white dark:text-[#121417]'
                      : 'text-[#64748b] hover:bg-[#f1f3f6] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:bg-[#181b22] dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal da Aba Selecionada */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {isUnauthorized && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <h2 className="text-sm font-bold">Sessão Expirada ou Não Autorizada (HTTP 401)</h2>
                <p className="text-xs text-rose-600/90 dark:text-rose-400/90 mt-0.5">
                  Seu token de acesso expirou (validade de 15 minutos) ou sua conta não possui privilégios de administrador no servidor.
                </p>
              </div>
            </div>
            <Link
              href="/login?redirect=/admin"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
            >
              Fazer Login Novamente
            </Link>
          </div>
        )}

        {currentTab === 'METRICS' && (
          <AdminMetricsView metrics={metrics} isLoading={isLoadingMetrics} />
        )}

        {currentTab === 'OPPORTUNITIES' && <AdminOpportunitiesTable />}

        {currentTab === 'PIPELINE' && <AdminPipelineRunner />}

        {currentTab === 'SUGGESTIONS' && <AdminSuggestionsView />}
      </main>
    </div>
  );
}
