import type { MetadataRoute } from 'next';
import { getOpportunities } from '@/services/opportunities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://coralink.com.br';

export const revalidate = 3600; // Revalidar sitemap a cada 1 hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/preferencias`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/termos-de-uso`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const response = await getOpportunities({ size: 100 });
    if (response && response.content) {
      dynamicRoutes = response.content.map((opp) => ({
        url: `${BASE_URL}/oportunidades/${opp.id}`,
        lastModified: opp.startDate ? new Date(opp.startDate) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.warn('Não foi possível obter oportunidades dinâmicas para o sitemap:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
