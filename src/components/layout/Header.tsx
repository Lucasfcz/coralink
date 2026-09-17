'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, User, Sun, Moon, LogOut, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAuth } from '@/components/providers/AuthProvider';

interface HeaderProps {
  onSearchClick?: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { user, logout, openAuthModal } = useAuth();

  // Fechar menu de perfil ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Destaques', href: '/#destaques' },
    { label: 'Feed', href: '/#feed' },
    { label: 'Sobre', href: '/#sobre' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md transition-colors dark:border-[#242831] dark:bg-[#0a0b0d]/90">
        <div className="flex h-18 w-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10">
          {/* Brand / Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/coralink-logo.png"
                  alt="Coralink Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain dark:invert"
                  priority
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#121417] dark:text-white">
                CORALINK
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions (Search, Profile Icon with Menu, Mobile Menu Button) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="Pesquisar oportunidades"
              className="flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f8f9fa] px-3.5 py-2 text-xs font-medium text-[#64748b] transition-all hover:border-[#121417] hover:text-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad] dark:hover:border-stone-500 dark:hover:text-white"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Buscar oportunidades</span>
            </button>

            {/* Ícone de Perfil / Menu Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-label="Menu de perfil e preferências"
                aria-expanded={profileMenuOpen}
                className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-all ${
                  profileMenuOpen
                    ? 'border-[#121417] bg-[#121417] text-white dark:border-white dark:bg-white dark:text-[#121417]'
                    : 'border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] hover:border-[#121417] dark:border-[#242831] dark:bg-[#181b22] dark:text-[#f3f4f6] dark:hover:border-stone-500'
                }`}
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : user ? (
                  <span className="text-xs font-extrabold uppercase">
                    {user.name.charAt(0)}
                  </span>
                ) : (
                  <User className="h-4.5 w-4.5" />
                )}
              </button>

              {/* Dropdown Menu Flutuante */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-[#e5e7eb] bg-white p-2.5 shadow-xl backdrop-blur-xl transition-all dark:border-[#242831] dark:bg-[#15181e] z-50">
                  {/* Dados do Usuário Logado */}
                  {user && (
                    <>
                      <div className="mb-2 px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#1a1d24]">
                        <p className="truncate text-xs font-bold text-[#121417] dark:text-white">
                          {user.name}
                        </p>
                        <p className="truncate text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
                          {user.email}
                        </p>
                      </div>
                      <div className="mb-2 border-t border-[#f1f3f6] dark:border-[#242831]" />
                    </>
                  )}

                  {/* Alternador de Tema: Claro / Escuro */}
                  <div className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-[#f8f9fa] dark:bg-[#1c2027]">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#121417] dark:text-[#f3f4f6]">
                      {theme === 'dark' ? (
                        <Moon className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Sun className="h-4 w-4 text-amber-500" />
                      )}
                      <span>{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      role="switch"
                      aria-checked={theme === 'dark'}
                      aria-label="Alternar modo escuro"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        theme === 'dark' ? 'bg-[#121417] dark:bg-emerald-500' : 'bg-[#d1d5db]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Linha Divisória */}
                  <div className="my-2 border-t border-[#f1f3f6] dark:border-[#242831]" />

                  {/* Atalho Restrito: Painel Administrativo (Apenas ROLE_ADMIN) */}
                  {user?.role === 'ROLE_ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileMenuOpen(false)}
                      className="mb-2 flex w-full items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs font-bold text-amber-700 transition-all hover:bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/15"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                        <span>Painel Admin</span>
                      </div>
                      <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Admin
                      </span>
                    </Link>
                  )}

                  {/* Botão de Ação: Entrar ou Logout */}
                  {user ? (
                    <button
                      type="button"
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        await logout();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 px-3 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sair da conta</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#121417] py-2.5 px-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-black dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Entrar ou Cadastrar</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#121417] md:hidden dark:border-[#242831] dark:text-[#f3f4f6]"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-[#e5e7eb] bg-white px-4 py-6 shadow-xl md:hidden dark:border-[#242831] dark:bg-[#15181e]">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#121417] hover:text-[#4b5563] dark:text-white dark:hover:text-stone-300"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#f1f3f6] dark:border-[#242831] flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#1a1d24]">
                      <p className="truncate text-sm font-bold text-[#121417] dark:text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-[#64748b] dark:text-[#9aa1ad]">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await logout();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair da conta</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#121417] py-3 text-sm font-semibold text-white dark:bg-white dark:text-[#121417]"
                  >
                    <User className="h-4 w-4" />
                    <span>Entrar ou Cadastrar</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
