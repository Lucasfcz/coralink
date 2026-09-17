'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  Mail,
  RotateCcw,
  MessageSquarePlus,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  createUserHelp,
  SuggestionType,
  SuggestionError,
} from '@/services/userHelp';

const SUGGESTION_TYPES: { value: SuggestionType; label: string }[] = [
  { value: 'FEATURE', label: 'Sugerir Nova Fonte de Oportunidades' },
  { value: 'OPINION', label: 'Opinião / Feedback / Ideia' },
  { value: 'BUG', label: 'Reportar Problema ou Inconsistência' },
  { value: 'OTHER', label: 'Outro Assunto' },
];

export function SobreSuggestionForm() {
  const { user, token, requireAuth } = useAuth();

  const [type, setType] = useState<SuggestionType>('FEATURE');
  const [suggestion, setSuggestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Rascunho retido em memória aguardando login
  const [pendingDraft, setPendingDraft] = useState<{
    type: SuggestionType;
    suggestion: string;
    userEmail?: string;
  } | null>(null);

  // Preenche o email com o do usuário autenticado como sugestão inicial se estiver vazio
  const initialEmailFilled = useRef(false);
  useEffect(() => {
    if (user?.email && !userEmail && !initialEmailFilled.current) {
      initialEmailFilled.current = true;
      queueMicrotask(() => {
        setUserEmail(user.email);
      });
    }
  }, [user, userEmail]);

  // Função central de despacho para a API
  const executeSubmission = async (
    payload: { type: SuggestionType; suggestion: string; userEmail?: string },
    authToken: string
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createUserHelp(payload, authToken);
      setIsSuccess(true);
      setSuggestion('');
      setPendingDraft(null);
    } catch (err: unknown) {
      if (err instanceof SuggestionError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          'Ocorreu uma falha ao enviar sua sugestão. Verifique sua conexão e tente novamente.'
        );
      }
      setPendingDraft(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reação automática pós-autenticação: se havia rascunho pendente e novo token chegou
  useEffect(() => {
    if (token && pendingDraft && !isSubmitting && !isSuccess) {
      const draftToSubmit = pendingDraft;
      queueMicrotask(() => {
        executeSubmission(draftToSubmit, token);
      });
    }
  }, [token, pendingDraft, isSubmitting, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedSuggestion = suggestion.trim();

    if (trimmedSuggestion.length < 10) {
      setErrorMessage(
        'A descrição deve ter pelo menos 10 caracteres para que possamos entender o pedido.'
      );
      return;
    }

    if (trimmedSuggestion.length > 2000) {
      setErrorMessage('A descrição não pode ultrapassar 2000 caracteres.');
      return;
    }

    const payload = {
      type,
      suggestion: trimmedSuggestion,
      userEmail: userEmail.trim() || undefined,
    };

    // Caso o usuário não esteja logado, preserva o rascunho e dispara o modal de autenticação
    if (!token) {
      setPendingDraft(payload);
      requireAuth(() => {
        // Callback executado caso já estivesse logado (fallback)
        if (token) {
          executeSubmission(payload, token);
        }
      });
      return;
    }

    // Usuário logado: despacha diretamente
    await executeSubmission(payload, token);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSuggestion('');
    setErrorMessage(null);
    setType('FEATURE');
  };

  const charCount = suggestion.length;
  const isTooShort = charCount > 0 && charCount < 10;
  const isOverLimit = charCount > 2000;

  return (
    <section
      id="sugerir"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white/80 p-6 sm:p-10 md:p-12 shadow-xl backdrop-blur-xl transition-all dark:border-[#242831] dark:bg-[#121417]/85 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Glow de fundo sutil */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />

        {/* Header editorial da seção */}
        <div className="relative mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Colaboração & Comunidade</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#121417] dark:text-white">
            Sugira uma Nova Fonte ou Envie seu Feedback
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#64748b] dark:text-[#9aa1ad] max-w-2xl">
            Conhece um edital ou portal de bolsas que ainda não está aqui? Mande
            para a gente. O Coralink é construído em conjunto com os estudantes.
          </p>

          {/* Identificação da Sessão */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {user ? (
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#f8f9fa] px-3 py-1.5 text-xs font-medium text-[#121417] border border-[#e5e7eb] dark:border-[#242831] dark:bg-[#1a1d24] dark:text-[#f3f4f6]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[#64748b] dark:text-[#9aa1ad]">
                  Conectado como:
                </span>
                <span className="font-bold">{user.name}</span>
                {user.email && (
                  <span className="text-[11px] text-[#9aa1ad] dark:text-[#64748b]">
                    ({user.email})
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/20">
                <UserIcon className="h-3.5 w-3.5" />
                <span>
                  Você pode escrever agora! O login será solicitado apenas ao enviar para registrar sua colaboração.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feedback visual de Sucesso */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center sm:p-12 dark:border-emerald-400/30 dark:bg-emerald-400/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 dark:bg-emerald-400 dark:text-[#0a0b0d]">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-bold text-[#121417] dark:text-white">
                Sugestão Enviada com Sucesso!
              </h3>

              <p className="mt-2 text-sm text-[#64748b] dark:text-[#9aa1ad] max-w-md">
                Muito obrigado por contribuir com a expansão do Coralink. Nossos
                robôs e equipe editorial já receberam seu envio para avaliação.
              </p>

              <button
                type="button"
                onClick={handleResetForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#121417] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Enviar outra sugestão</span>
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Alerta de erro */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-700 dark:border-rose-400/30 dark:text-rose-300"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Atenção</p>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              {/* Grid 2 colunas: Tipo de Sugestão e Email de Contato */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Campo: Tipo de Sugestão */}
                <div>
                  <label
                    htmlFor="suggestion-type"
                    className="block text-xs font-bold uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad] mb-2"
                  >
                    Tipo de Sugestão <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="suggestion-type"
                      value={type}
                      onChange={(e) => setType(e.target.value as SuggestionType)}
                      disabled={isSubmitting}
                      className="w-full appearance-none rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 pr-10 text-sm font-medium text-[#121417] transition-all focus:border-[#121417] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#121417] disabled:opacity-60 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:focus:border-white dark:focus:bg-[#15181e] dark:focus:ring-white"
                    >
                      {SUGGESTION_TYPES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1ad]" />
                  </div>
                </div>

                {/* Campo: Email de Contato (Opcional) */}
                <div>
                  <label
                    htmlFor="user-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad] mb-2"
                  >
                    Email para Contato{' '}
                    <span className="text-[11px] font-normal text-[#9aa1ad] lowercase">
                      (opcional)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="user-email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="exemplo@universidade.br"
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] px-4 py-3 pl-10 text-sm font-medium text-[#121417] transition-all placeholder:text-[#9aa1ad] focus:border-[#121417] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#121417] disabled:opacity-60 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:focus:border-white dark:focus:bg-[#15181e] dark:focus:ring-white"
                    />
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1ad]" />
                  </div>
                </div>
              </div>

              {/* Textarea: Descrição da Sugestão */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="suggestion-text"
                    className="block text-xs font-bold uppercase tracking-wider text-[#4b5563] dark:text-[#9aa1ad]"
                  >
                    Descrição da Sugestão{' '}
                    <span className="text-emerald-500">*</span>
                  </label>
                  <span
                    className={`text-xs font-mono font-medium ${
                      isOverLimit
                        ? 'text-rose-500 font-bold'
                        : isTooShort
                        ? 'text-amber-500'
                        : 'text-[#9aa1ad]'
                    }`}
                  >
                    {charCount} / 2000
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="suggestion-text"
                    rows={5}
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Conte para nós: qual universidade, centro de pesquisa, empresa ou edital gostaria de ver integrado? Se for um erro ou ideia, compartilhe os detalhes..."
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 text-sm font-medium text-[#121417] transition-all placeholder:text-[#9aa1ad] focus:border-[#121417] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#121417] disabled:opacity-60 dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:focus:border-white dark:focus:bg-[#15181e] dark:focus:ring-white resize-y"
                  />
                </div>

                <p className="mt-1.5 text-xs text-[#9aa1ad] dark:text-[#64748b]">
                  Mínimo de 10 caracteres e máximo de 2000. Seja o mais específico
                  possível com links ou nomes de órgãos oficiais.
                </p>
              </div>

              {/* Botão de Envio */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-[#64748b] dark:text-[#9aa1ad] flex items-center gap-1.5">
                  <MessageSquarePlus className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>
                    Todas as contribuições são analisadas e priorizadas pela nossa equipe.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isTooShort || isOverLimit || !suggestion.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#121417] px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-400 dark:text-emerald-600" />
                      <span>Enviando sugestão...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Enviar Sugestão</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
