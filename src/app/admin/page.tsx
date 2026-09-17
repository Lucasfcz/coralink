'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  // Enquanto a sessão do usuário está sendo verificada via localStorage/token
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] dark:bg-[#0c0d0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#121417] border-t-transparent dark:border-white dark:border-t-transparent" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-[#9aa1ad]">
            Autenticando sessão...
          </span>
        </div>
      </div>
    );
  }

  // Se o usuário não estiver logado ou não possuir papel ROLE_ADMIN, renderiza 404 silenciosamente
  // para que nenhum usuário comum ou scanner de URLs saiba sequer que esta rota existe.
  if (!user || user.role !== 'ROLE_ADMIN') {
    notFound();
    return null;
  }

  return <AdminDashboard />;
}
