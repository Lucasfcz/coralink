'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Smartphone, Monitor, Download, Share, PlusSquare, MoreVertical, CheckCircle2, Zap, WifiOff } from 'lucide-react';
import { usePWAInstall, PWAInstallPlatform } from '@/hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallModal({ isOpen, onClose }: InstallModalProps) {
  const { platform, canPromptDirectly, isStandalone, promptInstall } = usePWAInstall();
  const [selectedTab, setSelectedTab] = useState<PWAInstallPlatform | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const activeTab = selectedTab ?? platform;

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedTab(null);
    setJustInstalled(false);
    onClose();
  };

  const handleDirectInstall = async () => {
    setIsInstalling(true);
    const result = await promptInstall();
    setIsInstalling(false);
    if (result === 'accepted') {
      setJustInstalled(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-2xl transition-all dark:border-[#242831] dark:bg-[#12151b] dark:text-[#f3f4f6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar modal de instalação"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-[#242831] dark:bg-[#1a1e27] dark:text-stone-400 dark:hover:bg-[#222834] dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#242831] dark:bg-[#181b22]">
            <Image
              src="/icons/icon-192x192.png"
              alt="Ícone do Coralink"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-[#121417] dark:text-white">
                Instalar Coralink
              </h2>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                PWA Oficial
              </span>
            </div>
            <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
              Acesse editais, bolsas e vagas direto da sua tela inicial
            </p>
          </div>
        </div>

        {/* Standalone message if already installed */}
        {isStandalone || justInstalled ? (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              Coralink já está instalado!
            </h3>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              Você já está utilizando a versão instalada no seu dispositivo.
            </p>
          </div>
        ) : null}

        {/* Platform Tabs */}
        <div className="flex rounded-xl bg-[#f1f3f6] p-1 dark:bg-[#181b22] mb-6">
          <button
            type="button"
            onClick={() => setSelectedTab('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'android'
                ? 'bg-white text-[#121417] shadow-xs dark:bg-[#232732] dark:text-white'
                : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-[#121417] shadow-xs dark:bg-[#232732] dark:text-white'
                : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-sky-500" />
            <span>iPhone / iOS</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab('desktop')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'desktop'
                ? 'bg-white text-[#121417] shadow-xs dark:bg-[#232732] dark:text-white'
                : 'text-[#64748b] hover:text-[#121417] dark:text-[#9aa1ad] dark:hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5 text-purple-500" />
            <span>Computador</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* ANDROID TAB */}
          {activeTab === 'android' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {canPromptDirectly ? (
                <button
                  type="button"
                  onClick={handleDirectInstall}
                  disabled={isInstalling}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#121417] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-black active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <Download className="h-4 w-4" />
                  <span>{isInstalling ? 'Instalando...' : 'Instalar Coralink com 1 Toque'}</span>
                </button>
              ) : null}

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#171a22]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-3">
                  Passo a passo no Google Chrome ou Samsung Internet:
                </h4>
                <ol className="space-y-3 text-xs text-[#374151] dark:text-[#d1d5db]">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      1
                    </span>
                    <span className="leading-relaxed">
                      Toque no menu de <strong>três pontos verticais</strong>{' '}
                      <MoreVertical className="inline h-3.5 w-3.5 -mt-0.5 text-stone-500" /> no canto
                      superior direito do navegador.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      2
                    </span>
                    <span className="leading-relaxed">
                      Selecione a opção <strong>&quot;Instalar aplicativo&quot;</strong> ou{' '}
                      <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      3
                    </span>
                    <span className="leading-relaxed">
                      Confirme em <strong>&quot;Instalar&quot;</strong>. O Coralink será adicionado ao
                      seu menu de aplicativos com ícone próprio e inicialização rápida.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* IOS TAB */}
          {activeTab === 'ios' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3 text-xs text-sky-700 dark:text-sky-300">
                💡 No iPhone ou iPad, a instalação deve ser feita pelo navegador <strong>Safari</strong>.
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#171a22]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-3">
                  Passo a passo no Safari:
                </h4>
                <ol className="space-y-3.5 text-xs text-[#374151] dark:text-[#d1d5db]">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      1
                    </span>
                    <span className="leading-relaxed">
                      Toque no botão de <strong>Compartilhar</strong>{' '}
                      <Share className="inline h-3.5 w-3.5 -mt-0.5 text-sky-500" /> (quadrado com
                      seta para cima na barra inferior do Safari).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      2
                    </span>
                    <span className="leading-relaxed">
                      Role o menu de compartilhamento para baixo e toque em{' '}
                      <strong>&quot;Adicionar à Tela de Início&quot;</strong>{' '}
                      <PlusSquare className="inline h-3.5 w-3.5 -mt-0.5 text-stone-500" />.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      3
                    </span>
                    <span className="leading-relaxed">
                      No canto superior direito, toque em <strong>&quot;Adicionar&quot;</strong>.
                      Pronto! O app aparecerá na tela do seu iPhone.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* DESKTOP TAB */}
          {activeTab === 'desktop' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {canPromptDirectly ? (
                <button
                  type="button"
                  onClick={handleDirectInstall}
                  disabled={isInstalling}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#121417] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-black active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-[#121417] dark:hover:bg-stone-200"
                >
                  <Download className="h-4 w-4" />
                  <span>{isInstalling ? 'Instalando...' : 'Instalar Coralink no Computador'}</span>
                </button>
              ) : null}

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#171a22]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad] mb-3">
                  Como instalar no Chrome, Edge ou Brave:
                </h4>
                <ol className="space-y-3 text-xs text-[#374151] dark:text-[#d1d5db]">
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      1
                    </span>
                    <span className="leading-relaxed">
                      Olhe para a <strong>barra de endereço</strong> do seu navegador (onde fica o
                      link).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      2
                    </span>
                    <span className="leading-relaxed">
                      Clique no ícone de <strong>instalação</strong> (um computador com seta ou
                      sinal de +) ao lado da estrela de favoritos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#121417] text-[10px] font-bold text-white dark:bg-white dark:text-[#121417]">
                      3
                    </span>
                    <span className="leading-relaxed">
                      Clique em <strong>&quot;Instalar&quot;</strong>. O Coralink abrirá em sua
                      própria janela dedicada e independente.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Footnote */}
        <div className="mt-6 pt-4 border-t border-[#f1f3f6] dark:border-[#242831] grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
            <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Menos de 2 MB (sem lojas)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#64748b] dark:text-[#9aa1ad]">
            <WifiOff className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Navegação offline ativa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
