import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coralink | Oportunidades Acadêmicas & Tech',
  description:
    'Ecossistema inteligente de agregação e distribuição de editais, estágios, bolsas de pesquisa e eventos acadêmicos e profissionais.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coralink',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/coralink-logo.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} font-sans`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#fbfbfb] text-[#121417] antialiased transition-colors duration-200 dark:bg-[#0a0b0d] dark:text-[#f3f4f6]">
        <ThemeProvider>
          <AuthProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
            <OfflineIndicator />
            <ServiceWorkerRegister />
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
