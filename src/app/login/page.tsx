'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

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
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    if (
      err.message === 'Failed to fetch' ||
      err.message.includes('fetch') ||
      err.name === 'TypeError'
    ) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente em instantes.';
    }
    return err.message;
  }
  return fallback;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();

  // Preservação de Retorno seguro
  const rawRedirect = searchParams.get('redirect') || '/';
  const safeRedirect =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
      ? rawRedirect
      : '/';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Redireciona imediatamente se já estiver logado
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(safeRedirect);
    }
  }, [user, isLoading, router, safeRedirect]);

  // Inicialização do Google Identity Services (GIS)
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    const setupGsi = () => {
      const win = typeof window !== 'undefined' ? (window as unknown as WindowWithGoogle) : undefined;
      if (!win?.google?.accounts?.id) return;

      try {
        win.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: GoogleCredentialResponse) => {
            if (response.credential) {
              setSubmitting(true);
              setErrorMessage(null);
              try {
                await loginWithGoogle(response.credential);
                router.push(safeRedirect);
              } catch (err: unknown) {
                setErrorMessage(
                  getErrorMessage(err, 'Falha ao autenticar com sua conta Google.')
                );
              } finally {
                setSubmitting(false);
              }
            }
          },
        });

        const targetDiv = document.getElementById('google-login-btn-target');
        if (targetDiv) {
          targetDiv.innerHTML = '';
          win.google.accounts.id.renderButton(targetDiv, {
            type: 'standard',
            theme: 'filled_black',
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
  }, [loginWithGoogle, router, safeRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotSent(false);

    if (mode === 'register') {
      if (password.length < 6) {
        setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem. Por favor, verifique.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(name, email, password);
      }
      router.push(safeRedirect);
    } catch (err: unknown) {
      setErrorMessage(
        getErrorMessage(err, 'Ocorreu um erro ao processar sua solicitação.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevMockLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await loginWithGoogle('dev-mock-lucas@coralink.test');
      router.push(safeRedirect);
    } catch (err: unknown) {
      setErrorMessage(
        getErrorMessage(err, 'O servidor de desenvolvimento recusou o login mock.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setErrorMessage('Por favor, preencha o campo de e-mail para recuperar sua senha.');
      return;
    }
    setForgotSent(true);
    setErrorMessage(null);
  };

  const handleSwitchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setErrorMessage(null);
    setForgotSent(false);
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-[#0a0b0d] text-white selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Luzes de fundo atmosféricas iridescentes (Dark Tech Ambient Mesh) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-32 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[160px]" />
        {/* Padrão de micro-grid cibernético ultra discreto */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Card Flutuante Principal em Split-Screen (Inspirado na Imagem 1) */}
      <div className="relative z-10 w-full max-w-[1040px] rounded-[32px] sm:rounded-[36px] border border-white/10 bg-[#0f1218]/90 backdrop-blur-2xl shadow-[0_32px_96px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ======================================================== */}
        {/* LADO ESQUERDO: Composição Arquitetônica Cinematográfica */}
        {/* ======================================================== */}
        <div className="relative hidden lg:block lg:col-span-5 overflow-hidden bg-black">
          <div className="relative h-full min-h-[640px] w-full">
            <Image
              src="/images/recife-porto-digital-cinematic.jpg"
              alt="Vista noturna cinematográfica do Porto Digital e pontes históricas do Recife"
              fill
              className="object-cover object-center brightness-95 contrast-105"
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* Vinhetas gradientes sutis para fundir com as bordas do card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0f1218] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* LADO DIREITO: Card de Autenticação Minimalista          */}
        {/* ======================================================== */}
        <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 lg:col-span-7 bg-[#0f1218]/60">
          {/* Topo: Voltar ao Coralink (Sem selos redundantes) */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={safeRedirect}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-stone-400 group-hover:text-white" />
              <span>Voltar ao Coralink</span>
            </Link>
          </div>

          {/* Cabeçalho do Formulário */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-400">
              O portal unificado de editais, bolsas e estágios universitários de Pernambuco.
            </p>
          </div>

          {/* Alternador de Abas: Entrar / Criar Conta */}
          <div className="mb-6 flex rounded-2xl border border-white/10 bg-[#080a0e] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-white text-[#0a0b0d] shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-white text-[#0a0b0d] shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Mensagens de Alerta ou Sucesso */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                key="error-alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {forgotSent && (
              <motion.div
                key="forgot-alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Instruções de redefinição enviadas para <strong>{email}</strong>.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo: Nome Completo (Modo Cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Gabriel Albuquerque"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/10 bg-[#080a0e]/90 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Campo: Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Email Institucional ou Pessoal
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@ufpe.br ou pessoal@gmail.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-[#080a0e]/90 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Campo: Senha */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full rounded-2xl border border-white/10 bg-[#080a0e]/90 py-3 pr-11 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Campo: Confirmação de Senha (Modo Cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-white/10 bg-[#080a0e]/90 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Opções: Lembrar de mim & Esqueceu sua senha */}
            <div className="flex items-center justify-between pt-1 text-xs text-stone-400">
              <label className="flex items-center gap-2 cursor-pointer select-none hover:text-stone-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-white/20 bg-white/5 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Lembrar de mim</span>
              </label>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-stone-300 hover:text-white underline underline-offset-2 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              )}
            </div>

            {/* Botão de Ação Primário de Alto Contraste */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-white py-3.5 px-6 text-xs font-bold text-[#0a0b0d] shadow-lg shadow-white/10 transition-all hover:bg-stone-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#0a0b0d]" />
                  <span>Processando...</span>
                </>
              ) : mode === 'login' ? (
                'Entrar no Coralink'
              ) : (
                'Criar Conta Gratuitamente'
              )}
            </button>
          </form>

          {/* Divisor Estilizado */}
          <div className="relative my-6 text-center text-xs">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#0f1218] px-3.5 text-[11px] font-medium uppercase tracking-wider text-stone-500">
              Ou continue com
            </span>
          </div>

          {/* Botão Oficial de Login com o Google via GIS */}
          <div className="flex flex-col items-center gap-2.5">
            <div id="google-login-btn-target" className="flex justify-center w-full min-h-[44px]" />

            {/* Fallback de Botão caso o script GIS ainda esteja carregando */}
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
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.99]"
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

            {/* Atalho Dev Mock em ambiente local */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={handleDevMockLogin}
                className="mt-1 text-[11px] text-stone-500 hover:text-stone-300 hover:underline transition-colors"
              >
                ⚡ Simular login de teste (Mock Dev)
              </button>
            )}
          </div>

          {/* Rodapé do Formulário: Alternador Rápido */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-stone-400">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-white underline underline-offset-4 hover:text-emerald-400 transition-colors"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-400">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-white underline underline-offset-4 hover:text-emerald-400 transition-colors"
                >
                  Entrar
                </button>
              </p>
            )}

            {/* Links Institucionais e Legais */}
            <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
              Ao continuar, você concorda com nossos{' '}
              <Link
                href="/termos-de-uso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 underline underline-offset-2 hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link
                href="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 underline underline-offset-2 hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function LoginLoadingSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0b0d] text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        <span className="text-xs text-stone-400 font-mono tracking-wider">
          Carregando portal de acesso...
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
