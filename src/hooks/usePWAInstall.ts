'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type PWAInstallPlatform = 'ios' | 'android' | 'desktop';

function detectPlatform(): PWAInstallPlatform {
  if (typeof window === 'undefined') return 'desktop';
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice =
    /iphone|ipad|ipod/.test(userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  if (isIOSDevice) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'desktop';
}

function subscribeStandalone(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  mediaQuery.addEventListener('change', callback);
  window.addEventListener('appinstalled', callback);

  return () => {
    mediaQuery.removeEventListener('change', callback);
    window.removeEventListener('appinstalled', callback);
  };
}

function getStandaloneSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error - iOS specific standalone detection
      window.navigator?.standalone === true ||
      document.referrer.includes('android-app://')
  );
}

function getStandaloneServerSnapshot(): boolean {
  return false;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  );
  const [platform] = useState<PWAInstallPlatform>(detectPlatform);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Intercept native beforeinstallprompt (Chrome / Android / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) {
      return 'unavailable';
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return choiceResult.outcome;
    } catch (err) {
      console.error('[PWA] Erro ao disparar prompt de instalação:', err);
      return 'unavailable';
    }
  }, [deferredPrompt]);

  return {
    isStandalone,
    canPromptDirectly: Boolean(deferredPrompt),
    platform,
    promptInstall,
  };
}
