'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  Database,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  adminService,
  PipelineStatusResponse,
  PipelineRunResponse,
  RawOpportunityResponse,
} from '@/services/admin';

export function AdminPipelineRunner() {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatusResponse | null>(null);
  const [runs, setRuns] = useState<PipelineRunResponse[]>([]);
  const [failedExtractions, setFailedExtractions] = useState<RawOpportunityResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'RUNS' | 'FAILED'>('RUNS');
  const [selectedRunItems, setSelectedRunItems] = useState<RawOpportunityResponse[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatusAndRuns = useCallback(async () => {
    try {
      const [statusRes, runsRes, failedRes] = await Promise.all([
        adminService.getPipelineStatus(),
        adminService.getPipelineRuns(0, 10),
        adminService.getFailedExtractions(0, 15),
      ]);
      setPipelineStatus(statusRes);
      setRuns(runsRes.content || []);
      setFailedExtractions(failedRes.content || []);
    } catch (err) {
      console.error('Erro ao buscar status do pipeline:', err);
    }
  }, []);

  // Polling automático inteligente a cada 2 segundos quando a pipeline estiver em execução
  useEffect(() => {
    queueMicrotask(() => {
      fetchStatusAndRuns();
    });

    const checkAndPoll = async () => {
      try {
        const res = await adminService.getPipelineStatus();
        setPipelineStatus(res);
        if (res.isRunning) {
          // Animar estágios
          setActiveStageIndex((prev) => (prev + 1) % 4);
          if (!pollingRef.current) {
            pollingRef.current = setInterval(checkAndPoll, 2000);
          }
        } else {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            // Ao finalizar, atualizar histórico completo
            fetchStatusAndRuns();
          }
        }
      } catch {
        // Ignora erro de rede momentâneo no polling
      }
    };

    const initialInterval = setInterval(checkAndPoll, 5000);
    return () => {
      clearInterval(initialInterval);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchStatusAndRuns]);

  const handleTriggerPipeline = async () => {
    setIsTriggering(true);
    setNotice(null);
    try {
      const res = await adminService.triggerPipeline();
      setNotice({
        type: 'success',
        message: res.message || 'Pipeline iniciado em segundo plano com sucesso!',
      });
      // Inicia polling imediato
      setTimeout(fetchStatusAndRuns, 1000);
    } catch (err) {
      setNotice({
        type: 'error',
        message: (err as Error).message || 'Falha ao disparar pipeline',
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const handleInspectRun = async (runId: number) => {
    setSelectedRunId(runId);
    setIsItemsModalOpen(true);
    setIsLoadingItems(true);
    try {
      const res = await adminService.getPipelineRunItems(runId, 0, 50);
      setSelectedRunItems(res.content || []);
    } catch (err) {
      console.error('Erro ao buscar itens da rodada:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const isRunning = pipelineStatus?.isRunning || false;

  return (
    <div className="space-y-6">
      {/* Toast de Notificação */}
      {notice && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold ${
            notice.type === 'success'
              ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      {/* 1. Painel de Controle Principal da Esteira */}
      <div className="rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-xs dark:border-[#242831] dark:bg-[#15181e] sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-3 w-3 rounded-full ${
                  isRunning
                    ? 'animate-ping bg-emerald-500'
                    : 'bg-stone-400 dark:bg-stone-600'
                }`}
              />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#64748b] dark:text-[#9aa1ad]">
                {isRunning ? 'Pipeline em Andamento' : 'Esteira Ociosa'}
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#121417] dark:text-white">
              Esteira Inteligente de Scraping & IA
            </h2>

            <p className="text-xs text-[#64748b] dark:text-[#9aa1ad] max-w-xl">
              Coleta contínua de notícias nas instituições (UFPE, UPE, IFPE, etc.), triagem semântica com Spring AI e extração estruturada de oportunidades acadêmicas e de carreira.
            </p>
          </div>

          {/* Botão de Disparo Manual */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isRunning || isTriggering}
              onClick={handleTriggerPipeline}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md ${
                isRunning
                  ? 'cursor-not-allowed border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-[#121417] text-white hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Processando Rodada...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>{isTriggering ? 'Iniciando...' : 'Disparar Pipeline Agora'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Visualizador Dinâmico de Etapas */}
        <div className="mt-8 border-t border-[#f1f3f6] pt-6 dark:border-[#242831]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-4">
            Fluxo da Esteira
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: '1. Coleta',
                title: 'Scraping dos Portais',
                desc: 'Captura de notícias e editais brutos',
                icon: Layers,
              },
              {
                step: '2. Triagem IA',
                title: 'Filtragem Semântica',
                desc: 'Classificação por relevância com IA',
                icon: Cpu,
              },
              {
                step: '3. Extração IA',
                title: 'Extração Estruturada',
                desc: 'Prazos, público-alvo, links e resumos',
                icon: Sparkles,
              },
              {
                step: '4. Publicação',
                title: 'Persistência no Feed',
                desc: 'Indexação no banco e invalidação de cache',
                icon: Database,
              },
            ].map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = isRunning && activeStageIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 transition-all ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-xs'
                      : 'border-[#e5e7eb] bg-[#f8f9fa] dark:border-[#242831] dark:bg-[#181b22]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
                      {stage.step}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? 'animate-pulse text-emerald-600 dark:text-emerald-400'
                          : 'text-[#64748b] dark:text-[#9aa1ad]'
                      }`}
                    />
                  </div>
                  <h4 className="mt-2 text-xs font-bold text-[#121417] dark:text-white">
                    {stage.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dados de Agendamento */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f8f9fa] p-4 text-xs dark:bg-[#181b22]">
            <div className="flex items-center gap-2 text-[#64748b] dark:text-[#9aa1ad]">
              <Clock className="h-4 w-4" />
              <span>
                Próxima Execução Agendada:{' '}
                <strong className="text-[#121417] dark:text-white">
                  {pipelineStatus?.formattedTimeRemaining
                    ? `em ${pipelineStatus.formattedTimeRemaining}`
                    : 'Aguardando agendador'}
                </strong>
              </span>
            </div>

            {pipelineStatus?.lastRun && (
              <div className="text-[#64748b] dark:text-[#9aa1ad]">
                Última Rodada:{' '}
                <strong className="text-[#121417] dark:text-white">
                  {pipelineStatus.lastRun.collectedCount} capturados •{' '}
                  {pipelineStatus.lastRun.extractionRelevantCount} oportunidades geradas •{' '}
                  {pipelineStatus.lastRun.durationMs
                    ? `${(pipelineStatus.lastRun.durationMs / 1000).toFixed(1)}s`
                    : '-'}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Abas Secundárias: Histórico de Rodadas vs Extrações Falhas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#f1f3f6] pb-3 dark:border-[#242831]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('RUNS')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'RUNS'
                  ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417]'
                  : 'text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]'
              }`}
            >
              Histórico de Execuções ({runs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('FAILED')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'FAILED'
                  ? 'bg-amber-500 text-white'
                  : 'text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]'
              }`}
            >
              Extrações com Falha ({failedExtractions.length})
            </button>
          </div>

          <button
            type="button"
            onClick={fetchStatusAndRuns}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#64748b] hover:bg-[#f8f9fa] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-[#181b22]"
            title="Atualizar dados"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tabela de Execuções */}
        {activeTab === 'RUNS' && (
          <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f1f3f6] bg-[#f8f9fa] text-[11px] font-black uppercase tracking-wider text-[#64748b] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad]">
                    <th className="py-3 px-4">Run #</th>
                    <th className="py-3 px-4">Início</th>
                    <th className="py-3 px-4">Duração</th>
                    <th className="py-3 px-4">Coletadas</th>
                    <th className="py-3 px-4">Triadas IA</th>
                    <th className="py-3 px-4">Publicadas</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f6] text-xs font-medium dark:divide-[#242831]">
                  {runs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#64748b] dark:text-[#9aa1ad]">
                        Nenhuma execução registrada até o momento.
                      </td>
                    </tr>
                  ) : (
                    runs.map((run) => (
                      <tr
                        key={run.id}
                        className="transition-colors hover:bg-[#f8f9fa] dark:hover:bg-[#181b22]"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-stone-500 dark:text-stone-400">
                          #{run.id}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[#64748b] dark:text-[#9aa1ad]">
                          {new Date(run.startedAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                          {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : '-'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-[#121417] dark:text-white">
                          {run.collectedCount}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-blue-600 dark:text-blue-400 font-bold">
                          {run.screeningRelevantCount}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-emerald-600 dark:text-emerald-400 font-bold">
                          {run.extractionRelevantCount}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                              run.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : run.status === 'RUNNING'
                                ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                            }`}
                          >
                            {run.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleInspectRun(run.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] px-2.5 py-1 text-xs font-bold text-[#121417] hover:bg-[#f1f3f6] dark:border-[#242831] dark:text-stone-200 dark:hover:bg-[#1e222a]"
                          >
                            <span>Ver Itens</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabela de Extrações Falhas */}
        {activeTab === 'FAILED' && (
          <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f1f3f6] bg-[#f8f9fa] text-[11px] font-black uppercase tracking-wider text-[#64748b] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad]">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Título da Matéria</th>
                    <th className="py-3 px-4">Fonte</th>
                    <th className="py-3 px-4">Tentativas</th>
                    <th className="py-3 px-4">Último Erro</th>
                    <th className="py-3 px-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f3f6] text-xs font-medium dark:divide-[#242831]">
                  {failedExtractions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#64748b] dark:text-[#9aa1ad]">
                        Nenhuma extração com falha pendente. Todas as matérias triadas foram processadas com sucesso!
                      </td>
                    </tr>
                  ) : (
                    failedExtractions.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-[#f8f9fa] dark:hover:bg-[#181b22]"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-stone-500 dark:text-stone-400">
                          #{item.id}
                        </td>
                        <td className="py-3 px-4 max-w-sm truncate font-bold text-[#121417] dark:text-white">
                          <span title={item.title}>{item.title}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                            {item.sourceName}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-amber-600 dark:text-amber-400 font-bold">
                          {item.extractionAttempts || 3}x
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-[11px] text-rose-600 dark:text-rose-400 font-mono">
                          <span title={item.lastExtractionError || 'Erro desconhecido'}>
                            {item.lastExtractionError || 'Erro desconhecido'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <a
                            href={item.newsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                          >
                            <span>Notícia</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Inspeção dos Itens Coletados em uma Rodada */}
      {isItemsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-2xl dark:border-[#242831] dark:bg-[#121417] sm:p-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#f1f3f6] pb-4 dark:border-[#242831]">
              <div>
                <span className="text-xs font-bold text-[#64748b] dark:text-[#9aa1ad] uppercase tracking-wider">
                  Inspeção da Rodada #{selectedRunId}
                </span>
                <h3 className="text-lg font-black text-[#121417] dark:text-white">
                  Matérias Brutas Coletadas ({selectedRunItems.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsItemsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {isLoadingItems ? (
                <div className="py-12 text-center text-xs font-bold text-[#64748b] dark:text-[#9aa1ad]">
                  Carregando itens capturados pela esteira...
                </div>
              ) : selectedRunItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64748b] dark:text-[#9aa1ad]">
                  Nenhuma matéria bruta foi registrada nesta rodada.
                </div>
              ) : (
                selectedRunItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] p-3 transition-colors dark:border-[#242831] dark:bg-[#181b22]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-stone-200 px-1.5 py-0.5 text-[10px] font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                          {item.sourceName}
                        </span>
                        {item.becameOpportunity ? (
                          <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                            Virou Oportunidade
                          </span>
                        ) : item.screenedRelevant ? (
                          <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                            Aprovada na Triagem
                          </span>
                        ) : (
                          <span className="rounded-md bg-stone-200 px-1.5 py-0.5 text-[10px] font-bold text-[#64748b] dark:bg-[#20242b] dark:text-[#9aa1ad]">
                            Descartada na Triagem
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-[#121417] dark:text-white">
                        {item.title}
                      </p>
                    </div>

                    <a
                      href={item.newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-white dark:text-[#9aa1ad] dark:hover:bg-[#20242b]"
                      title="Abrir Notícia Original"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
