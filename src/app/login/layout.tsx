import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar ou Cadastrar | Coralink',
  description:
    'Acesse o Coralink para salvar oportunidades, receber alertas de editais e personalizar sua experiência universitária.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
