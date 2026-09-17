'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
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

  const initialEmailFilled = useRef(false);
  useEffect(() => {
    if (user?.email && !userEmail && !initialEmailFilled.current) {
      initialEmailFilled.current = true;
      queueMicrotask(() => {
        setUserEmail(user.email);
      });
    }
  }, [user, userEmail]);

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

    if (suggestion.trim().length < 10) {
      setErrorMessage('Por favor, detalhe sua sugestão com pelo menos 10 caracteres.');
      return;
    }

    const payload = {
      type,
      suggestion: suggestion.trim(),
      userEmail: userEmail.trim() || undefined,
    };

    if (!user || !token) {
      setPendingDraft(payload);
      requireAuth(() => {});
      return;
    }

    await executeSubmission(payload, token);
  };

  const handleResetSuccess = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <section id="sugestoes" className="relative py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Coluna Esquerda: Texto Editorial */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#697282] dark:text-[#9aa1ad]">
                COLABORAÇÃO DIRETA
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#121417] dark:text-white uppercase leading-[1.05]">
                Sugira uma Nova Fonte
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#4b5563] dark:text-[#9aa1ad]">
                Conhece um edital, portal de pós-graduação, laboratório de pesquisa ou centro acadêmico
                que ainda não está no radar? Envie os detalhes e o link oficial para nossa curadoria.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-[#e5e7eb] dark:border-[#242831]/80">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#121417] text-white text-xs font-bold dark:bg-white dark:text-[#121417]">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#121417] dark:text-white">
                      Conectado como {user.name}
                    </span>
                    <span className="block text-[11px] font-mono text-[#697282] dark:text-[#9aa1ad]">
                      {user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#697282] dark:text-[#9aa1ad]">
                  <p>
                    Você pode escrever sua sugestão livremente. Ao clicar em enviar, se não estiver conectado,
                    você poderá entrar em 1 clique com o Google sem perder nada do que escreveu.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita: Formulário Minimalista de Alto Contraste */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="py-12 px-6 sm:px-10 rounded-[28px] border border-emerald-500/30 bg-emerald-500/5 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#121417] dark:text-white">
                    Sugestão enviada com sucesso!
                  </h3>
                  <p className="mt-2 text-sm text-[#4b5563] dark:text-[#9aa1ad] max-w-md mx-auto leading-relaxed">
                    Muito obrigado por contribuir com a comunidade acadêmica de Pernambuco. Nossa curadoria
                    irá analisar as informações para homologação.
                  </p>
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handleResetSuccess}
                      className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] dark:border-[#242831] bg-white dark:bg-[#121417] px-6 py-2.5 text-xs font-bold text-[#121417] dark:text-white hover:border-[#121417] dark:hover:border-white transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Enviar Outra Sugestão</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Tipo de Sugestão */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white mb-2">
                      Tipo de Contribuição
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as SuggestionType)}
                      className="w-full rounded-2xl border border-[#e5e7eb] dark:border-[#242831] bg-white dark:bg-[#0f1218] px-4 py-3.5 text-xs font-semibold text-[#121417] dark:text-white focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                    >
                      {SUGGESTION_TYPES.map((item) => (
                        <option key={item.value} value={item.value} className="bg-white dark:bg-[#0f1218]">
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mensagem / Detalhes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white">
                        Detalhes da Sugestão ou Link Oficial
                      </label>
                      <span className="text-[11px] font-mono text-[#697282] dark:text-[#9aa1ad]">
                        {suggestion.length} / 2000
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      maxLength={2000}
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Cole aqui o link do portal oficial, edital ou descreva a fonte que você gostaria de ver no Coralink..."
                      className="w-full rounded-2xl border border-[#e5e7eb] dark:border-[#242831] bg-white dark:bg-[#0f1218] p-4 text-xs sm:text-sm text-[#121417] dark:text-white placeholder:text-[#9aa1ad] focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email Opcional */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white mb-2">
                      Seu E-mail para Contato (Opcional)
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Para receber novidades sobre sua indicação"
                      className="w-full rounded-2xl border border-[#e5e7eb] dark:border-[#242831] bg-white dark:bg-[#0f1218] px-4 py-3.5 text-xs text-[#121417] dark:text-white placeholder:text-[#9aa1ad] focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Alerta de Erro */}
                  {errorMessage && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Botão de Envio */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#121417] px-8 py-4 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Enviar Sugestão</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
