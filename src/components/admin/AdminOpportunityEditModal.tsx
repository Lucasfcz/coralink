'use client';

import React, { useState } from 'react';
import { X, Save, Trash2, AlertCircle } from 'lucide-react';
import { Opportunity, OpportunityType, Modality, TargetCourseAudience } from '@/types/opportunity';
import { adminService, AdminOpportunityUpdateRequest } from '@/services/admin';

interface AdminOpportunityEditModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: Opportunity) => void;
  onSoftDeleted: (id: number) => void;
}

const ALL_TYPES: OpportunityType[] = [
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
  'OTHER',
];

const ALL_MODALITIES: Modality[] = ['IN_PERSON', 'ONLINE', 'HYBRID'];

const COMMON_AUDIENCES: TargetCourseAudience[] = [
  'UNIVERSITY_STUDENTS',
  'TECHNOLOGY_STUDENTS',
  'COMPUTER_SCIENCE',
  'ADS',
  'SOFTWARE_ENGINEERING',
  'ENGINEERING_STUDENTS',
  'HEALTH_STUDENTS',
  'BUSINESS_STUDENTS',
  'HUMANITIES_STUDENTS',
  'EXACT_SCIENCES_STUDENTS',
];

export function AdminOpportunityEditModal({
  opportunity,
  isOpen,
  onClose,
  onUpdated,
  onSoftDeleted,
}: AdminOpportunityEditModalProps) {
  const [formData, setFormData] = useState<AdminOpportunityUpdateRequest | null>(null);
  const [prevOpportunityId, setPrevOpportunityId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sincronizar estado inicial quando uma oportunidade for selecionada
  if (opportunity && opportunity.id !== prevOpportunityId) {
    setPrevOpportunityId(opportunity.id);
    setFormData({
      title: opportunity.title,
      summary: opportunity.summary,
      type: opportunity.type,
      thematicArea: opportunity.thematicArea || '',
      modality: opportunity.modality,
      startDate: opportunity.startDate || '',
      endDate: opportunity.endDate || '',
      registrationDeadline: opportunity.registrationDeadline || '',
      location: opportunity.location || '',
      officialUrl: opportunity.officialUrl,
      imageUrl: opportunity.imageUrl || '',
      isFree: opportunity.isFree,
      isForAll: opportunity.isForAll,
      targetCourseAudiences: [...(opportunity.targetCourseAudiences || [])],
      expiresAt: opportunity.expiresAt || new Date().toISOString().split('T')[0],
    });
    setErrorMessage(null);
  }

  if (!isOpen || !opportunity || !formData) return null;

  const handleAudienceToggle = (aud: TargetCourseAudience) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const exists = prev.targetCourseAudiences.includes(aud);
      return {
        ...prev,
        targetCourseAudiences: exists
          ? prev.targetCourseAudiences.filter((a) => a !== aud)
          : [...prev.targetCourseAudiences, aud],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.officialUrl.trim()) {
      setErrorMessage('Título, Resumo e URL Oficial são campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const updated = await adminService.updateOpportunity(opportunity.id, formData);
      onUpdated(updated);
      onClose();
    } catch (err) {
      setErrorMessage((err as Error).message || 'Falha ao atualizar oportunidade');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSoftDelete = async () => {
    const confirmMessage = `Tem certeza que deseja desativar (soft delete) a oportunidade #${opportunity.id}?\nEla será marcada como expirada para ontem e removida do feed público imediatamente.`;
    if (!window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await adminService.softDeleteOpportunity(opportunity.id);
      onSoftDeleted(opportunity.id);
      onClose();
    } catch (err) {
      setErrorMessage((err as Error).message || 'Falha ao executar soft delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#e5e7eb] bg-white p-6 shadow-2xl dark:border-[#242831] dark:bg-[#121417] sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#f1f3f6] pb-4 dark:border-[#242831]">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                #{opportunity.id}
              </span>
              <span className="text-xs font-semibold text-[#64748b] dark:text-[#9aa1ad]">
                Fonte: {opportunity.sourceName}
              </span>
            </div>
            <h2 className="mt-1 text-lg font-black text-[#121417] dark:text-white">
              Editar Oportunidade
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f3f6] dark:text-[#9aa1ad] dark:hover:bg-[#1c2027]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2.5 text-xs font-medium text-[#121417] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
            />
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
              Resumo / Descrição *
            </label>
            <textarea
              required
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2.5 text-xs font-medium text-[#121417] focus:border-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
            />
          </div>

          {/* Tipo e Modalidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
                Tipo da Oportunidade
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as OpportunityType })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 py-2.5 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              >
                {ALL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
                Modalidade
              </label>
              <select
                value={formData.modality}
                onChange={(e) => setFormData({ ...formData, modality: e.target.value as Modality })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3 py-2.5 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              >
                {ALL_MODALITIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Datas: Início, Fim, Inscrição, Expiração */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] dark:text-[#9aa1ad] mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value || null })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-2 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] dark:text-[#9aa1ad] mb-1">
                Data Término
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-2 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] dark:text-[#9aa1ad] mb-1">
                Prazo Inscrição
              </label>
              <input
                type="date"
                value={formData.registrationDeadline || ''}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value || null })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-2.5 py-2 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">
                Data Expiração *
              </label>
              <input
                type="date"
                required
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full rounded-xl border border-amber-300 bg-amber-50/50 px-2.5 py-2 text-xs font-bold text-[#121417] focus:outline-none dark:border-amber-500/40 dark:bg-amber-950/20 dark:text-amber-200"
              />
            </div>
          </div>

          {/* Links e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
                URL Oficial *
              </label>
              <input
                type="url"
                required
                value={formData.officialUrl}
                onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2.5 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
                URL Imagem
              </label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value || null })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2.5 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
          </div>

          {/* Local e Área Temática */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
                Localização (Cidade/Campus)
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2.5 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-1.5">
                Área Temática
              </label>
              <input
                type="text"
                value={formData.thematicArea || ''}
                onChange={(e) => setFormData({ ...formData, thematicArea: e.target.value || null })}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2.5 text-xs font-medium text-[#121417] focus:outline-none dark:border-[#242831] dark:bg-[#181b22] dark:text-white"
              />
            </div>
          </div>

          {/* Flags: Gratuita e Aberta a Todos */}
          <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] p-3.5 dark:border-[#242831] dark:bg-[#181b22]">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#121417] dark:text-white">
              <input
                type="checkbox"
                checked={formData.isFree}
                onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                className="h-4 w-4 rounded accent-[#121417] dark:accent-white"
              />
              <span>100% Gratuita</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#121417] dark:text-white">
              <input
                type="checkbox"
                checked={formData.isForAll}
                onChange={(e) => setFormData({ ...formData, isForAll: e.target.checked })}
                className="h-4 w-4 rounded accent-[#121417] dark:accent-white"
              />
              <span>Aberta a Alunos Externos / Toda a Comunidade</span>
            </label>
          </div>

          {/* Públicos-Alvo Recomendados */}
          <div>
            <label className="block text-xs font-bold text-[#121417] dark:text-stone-200 uppercase tracking-wider mb-2">
              Público-Alvo Recomendado
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_AUDIENCES.map((aud) => {
                const selected = formData.targetCourseAudiences.includes(aud);
                return (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => handleAudienceToggle(aud)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                      selected
                        ? 'bg-[#121417] text-white dark:bg-white dark:text-[#121417]'
                        : 'bg-[#f1f3f6] text-[#64748b] hover:bg-[#e5e7eb] dark:bg-[#1e222a] dark:text-[#9aa1ad]'
                    }`}
                  >
                    {aud.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#f1f3f6] pt-5 dark:border-[#242831]">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleSoftDelete}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? 'Ocultando...' : 'Soft Delete (Expirar Agora)'}</span>
            </button>

            <div className="flex w-full sm:w-auto items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-xs font-bold text-[#64748b] hover:bg-[#f1f3f6] dark:border-[#242831] dark:text-[#9aa1ad] dark:hover:bg-[#181b22]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#121417] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
