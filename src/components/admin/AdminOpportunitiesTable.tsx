'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Opportunity, OpportunityType } from '@/types/opportunity';
import { getOpportunityTypeLabel } from '@/lib/utils';
import { getOpportunities } from '@/services/opportunities';
import { adminService } from '@/services/admin';
import { AdminOpportunityEditModal } from './AdminOpportunityEditModal';

const ALL_TYPES: OpportunityType[] = [
  'INNOVATION',
  'EVENT',
  'WORKSHOP',
  'COURSE',
  'GRADUATION',
  'HACKATHON',
  'COMPETITION',
  'INTERNSHIP',
  'SCHOLARSHIP',
  'RESEARCH',
  'EXCHANGE_PROGRAM',
  'VOLUNTEERING',
  'EXTENSION_PROGRAM',
  'NOTICE',
  'OTHER',
];

export function AdminOpportunitiesTable() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'ALL'>('ALL');
  const [updatingTypeId, setUpdatingTypeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getOpportunities({
        title: searchTerm.trim() || undefined,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        page: currentPage,
        size: pageSize,
        sort: 'id,desc',
      });
      setOpportunities(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error('Erro ao listar oportunidades no painel admin:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, typeFilter]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchList();
    });
  }, [fetchList]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchList();
  };

  const handleQuickTypeChange = async (id: number, newType: OpportunityType) => {
    setUpdatingTypeId(id);
    try {
      const updated = await adminService.quickUpdateType(id, newType);
      setOpportunities((prev) =>
        prev.map((item) => (item.id === id ? { ...item, type: updated.type } : item))
      );
      setActionNotice({
        type: 'success',
        message: `Tipo da oportunidade #${id} alterado para "${getOpportunityTypeLabel(newType)}" com sucesso!`,
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      setActionNotice({
        type: 'error',
        message: (err as Error).message || `Falha ao alterar o tipo da oportunidade #${id}`,
      });
      setTimeout(() => setActionNotice(null), 4000);
    } finally {
      setUpdatingTypeId(null);
    }
  };

  const handleOpenEdit = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsEditModalOpen(true);
  };

  const handleUpdated = (updated: Opportunity) => {
    setOpportunities((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setActionNotice({
      type: 'success',
      message: `Oportunidade #${updated.id} atualizada com sucesso!`,
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSoftDeleted = (id: number) => {
    // Atualiza o expiresAt localmente para ontém
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    setOpportunities((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expiresAt: yesterday } : item))
    );
    setActionNotice({
      type: 'success',
      message: `Soft delete executado na oportunidade #${id}. Expiração definida para ontem.`,
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleQuickSoftDelete = async (id: number) => {
    if (!window.confirm(`Confirma o soft delete da oportunidade #${id}? Ela será ocultada imediatamente do feed público.`)) {
      return;
    }

    try {
      await adminService.softDeleteOpportunity(id);
      handleSoftDeleted(id);
    } catch (err) {
      setActionNotice({
        type: 'error',
        message: (err as Error).message || `Falha ao executar soft delete na oportunidade #${id}`,
      });
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredOpportunities = opportunities.filter((op) => {
    if (statusFilter === 'ACTIVE') {
      return op.expiresAt >= todayStr;
    }
    if (statusFilter === 'EXPIRED') {
      return op.expiresAt < todayStr;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Feedback Toast */}
      {actionNotice && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-bold ${
            actionNotice.type === 'success'
              ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300'
          }`}
        >
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] pl-9 pr-3.5 py-2 text-xs font-medium text-[#121417] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748b] dark:text-[#9aa1ad]" />
        </form>

        <div className="flex w-full sm:w-auto flex-wrap items-center justify-between sm:justify-end gap-2">
          {/* Filtro por Categoria / Tipo */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as OpportunityType | 'ALL');
              setCurrentPage(0);
            }}
            className="rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 py-1.5 text-xs font-bold text-[#121417] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] cursor-pointer hover:border-[#121417] dark:hover:border-stone-500 transition-colors"
          >
            <option value="ALL" className="bg-white dark:bg-[#15181e]">Todos os Tipos</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-[#15181e]">
                {getOpportunityTypeLabel(t)}
              </option>
            ))}
          </select>

          {/* Status Filter Tabs */}
          <div className="flex rounded-xl bg-[#f1f3f6] p-1 dark:bg-[#1c2027]">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white text-[#121417] shadow-xs dark:bg-[#282d37] dark:text-white'
                  : 'text-[#64748b] dark:text-[#9aa1ad]'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-[#64748b] dark:text-[#9aa1ad]'
              }`}
            >
              Vigentes
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('EXPIRED')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                statusFilter === 'EXPIRED'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-[#64748b] dark:text-[#9aa1ad]'
              }`}
            >
              Expiradas
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchList()}
            disabled={isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e7eb] text-[#64748b] hover:bg-[#f8f9fa] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-[#181b22]"
            title="Atualizar lista"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabela de Oportunidades */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xs dark:border-[#242831] dark:bg-[#15181e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f1f3f6] bg-[#f8f9fa] text-[11px] font-black uppercase tracking-wider text-[#64748b] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad]">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Título</th>
                <th className="py-3 px-4">Fonte</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Validade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f6] text-xs font-medium dark:divide-[#242831]">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-4 w-full rounded-md bg-stone-200 dark:bg-stone-800" />
                    </td>
                  </tr>
                ))
              ) : filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748b] dark:text-[#9aa1ad]">
                    Nenhuma oportunidade encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((opp) => {
                  const isExpired = opp.expiresAt < todayStr;
                  return (
                    <tr
                      key={opp.id}
                      className="transition-colors hover:bg-[#f8f9fa] dark:hover:bg-[#181b22]"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-500 dark:text-stone-400">
                        #{opp.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md truncate font-bold text-[#121417] dark:text-white">
                        <span title={opp.title}>{opp.title}</span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                          {opp.sourceName}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <select
                          value={opp.type}
                          disabled={updatingTypeId === opp.id}
                          onChange={(e) =>
                            handleQuickTypeChange(opp.id, e.target.value as OpportunityType)
                          }
                          className="rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-1 text-xs font-bold text-[#121417] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] cursor-pointer hover:border-[#121417] dark:hover:border-stone-500 transition-colors disabled:opacity-50"
                          title="Alterar tipo da oportunidade"
                        >
                          {ALL_TYPES.map((t) => (
                            <option
                              key={t}
                              value={t}
                              className="bg-white dark:bg-[#15181e] text-[#121417] dark:text-[#f3f4f6]"
                            >
                              {getOpportunityTypeLabel(t)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                        {opp.expiresAt}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                            Expirada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                            Vigente
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={opp.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1e222a]"
                            title="Abrir URL Oficial"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(opp)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
                            title="Editar Oportunidade"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickSoftDelete(opp.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                            title="Soft Delete (Expirar Agora)"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between border-t border-[#f1f3f6] p-3.5 text-xs text-[#64748b] dark:border-[#242831] dark:text-[#9aa1ad]">
          <span>
            Mostrando página <strong>{currentPage + 1}</strong> de <strong>{Math.max(1, totalPages)}</strong> ({totalElements} registros no total)
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-[#f8f9fa] disabled:opacity-40 dark:border-[#242831] dark:hover:bg-[#181b22]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] hover:bg-[#f8f9fa] disabled:opacity-40 dark:border-[#242831] dark:hover:bg-[#181b22]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <AdminOpportunityEditModal
        opportunity={selectedOpportunity}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOpportunity(null);
        }}
        onUpdated={handleUpdated}
        onSoftDeleted={handleSoftDeleted}
      />
    </div>
  );
}
