import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coralink - Oportunidades Acadêmicas & Tech',
    short_name: 'Coralink',
    description:
      'Ecossistema inteligente de agregação e distribuição de editais, estágios e bolsas acadêmicas em Pernambuco.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0b0d',
    theme_color: '#121417',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
