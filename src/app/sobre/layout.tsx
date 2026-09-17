import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre o Coralink | Ecossistema Acadêmico de Pernambuco',
  description:
    'Conheça o Coralink: uma plataforma inteligente feita por estudantes universitários para centralizar editais, bolsas de pesquisa, estágios e eventos acadêmicos em Pernambuco.',
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
