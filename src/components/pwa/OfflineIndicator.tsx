'use client';

import { useState, useEffect, useSyncExternalStore, useRef } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

function subscribeOnline(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);

  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getOnlineSnapshot(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

function getOnlineServerSnapshot(): boolean {
  return true;
}

export function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getOnlineServerSnapshot);
  const isOffline = !isOnline;
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (isOffline) {
      wasOfflineRef.current = true;
    } else if (wasOfflineRef.current) {
      const timer = setTimeout(() => {
        setShowReconnected(true);
        wasOfflineRef.current = false;
        const hideTimer = setTimeout(() => {
          setShowReconnected(false);
        }, 3500);
        return () => clearTimeout(hideTimer);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-300"
      style={{
        backgroundColor: isOffline ? 'rgba(24, 27, 34, 0.92)' : 'rgba(16, 185, 129, 0.95)',
        color: '#ffffff',
        border: isOffline ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(16, 185, 129, 0.3)',
      }}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Modo Offline: exibindo oportunidades salvas</span>
        </>
      ) : (
        <>
          <Wifi className="h-3.5 w-3.5 text-white shrink-0" />
          <span>Conexão restabelecida</span>
        </>
      )}
    </div>
  );
}
