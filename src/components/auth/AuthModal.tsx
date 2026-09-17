'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useModalScrollLock } from '@/hooks/useModalScrollLock';

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: string;
      theme?: string;
      size?: string;
      text?: string;
      shape?: string;
      logo_alignment?: string;
      width?: number;
    }
  ) => void;
  prompt: () => void;
}

interface WindowWithGoogle extends Window {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
  __coralink_gsi_initialized?: boolean;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    if (err.message === 'Failed to fetch' || err.message.includes('fetch') || err.name === 'TypeError') {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente em instantes.';
    }
    return err.message;
  }
  return fallback;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  useModalScrollLock(isOpen);
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
  };

  // Inicializar Google Identity Services (GSI)
  useEffect(() => {
    if (!isOpen) return;

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '1080294900129-9kg4vcrbj3obfsq566gtsfjen9toar7i.apps.googleusercontent.com';

    const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
      if (response?.credential) {
        try {
          setSubmitting(true);
          setErrorMessage(null);
          await loginWithGoogle(response.credential);
          onClose();
        } catch (err: unknown) {
          setErrorMessage(
            getErrorMessage(err, 'Falha ao autenticar com Google. Tente novamente.')
          );
        } finally {
          setSubmitting(false);
        }
      }
    };

    const setupGsi = () => {
      if (typeof window === 'undefined') return;
      const win = window as unknown as WindowWithGoogle;
      if (win.google?.accounts?.id) {
        try {
          if (!win.__coralink_gsi_initialized) {
            win.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleResponse,
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            win.__coralink_gsi_initialized = true;
          }

          const btnElem = document.getElementById('google-gis-btn-container');
          if (btnElem) {
            btnElem.innerHTML = '';
            win.google.accounts.id.renderButton(btnElem, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
              width: 320,
            });
            setGoogleReady(true);
          }
        } catch {
          // Fallback silencioso
        }
      }
    };

    const win = typeof window !== 'undefined' ? (window as unknown as WindowWithGoogle) : undefined;
    if (win?.google?.accounts?.id) {
      setupGsi();
    } else {
      const timer = setInterval(() => {
        const currentWin = typeof window !== 'undefined' ? (window as unknown as WindowWithGoogle) : undefined;
        if (currentWin?.google?.accounts?.id) {
          clearInterval(timer);
          setupGsi();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isOpen, loginWithGoogle, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(name, email, password);
      }
      onClose();
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err, 'Ocorreu um erro ao processar sua solicitação.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevMockLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await loginWithGoogle('dev-mock-lucas@coralink.test');
      onClose();
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err, 'O servidor de produção não aceita tokens de mock.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
          {/* Backdrop escuro com desfoque */}
          <motion.div
            key="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Container Principal Split Modal */}
          <motion.div
            key="auth-modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            className="relative z-10 flex w-full max-w-[920px] max-h-[92vh] flex-col overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-2xl md:flex-row dark:border-[#242831] dark:bg-[#15181e]"
          >
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white/80 text-[#64748b] backdrop-blur-md transition-all hover:bg-[#121417] hover:text-white dark:border-[#242831] dark:bg-[#1c2027]/80 dark:text-[#9aa1ad] dark:hover:bg-white dark:hover:text-[#121417]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* LADO ESQUERDO: Visual Conceitual e Editorial da Marca */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0c0e12] via-[#12151c] to-[#1a1f29] p-7 sm:p-10 text-white md:w-[45%]">
              {/* Elementos gráficos abstratos no fundo */}
              <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

              {/* Círculos e curvas orgânicas */}
              <div className="pointer-events-none absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-20">
                <svg width="280" height="280" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="1" />
                </svg>
              </div>

              {/* Top: Logo Coralink Limpa */}
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Image
                      src="/coralink-logo.png"
                      alt="Coralink Logo"
                      width={36}
                      height={36}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <span className="text-2xl font-extrabold tracking-tight text-white">
                    CORALINK
                  </span>
                </div>
              </div>

            {/* Middle: Manifesto Visual */}
            <div className="relative z-10 my-8">
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-white">
                Conectando talentos universitários ao futuro da inovação.
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-stone-300">
                Acesse editais, bolsas de pesquisa, estágios e eventos monitorados diariamente em tempo real.
              </p>
            </div>

            {/* Bottom: Rodapé institucional */}
            <div className="relative z-10 border-t border-white/10 pt-4 text-[11px] text-stone-400">
              <p>Plataforma aberta e inteligente para a comunidade acadêmica.</p>
            </div>
          </div>

          {/* LADO DIREITO: Formulário Clean & Editorial */}
          <div className="flex flex-1 flex-col justify-start md:justify-center overflow-y-auto p-6 sm:p-8 md:p-10">
            {/* Alternador de Abas: Entrar / Cadastrar */}
            <div className="mb-6 flex rounded-xl border border-[#e5e7eb] bg-[#f8f9fa] p-1 dark:border-[#242831] dark:bg-[#181b22]">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#121417] shadow-xs dark:bg-[#20242b] dark:text-white'
                    : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  mode === 'register'
                    ? 'bg-white text-[#121417] shadow-xs dark:bg-[#20242b] dark:text-white'
                    : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Cabeçalho do Formulário */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#121417] dark:text-white">
                {mode === 'login' ? 'Bem-vindo de volta' : 'Crie seu perfil acadêmico'}
              </h3>
              <p className="mt-1 text-xs text-[#64748b] dark:text-[#9aa1ad]">
                {mode === 'login'
                  ? 'Acesse para salvar oportunidades e personalizar seu feed.'
                  : 'Fique à frente dos editais e vagas de tecnologia mais concorridos.'}
              </p>
            </div>

            {/* Mensagem de Erro */}
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#121417] dark:text-[#e5e7eb]">
                    Nome Completo
                  </label>
                  <div className="relative mt-1">
                    <UserIcon className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9aa1ad]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Lucas Silva"
                      className="w-full rounded-xl border border-[#e5e7eb] bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-[#121417] placeholder:text-[#9aa1ad] focus:border-[#121417] focus:outline-none focus:ring-1 focus:ring-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#121417] dark:text-[#e5e7eb]">
                  E-mail
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9aa1ad]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@universidade.edu.br"
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white py-2.5 pr-4 pl-10 text-xs font-medium text-[#121417] placeholder:text-[#9aa1ad] focus:border-[#121417] focus:outline-none focus:ring-1 focus:ring-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-white dark:focus:border-white dark:focus:ring-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#121417] dark:text-[#e5e7eb]">
                  Senha
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9aa1ad]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white py-2.5 pr-10 pl-10 text-xs font-medium text-[#121417] placeholder:text-[#9aa1ad] focus:border-[#121417] focus:outline-none focus:ring-1 focus:ring-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-white dark:focus:border-white dark:focus:ring-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#9aa1ad] hover:text-[#121417] dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Opções extras */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#64748b] dark:text-[#9aa1ad]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#d1d5db] text-[#121417] focus:ring-0"
                  />
                  <span>Lembrar de mim</span>
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="font-medium text-[#64748b] hover:text-[#121417] hover:underline dark:text-[#9aa1ad] dark:hover:text-white"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>

              {/* Botão de Submissão */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#121417] py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg disabled:opacity-50 dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200 mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : mode === 'login' ? (
                  'Entrar na Conta'
                ) : (
                  'Começar Gratuitamente'
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-4 text-center text-xs">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb] dark:border-[#242831]" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-medium text-[#9aa1ad] dark:bg-[#15181e]">
                ou continue com
              </span>
            </div>

            {/* Botão Social Google Oficial renderizado via GIS */}
            <div className="flex flex-col items-center gap-2">
              <div id="google-gis-btn-container" className="flex justify-center w-full min-h-[44px]" />

              {/* Fallback de Botão caso GIS ainda esteja montando */}
              {!googleReady && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    const win = typeof window !== 'undefined' ? (window as unknown as WindowWithGoogle) : undefined;
                    if (win?.google?.accounts?.id) {
                      win.google.accounts.id.prompt();
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full border border-[#e5e7eb] bg-white py-2.5 text-xs font-semibold text-[#121417] shadow-2xs transition-all hover:bg-[#f8f9fa] hover:border-[#d1d5db] dark:border-[#242831] dark:bg-[#181b22] dark:text-white dark:hover:bg-[#1e232b]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continuar com o Google</span>
                </button>
              )}

              {/* Atalho de teste para ambiente Dev se desejado */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={handleDevMockLogin}
                  className="mt-1 text-[11px] text-[#9aa1ad] hover:text-[#121417] hover:underline dark:hover:text-white"
                >
                  ⚡ Simular login de teste (Mock Dev)
                </button>
              )}

              {/* Aviso Legal Discreto (Termos e Privacidade) */}
              <p className="mt-3 text-center text-[11px] leading-relaxed text-[#64748b] dark:text-[#9aa1ad]">
                Ao continuar, você concorda com nossos{' '}
                <Link
                  href="/termos-de-uso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#121417] underline underline-offset-2 hover:text-black dark:text-[#f3f4f6] dark:hover:text-white"
                >
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link
                  href="/politica-de-privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#121417] underline underline-offset-2 hover:text-black dark:text-[#f3f4f6] dark:hover:text-white"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}
