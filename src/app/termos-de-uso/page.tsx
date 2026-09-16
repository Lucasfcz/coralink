import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Scale, FileText, AlertCircle, ExternalLink, Mail } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Termos de Uso | Coralink',
  description:
    'Termos e Condições Gerais de Uso da plataforma Coralink. Regras de conduta, isenção de responsabilidade e diretrizes de utilização.',
};

export default function TermosDeUsoPage() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'emailParaContato@gmail.com';

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#121417] transition-colors duration-200 dark:bg-[#0a0b0d] dark:text-[#f3f4f6]">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Navegação Superior */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-xs font-semibold text-[#121417] shadow-xs transition-all hover:border-[#121417] hover:bg-[#121417] hover:text-white dark:border-[#242831] dark:bg-[#15181e] dark:text-[#f3f4f6] dark:hover:border-white dark:hover:bg-white dark:hover:text-[#121417]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Voltar ao início</span>
          </Link>

          <span className="text-xs font-medium text-[#64748b] dark:text-[#9aa1ad]">
            Última atualização: Setembro de 2026
          </span>
        </div>

        {/* Cabeçalho Editorial */}
        <div className="border-b border-[#e5e7eb] pb-8 dark:border-[#242831]">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Scale className="h-3.5 w-3.5" />
            <span>Documento Legal Oficial</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#121417] dark:text-white">
            Termos de Uso do Coralink
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#64748b] dark:text-[#9aa1ad]">
            Estes Termos de Uso regem o acesso e a utilização dos serviços e conteúdos disponibilizados pela plataforma <strong>Coralink</strong>. Ao navegar ou cadastrar-se na plataforma, você declara ter lido, compreendido e aceito integralmente as condições aqui estipuladas.
          </p>
        </div>

        {/* Conteúdo Legal Estruturado */}
        <div className="mt-10 space-y-10 text-sm leading-relaxed text-[#374151] dark:text-[#d2d6dc]">
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white flex items-center gap-2">
              <span>1. Objeto e Natureza da Plataforma</span>
            </h2>
            <p>
              O <strong>Coralink</strong> é uma plataforma de tecnologia voltada à comunidade acadêmica e de inovação, atuando como um agregador inteligente de informações públicas sobre editais, bolsas de pesquisa, estágios, programas de trainee, congressos e eventos tecnológicos provenientes de universidades e instituições de ensino e fomento.
            </p>
            <p>
              A plataforma tem por objetivo exclusivo facilitar a descoberta e o direcionamento de estudantes e pesquisadores para oportunidades acadêmicas e profissionais disponíveis na internet.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              2. Limitação Expressa de Responsabilidade ("As-Is")
            </h2>
            <div className="rounded-2xl border-l-4 border-[#121417] bg-[#f8f9fa] p-4.5 dark:border-white dark:bg-[#181b22]">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#121417] dark:text-white mt-0.5" />
                <div className="space-y-2 text-xs leading-relaxed text-[#121417] dark:text-[#f3f4f6]">
                  <p className="font-bold">
                    O Coralink não é organizador, gestor nem emissor dos editais publicados por terceiros.
                  </p>
                  <p>
                    O serviço é fornecido no estado em que se encontra (<em>"as-is"</em> e <em>"as available"</em>), sem garantias expressas ou implícitas de qualquer natureza.
                  </p>
                </div>
              </div>
            </div>
            <p>
              Em decorrência da natureza de agregação de dados de fontes externas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Ausência de Vínculo:</strong> O Coralink não mantém vínculo empregatício, societário ou de representação com as universidades e entidades monitoradas, salvo quando expressamente sinalizado.
              </li>
              <li>
                <strong>Veracidade e Prazos:</strong> Embora empreguemos algoritmos de IA para catalogação das informações, alterações de cronograma, prorrogações, retificações e cancelamentos decididos pelas instituições oficiais podem não ser refletidos instantaneamente. É dever irrenunciável do candidato verificar os documentos oficiais nas páginas de origem antes de tomar qualquer providência.
              </li>
              <li>
                <strong>Decisões de Seleção:</strong> O Coralink não interfere, opina ou garante aprovação em quaisquer processos seletivos ou bolsas divulgados na plataforma.
              </li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              3. Regras de Conduta e Uso Aceitável
            </h2>
            <p>
              Ao utilizar a plataforma, você concorda expressamente em utilizar os recursos de maneira ética, lícita e estritamente pessoal, sendo expressamente proibido:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                Executar qualquer modalidade de raspagem de dados automatizada (<em>web scraping</em>, <em>crawlers</em> maliciosos, <em>bots</em> ou scripts) que sobrecarregue nossa infraestrutura ou capture em massa nossa base de dados processada sem prévia autorização escrita.
              </li>
              <li>
                Realizar engenharia reversa, descompilação, desmontagem ou tentativa de obter o código-fonte de quaisquer rotas, algoritmos de recomendação ou componentes da API do Coralink.
              </li>
              <li>
                Efetuar ataques de negação de serviço (DoS/DDoS), injeção de código, abuso das rotas de autenticação ou burlar os mecanismos de rate limiting implementados no backend.
              </li>
              <li>
                Utilizar credenciais de terceiros, forjar identidades ou simular autenticações no serviço Google OAuth.
              </li>
            </ul>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              4. Autenticação, Contas e Segurança
            </h2>
            <p>
              Para usufruir de determinadas funcionalidades, como personalização de feed e salvamento de oportunidades, o usuário poderá autenticar-se utilizando sua conta Google ou registro local por e-mail e senha.
            </p>
            <p>
              O usuário é o único responsável pela guarda e confidencialidade de suas credenciais de acesso, devendo notificar imediatamente a equipe do Coralink pelo canal de suporte em caso de suspeita de uso não autorizado de sua conta.
            </p>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              5. Suspensão e Banimento de Acesso
            </h2>
            <p>
              O Coralink reserva-se o direito de, a seu exclusivo critério e sem necessidade de aviso prévio ou indenização, suspender temporariamente ou cancelar em definitivo o acesso de qualquer usuário que viole estes Termos de Uso, cometa fraudes, infrinja direitos de propriedade intelectual ou ameace a segurança e estabilidade do ecossistema.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              6. Propriedade Intelectual
            </h2>
            <p>
              Todo o código-fonte, arquitetura, design visual, identidade de marca, layouts, logomarcas, ícones proprietários e textos autorais do <strong>Coralink</strong> são protegidos pela legislação brasileira de direitos autorais e propriedade industrial.
            </p>
            <p>
              Os nomes, marcas comerciais, brasões e logotipos das instituições de ensino superior e centros de inovação (ex.: UFPE, IFPE, CESAR, Porto Digital) exibidos na plataforma são de titularidade exclusiva de suas respectivas entidades e são utilizados estritamente sob contexto nominativo e informativo para identificar a origem das oportunidades.
            </p>
          </section>

          {/* Seção 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              7. Links para Plataformas e Editais de Terceiros
            </h2>
            <p>
              A plataforma disponibiliza hiperlinks diretos que conduzem aos portais oficiais de inscrição e publicação de editais. O Coralink não exerce qualquer controle sobre o conteúdo, políticas de privacidade, termos de uso ou práticas de sites de terceiros, não assumindo qualquer responsabilidade por eventuais danos materiais ou morais deles decorrentes.
            </p>
          </section>

          {/* Seção 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              8. Modificações Destes Termos
            </h2>
            <p>
              Podemos atualizar periodicamente estes Termos de Uso para refletir aprimoramentos técnicos, novas funcionalidades ou adequações legislativas. A data da versão mais recente constará sempre no topo desta página. A continuidade do uso da plataforma após as alterações constituirá consentimento tácito com os termos revisados.
            </p>
          </section>

          {/* Seção 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              9. Legislação Aplicável e Foro
            </h2>
            <p>
              Estes Termos de Uso são regidos, interpretados e executados em conformidade com as leis da República Federativa do Brasil, em especial a Lei nº 12.965/2014 (Marco Civil da Internet) e o Código Civil Brasileiro.
            </p>
            <p>
              Fica eleito o <strong>Foro da Comarca do Recife, Estado de Pernambuco</strong>, como o competente para dirimir quaisquer litígios, controvérsias ou questionamentos oriundos da utilização desta plataforma, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* Seção 10 */}
          <section className="space-y-3 border-t border-[#e5e7eb] pt-6 dark:border-[#242831]">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-[#64748b] dark:text-[#9aa1ad]" />
              <span>10. Dúvidas e Contato</span>
            </h2>
            <p>
              Em caso de dúvidas, solicitações ou notificações relacionadas a estes Termos de Uso, entre em contato diretamente com a nossa equipe pelo e-mail:
            </p>
            <div className="inline-block rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-xs font-semibold text-[#121417] shadow-xs dark:border-[#242831] dark:bg-[#15181e] dark:text-white">
              <a href={`mailto:${supportEmail}`} className="hover:underline">
                {supportEmail}
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
