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
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

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
  const { toggleTheme } = useTheme();

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

  const handleSwitchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between text-[#121417] dark:text-white selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Background Fotográfico Dinâmico (Cais da Aurora - Dia no modo claro / Noite no modo escuro) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        {/* Imagem Diurna (Modo Claro) */}
        <div className="relative h-full w-full dark:hidden">
          <Image
            src="/images/recife-cais-day.jpg"
            alt="Cais da Aurora ensolarado no Recife"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          {/* Overlays suaves para garantir contraste no modo claro */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/55 to-white/90" />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
        </div>

        {/* Imagem Noturna (Modo Escuro) */}
        <div className="relative h-full w-full hidden dark:block">
          <Image
            src="/images/recife-cais-night.jpg"
            alt="Cais da Aurora iluminado à noite no Recife"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          {/* Overlays cinematográficos no modo escuro */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d]/85 via-[#0a0b0d]/65 to-[#0a0b0d]/90" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
      </div>

      {/* 1. Header / Navbar Superior (Seguindo o padrão do Header existente) */}
      <header className="sticky top-0 z-30 w-full border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0a0b0d]/70 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Logo Coralink */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/coralink-logo.png"
                alt="Coralink Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tight text-[#121417] dark:text-white">
              Coralink
            </span>
          </Link>

          {/* Links e Ações */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-bold text-[#4b5563] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors px-2 py-1"
            >
              Início
            </Link>
            <Link
              href="/#destaques"
              className="hidden md:inline-flex text-xs font-bold text-[#4b5563] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors px-2 py-1"
            >
              Destaques
            </Link>
            <Link
              href="/#feed"
              className="hidden md:inline-flex text-xs font-bold text-[#4b5563] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors px-2 py-1"
            >
              Feed
            </Link>
            <Link
              href="/sobre"
              className="hidden sm:inline-flex text-xs font-bold text-[#4b5563] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white transition-colors px-2 py-1"
            >
              Sobre
            </Link>

            {/* Alternador de Tema Claro / Escuro */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 text-[#121417] dark:text-white shadow-xs backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
              title="Alternar entre modo claro e escuro"
              aria-label="Alternar tema"
            >
              <Sun className="h-4 w-4 hidden dark:block text-amber-300 transition-transform" />
              <Moon className="h-4 w-4 block dark:hidden text-[#121417] transition-transform" />
            </button>

            {/* Botão "Voltar ao Início" */}
            <Link
              href={safeRedirect}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3.5 py-2 text-xs font-bold text-[#121417] dark:text-white shadow-xs backdrop-blur-md transition-all hover:bg-white dark:hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Voltar ao Início</span>
              <span className="xs:hidden">Início</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Conteúdo Principal: Composição com Panorama à Esquerda e Card Flutuante à Direita (Inspirado na Referência) */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-between px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Coluna Esquerda: Mensagem Editorial Flutuante sobre o Recife */}
        <div className="hidden lg:flex flex-col justify-center max-w-lg pr-8">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-black/50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#4b5563] dark:text-stone-300 backdrop-blur-md shadow-xs mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Cais da Aurora • Rio Capibaribe
          </span>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-[#121417] dark:text-white leading-[1.1] drop-shadow-xs">
            Conectando você às maiores oportunidades de Pernambuco.
          </h2>

          <p className="mt-4 text-base text-[#4b5563] dark:text-stone-300 leading-relaxed font-medium">
            Editais acadêmicos, bolsas de pesquisa, estágios e eventos dos maiores polos universitários e tecnológicos centralizados em um só lugar.
          </p>

          <div className="mt-8 flex items-center gap-3 text-xs font-mono text-[#697282] dark:text-[#9aa1ad]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>12 Fontes Oficiais Monitoradas em Tempo Real</span>
          </div>
        </div>

        {/* Coluna Direita: Card Flutuante Translúcido (Glassmorphism de Alto Nível) */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto rounded-[28px] sm:rounded-[32px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-[#0c0f17]/90 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_24px_80px_rgba(0,0,0,0.14)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
          {/* Cabeçalho do Formulário */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121417] dark:text-white">
              {mode === 'login' ? 'Olá! Bem-vindo de volta' : 'Crie sua conta'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#697282] dark:text-stone-400">
              {mode === 'login'
                ? 'Informe suas credenciais para acessar a plataforma.'
                : 'Junte-se à maior rede de oportunidades acadêmicas de PE.'}
            </p>
          </div>

          {/* Alternador de Abas: Entrar / Criar Conta */}
          <div className="mb-6 flex rounded-2xl border border-black/10 dark:border-white/10 bg-[#f3f4f6] dark:bg-[#080a0e] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#121417] shadow-sm dark:bg-white dark:text-[#0a0b0d]'
                  : 'text-[#697282] hover:text-[#121417] dark:text-stone-400 dark:hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#121417] shadow-sm dark:bg-white dark:text-[#0a0b0d]'
                  : 'text-[#697282] hover:text-[#121417] dark:text-stone-400 dark:hover:text-white'
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
                className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-600 dark:text-rose-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo: Nome Completo (Modo Cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-stone-300 mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#080a0e]/90 py-3 pr-4 pl-10 text-xs font-medium text-[#121417] dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Campo: Email */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] dark:text-stone-300 mb-1.5">
                Email Institucional ou Pessoal
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@ufpe.br ou pessoal@gmail.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#080a0e]/90 py-3 pr-4 pl-10 text-xs font-medium text-[#121417] dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Campo: Senha */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] dark:text-stone-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#080a0e]/90 py-3 pr-11 pl-10 text-xs font-medium text-[#121417] dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#9ca3af] hover:text-[#121417] dark:text-stone-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Campo: Confirmação de Senha (Modo Cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#374151] dark:text-stone-300 mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#080a0e]/90 py-3 pr-4 pl-10 text-xs font-medium text-[#121417] dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-[#121417] dark:focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Opções: Lembrar de mim */}
            <div className="flex items-center justify-between pt-1 text-xs text-[#697282] dark:text-stone-400">
              <label className="flex items-center gap-2 cursor-pointer select-none hover:text-[#121417] dark:hover:text-stone-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>Lembrar de mim</span>
              </label>
            </div>

            {/* Botão de Ação Primário de Alto Contraste */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#121417] text-white py-3.5 px-6 text-xs font-bold shadow-md transition-all hover:bg-black active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-[#0a0b0d] dark:shadow-white/10 dark:hover:bg-stone-200 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#0a0b0d]" />
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
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <span className="relative bg-white/95 dark:bg-[#0c0f17] px-3.5 text-[11px] font-semibold uppercase tracking-wider text-[#697282] dark:text-stone-400">
              Ou continue com
            </span>
          </div>

          {/* Container de Botões Sociais */}
          <div className="space-y-3">
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
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 py-3 text-xs font-semibold text-[#121417] dark:text-white shadow-xs transition-all hover:bg-black/10 dark:hover:bg-white/10 active:scale-[0.99] cursor-pointer"
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
                className="mt-1 text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 hover:underline transition-colors cursor-pointer block mx-auto"
              >
                ⚡ Simular login de teste (Mock Dev)
              </button>
            )}
          </div>

          {/* Rodapé do Formulário: Alternador Rápido */}
          <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-[#697282] dark:text-stone-400">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-[#121417] dark:text-white underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#697282] dark:text-stone-400">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-[#121417] dark:text-white underline underline-offset-4 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Entrar
                </button>
              </p>
            )}

            {/* Links Institucionais e Legais */}
            <p className="mt-3 text-[11px] leading-relaxed text-[#697282] dark:text-stone-500">
              Ao continuar, você concorda com nossos{' '}
              <Link
                href="/termos-de-uso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b5563] dark:text-stone-400 underline underline-offset-2 hover:text-[#121417] dark:hover:text-white transition-colors"
              >
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link
                href="/politica-de-privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b5563] dark:text-stone-400 underline underline-offset-2 hover:text-[#121417] dark:hover:text-white transition-colors"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginLoadingSkeleton() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fbfbfb] text-[#121417] dark:bg-[#0a0b0d] dark:text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="text-xs text-[#697282] dark:text-stone-400 font-mono tracking-wider">
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
