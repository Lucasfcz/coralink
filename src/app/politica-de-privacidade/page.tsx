import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, AlertCircle, Mail, UserCheck, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Coralink',
  description:
    'Política de Privacidade e Proteção de Dados da plataforma Coralink. Conformidade integral com a LGPD e Google OAuth User Data Policy.',
};

export default function PoliticaDePrivacidadePage() {
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
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Conformidade LGPD & Google OAuth</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#121417] dark:text-white">
            Política de Privacidade do Coralink
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#64748b] dark:text-[#9aa1ad]">
            Esta Política de Privacidade descreve de forma transparente como o <strong>Coralink</strong> coleta, utiliza, armazena, protege e descarta dados pessoais de seus usuários, em estrita observância à Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD) e aos requisitos de segurança e privacidade do <strong>Google API Services User Data Policy</strong>.
          </p>
        </div>

        {/* Conteúdo Estruturado */}
        <div className="mt-10 space-y-10 text-sm leading-relaxed text-[#374151] dark:text-[#d2d6dc]">
          {/* 1. Compromisso */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              1. Nosso Compromisso com a sua Privacidade
            </h2>
            <p>
              A privacidade e a proteção de dados são pilares estruturais do Coralink. Nós coletamos apenas as informações estritamente necessárias para a prestação dos nossos serviços de agregação e recomendação de editais e oportunidades acadêmicas e tecnológicas.
            </p>
            <p>
              <strong>Não vendemos, não alugamos e não compartilhamos seus dados com corretores de dados (data brokers) ou empresas de publicidade sob nenhuma circunstância.</strong>
            </p>
          </section>

          {/* 2. Dados Coletados */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              2. Dados Pessoais que Coletamos
            </h2>
            <p>Os dados tratados pela plataforma enquadram-se nas seguintes categorias:</p>
            
            <div className="space-y-3 pt-1">
              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#15181e]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white mb-1.5 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  <span>A. Dados fornecidos via Google OAuth (Login Social)</span>
                </h3>
                <p className="text-xs text-[#64748b] dark:text-[#9aa1ad] mb-2">
                  Quando você opta por autenticar-se na plataforma utilizando sua conta Google, coletamos apenas os dados básicos fornecidos pelo escopo público:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#121417] dark:text-[#e5e7eb]">
                  <li><strong>Nome Completo:</strong> Utilizado para identificar você na interface da plataforma;</li>
                  <li><strong>Endereço de E-mail:</strong> Utilizado para autenticação única da conta e comunicação estritamente funcional;</li>
                  <li><strong>Foto de Perfil (Avatar URL):</strong> Exibida no menu de usuário logado no cabeçalho;</li>
                  <li><strong>Identificador Único do Google (Google ID):</strong> Código alfanumérico para validação de segurança da sessão.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#15181e]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white mb-1.5 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-500" />
                  <span>B. Dados de Registro Local</span>
                </h3>
                <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
                  Caso opte pelo cadastro tradicional por formulário, coletamos nome, e-mail e senha criptografada com algoritmo BCrypt com salt de alta segurança. Nenhuma senha trafega ou é salva em texto simples.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8f9fa] p-4 dark:border-[#242831] dark:bg-[#15181e]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#121417] dark:text-white mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>C. Dados de Uso e Preferências</span>
                </h3>
                <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
                  Preferência de tema visual (modo claro ou modo escuro) armazenada localmente em seu navegador e oportunidades que você optar por salvar em sua conta.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Cláusula Mandatória Google OAuth */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              3. Declaração Expressa sobre Dados do Google OAuth (Google User Data)
            </h2>
            <div className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/50 p-4.5 dark:border-emerald-400 dark:bg-emerald-950/20">
              <div className="space-y-2 text-xs leading-relaxed text-[#121417] dark:text-[#f3f4f6]">
                <p className="font-bold text-emerald-900 dark:text-emerald-300">
                  Em cumprimento integral à Google API Services User Data Policy:
                </p>
                <p>
                  O Coralink declara expressamente que o uso das informações recebidas por meio das APIs do Google está em estrita conformidade com a <strong>Política de Dados do Usuário dos Serviços de API do Google</strong>, incluindo os requisitos de Uso Limitado (<em>Limited Use Requirements</em>).
                </p>
                <ul className="list-disc pl-5 space-y-1 pt-1 font-medium">
                  <li><strong>Não comercialização:</strong> Seus dados de perfil do Google NÃO são comercializados, vendidos, alugados ou transferidos a terceiros.</li>
                  <li><strong>Finalidade única:</strong> Os dados são usados exclusivamente para autenticar sua identidade e permitir o uso dos recursos da plataforma.</li>
                  <li><strong>Ausência de publicidade direcionada:</strong> Não utilizamos seus dados para veiculação de anúncios comportamentais nem os compartilhamos com redes de anúncios.</li>
                  <li><strong>Não utilização para treinamento de IA de terceiros:</strong> Seus dados pessoais não são empregados para treinar ou aprimorar modelos de inteligência artificial ou de linguagem de terceiros sem consentimento explícito.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Finalidade e Base Legal */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              4. Finalidades e Bases Legais do Tratamento (Art. 7º da LGPD)
            </h2>
            <p>Tratamos seus dados pessoais com fundamento nas seguintes bases legais estabelecidas pela LGPD:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Execução de Contrato e Termos (Art. 7º, V):</strong> Para autenticar sua sessão, garantir seu acesso aos recursos exclusivos e permitir o salvamento das oportunidades acadêmicas de seu interesse.
              </li>
              <li>
                <strong>Consentimento do Titular (Art. 7º, I):</strong> Quando você opta ativamente por conectar sua conta Google à plataforma.
              </li>
              <li>
                <strong>Legítimo Interesse e Segurança (Art. 7º, IX):</strong> Para prevenção a fraudes, controle de taxa de requisições (rate limiting) e manutenção da estabilidade do sistema contra acessos automatizados abusivos.
              </li>
            </ul>
          </section>

          {/* 5. Segurança dos Dados */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              5. Segurança da Informação e Armazenamento
            </h2>
            <p>
              Adotamos práticas técnicas e organizacionais rígidas para resguardar a integridade e confidencialidade dos seus dados pessoais:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Criptografia em Trânsito:</strong> Toda a comunicação entre seu navegador e nossos servidores ocorre obrigatoriamente por conexões seguras sob o protocolo HTTPS com criptografia TLS 1.3.
              </li>
              <li>
                <strong>Tokens de Acesso e Rotação:</strong> Utilizamos tokens JWT de curta duração (15 minutos) e mecanismo de Refresh Token Rotation (RTR), armazenando tokens de renovação em cookies protegidos com as diretivas <code>HttpOnly</code>, <code>Secure</code> e <code>SameSite</code>, prevenindo ataques do tipo XSS e CSRF.
              </li>
              <li>
                <strong>Validação Criptográfica do Google:</strong> A autenticidade dos tokens emitidos pelo Google é comprovada diretamente contra as chaves públicas da Google API (`GoogleIdTokenVerifier`), inviabilizando qualquer falsificação de credencial.
              </li>
            </ul>
          </section>

          {/* 6. Direitos do Titular */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              6. Seus Direitos como Titular de Dados Pessoais (Art. 18 da LGPD)
            </h2>
            <p>
              Em conformidade com o artigo 18 da Lei Geral de Proteção de Dados, você tem o direito de, a qualquer momento e mediante requisição gratuita:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Confirmar a existência de tratamento de dados pessoais;</li>
              <li>Acessar os dados pessoais mantidos pela plataforma;</li>
              <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a eliminação completa de seus dados pessoais tratados com seu consentimento;</li>
              <li>Revogar o consentimento previamente concedido a qualquer momento;</li>
              <li>Revogar o acesso do Coralink diretamente nas configurações de segurança de sua conta Google (<a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#121417] dark:hover:text-white">Gerenciar permissões Google</a>).</li>
            </ul>
          </section>

          {/* 7. Procedimento de Exclusão de Dados */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white flex items-center gap-2">
              <Trash2 className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" />
              <span>7. Procedimento para Exclusão de Conta e Eliminação de Dados (Data Deletion)</span>
            </h2>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4.5 dark:border-rose-900/50 dark:bg-rose-950/20">
              <p className="text-xs text-[#121417] dark:text-[#f3f4f6] leading-relaxed">
                Você pode solicitar a qualquer momento a exclusão definitiva da sua conta e de todos os dados pessoais associados. Para isso, siga o procedimento abaixo:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-xs text-[#374151] dark:text-[#d2d6dc]">
                <li>
                  Envie um e-mail para <strong className="text-[#121417] dark:text-white">{supportEmail}</strong> com o assunto <code>"Exclusão de Conta e Dados - Coralink"</code> a partir do mesmo e-mail cadastrado na plataforma;
                </li>
                <li>
                  Nossa equipe efetuará a confirmação da titularidade e a purgação irreversível do registro de usuário, revogação de tokens e desvinculação completa no banco de dados;
                </li>
                <li>
                  O prazo legal de atendimento e confirmação da exclusão é de até <strong>15 (quinze) dias corridos</strong>, nos termos do art. 19, II da LGPD.
                </li>
              </ol>
            </div>
          </section>

          {/* 8. Cookies e Armazenamento Local */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white">
              8. Cookies e Tecnologias de Sessão
            </h2>
            <p>
              Utilizamos cookies exclusivamente técnicos essenciais para a operação da plataforma, especificamente:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>
                <strong>Cookie de Sessão (<code>coralink_refresh_token</code>):</strong> Cookie estritamente técnico, protegido com atributos <code>HttpOnly</code> e <code>SameSite</code>, utilizado unicamente para manter você conectado entre as requisições à API.
              </li>
              <li>
                <strong>LocalStorage:</strong> Armazenamento local no dispositivo para registrar sua preferência de tema (claro/escuro) e perfil em cache para exibição instantânea da interface.
              </li>
            </ul>
            <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
              Não utilizamos cookies invasivos de rastreamento de terceiros para publicidade comportamental.
            </p>
          </section>

          {/* 9. Canal de Atendimento do DPO / Suporte */}
          <section className="space-y-3 border-t border-[#e5e7eb] pt-6 dark:border-[#242831]">
            <h2 className="text-lg font-bold text-[#121417] dark:text-white flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-[#64748b] dark:text-[#9aa1ad]" />
              <span>9. Canal de Comunicação do Encarregado de Dados (DPO / Suporte)</span>
            </h2>
            <p>
              Para exercer quaisquer dos seus direitos de titular, tirar dúvidas sobre esta Política de Privacidade ou reportar incidentes, entre em contato com o nosso canal dedicado de privacidade:
            </p>
            <div className="inline-block rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-xs font-semibold text-[#121417] shadow-xs dark:border-[#242831] dark:bg-[#15181e] dark:text-white">
              <a href={`mailto:${supportEmail}`} className="hover:underline">
                {supportEmail}
              </a>
            </div>
            <p className="text-xs text-[#64748b] dark:text-[#9aa1ad]">
              Foro competente: Comarca do Recife, Estado de Pernambuco, Brasil.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
