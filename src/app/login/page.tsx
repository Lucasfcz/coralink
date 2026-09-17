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
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Cpu,
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
  }, [user, isLoading, safeRedirect, router]);

  // Alternar entre abas limpando mensagens
  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
    setForgotSent(false);
  };

  // Inicialização do Google Identity Services (GIS)
  useEffect(() => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '1080294900129-9kg4vcrbj3obfsq566gtsfjen9toar7i.apps.googleusercontent.com';

    const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
      if (response?.credential) {
        try {
          setSubmitting(true);
          setErrorMessage(null);
          await loginWithGoogle(response.credential);
          router.push(safeRedirect);
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
          win.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnElem = document.getElementById('google-login-btn-target');
          if (btnElem) {
            btnElem.innerHTML = '';
            win.google.accounts.id.renderButton(btnElem, {
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

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#0a0b0d] text-white selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Luzes de fundo atmosféricas iridescentes (Dark Tech Ambient Glows) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[150px]" />
        {/* Padrão de micro-grid cibernético ultra discreto */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>

      {/* Card Principal em Split-Screen com Glassmorphism Editorial */}
      <div className="relative z-10 w-full max-w-[1100px] rounded-[30px] sm:rounded-[36px] border border-white/10 bg-[#0e1117]/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ======================================================== */}
        {/* LADO ESQUERDO: Visual 3D Futurista Contextual Coralink   */}
        {/* ======================================================== */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0a0b0d] via-[#0d1015] to-[#121620] p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 lg:col-span-5">
          {/* Reflexo iridescente interno */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

          {/* Topo: Marca e Badges Oficiais */}
          <div className="relative z-10 space-y-4">
            {/* Header da Marca */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 p-2 shadow-inner">
                <Image
                  src="/coralink-logo.png"
                  alt="Coralink Logo"
                  width={32}
                  height={32}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                  CORALINK
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Pernambuco Acadêmico
                </span>
              </div>
            </div>

            {/* Badges de Destaque Tecnológico */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md shadow-xs">
                <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Ecossistema Acadêmico de Pernambuco</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-medium text-cyan-300 backdrop-blur-md shadow-xs">
                <Cpu className="h-3 w-3 text-cyan-400 shrink-0" />
                <span>Inteligência Artificial & Oportunidades</span>
              </div>
            </div>
          </div>

          {/* Centro: Arte 3D Futurista com Acabamento Dark-Tech */}
          <div className="relative z-10 my-6 sm:my-8 flex flex-col items-center justify-center">
            {/* Halo de luz iridescente em torno da arte */}
            <div className="relative group w-full max-w-[320px] sm:max-w-[340px]">
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-indigo-500/30 opacity-70 blur-xl transition-all duration-700 group-hover:opacity-100 group-hover:blur-2xl" />

              <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-[#0a0b0d] shadow-2xl">
                <Image
                  src="/images/auth-visual.jpg"
                  alt="Escultura 3D futurista de inteligência e oportunidades acadêmicas Coralink"
                  width={680}
                  height={906}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Overlay gradiente inferior para suavizar integração */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-transparent opacity-60" />

                {/* Micro badge flutuante sobre a arte */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/10 bg-[#0e1217]/80 p-2.5 backdrop-blur-md text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-semibold text-stone-200">
                      Radar Universitário Ativo
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    24h / 7d
                  </span>
                </div>
              </div>
            </div>

            {/* Texto Editorial Inspirador */}
            <div className="mt-5 text-center max-w-[320px]">
              <p className="text-xs leading-relaxed text-stone-300">
                O ponto de encontro entre pesquisadores, estagiários e as maiores instituições de ensino de Pernambuco.
              </p>
            </div>
          </div>

          {/* Rodapé do Card Esquerdo: Fontes e Comunidade */}
          <div className="relative z-10 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-stone-400" />
                UFPE • UPE • Porto Digital • CESAR • IFPE
              </span>
              <span className="text-emerald-400 font-medium">100% Gratuito</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LADO DIREITO: Card de Autenticação em Vidro Fosco       */}
        {/* ======================================================== */}
        <div className="relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 lg:col-span-7 bg-[#12151c]/70 backdrop-blur-xl">
          {/* Botão Superior Sutil: Voltar ao Coralink */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={safeRedirect}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-stone-400 group-hover:text-white" />
              <span>Voltar ao Coralink</span>
            </Link>

            <span className="text-[11px] font-mono text-stone-500">
              Ambiente Seguro SSL
            </span>
          </div>

          {/* Cabeçalho do Formulário */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-stone-300">
              O portal definitivo de editais, bolsas e estágios universitários de Pernambuco.
            </p>
          </div>

          {/* Alternador de Abas: Entrar / Criar Conta */}
          <div className="mb-6 flex rounded-2xl border border-white/10 bg-[#090b0e] p-1.5 shadow-inner">
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
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Instruções de recuperação foram enviadas para <strong>{email}</strong> caso o endereço esteja cadastrado.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário de Autenticação */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo: Nome Completo (Apenas no Modo Cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
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
                    className="w-full rounded-2xl border border-white/10 bg-[#0a0c10]/90 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Campo: Email Institucional ou Pessoal */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
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
                  className="w-full rounded-2xl border border-white/10 bg-[#0a0c10]/90 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Campo: Senha */}
            <div>
              <label className="block text-xs font-semibold text-stone-200 mb-1.5">
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
                  className="w-full rounded-2xl border border-white/10 bg-[#0a0c10]/90 py-3 pr-11 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                <label className="block text-xs font-semibold text-stone-200 mb-1.5">
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
                    className="w-full rounded-2xl border border-white/10 bg-[#0a0c10]/90 py-3 pr-4 pl-10 text-xs font-medium text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Opções Utilitárias: Lembrar de mim & Esqueceu sua senha */}
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
              className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-white py-3.5 px-6 text-xs font-bold text-[#0a0b0d] shadow-lg shadow-white/10 transition-all hover:bg-stone-200 hover:shadow-white/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
            <span className="relative bg-[#12151c] px-3.5 text-[11px] font-medium uppercase tracking-wider text-stone-400">
              Ou continue com
            </span>
          </div>

          {/* Botão Oficial de Login com o Google via GIS */}
          <div className="flex flex-col items-center gap-2.5">
            <div id="google-login-btn-target" className="flex justify-center w-full min-h-[44px]" />

            {/* Fallback de Botão de Alta Precisão caso o iframe ainda não tenha carregado */}
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
                className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 py-3 text-xs font-semibold text-white shadow-xs transition-all hover:bg-white/10 hover:border-white/30 active:scale-[0.99]"
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

            {/* Atalho de teste Dev Mock */}
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
