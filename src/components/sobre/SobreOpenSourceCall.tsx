'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, GitBranch, Terminal } from 'lucide-react';

export function SobreOpenSourceCall() {
  const [copied, setCopied] = useState(false);

  const javaCodeSnippet = `@Component
@Slf4j
public class UfpeCollector implements OpportunityCollector {

    private final PlaywrightScraper scraper;
    private final AiCuratorService aiCurator;

    @Override
    public String getSourceCode() {
        return "UFPE";
    }

    @Scheduled(cron = "0 0 6 * * *") // Executa diariamente às 06h
    public List<Opportunity> collect() {
        log.info("Coletando editais oficiais da UFPE...");
        var rawData = scraper.fetch("https://ufpe.br/editais");
        return aiCurator.extractOpportunities(rawData, getSourceCode());
    }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(javaCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white/70 p-6 sm:p-8 lg:p-12 shadow-sm backdrop-blur-md dark:border-[#242831] dark:bg-[#121417]/80">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Coluna Esquerda: Texto Editorial & CTA */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-[11px] font-bold tracking-wider text-[#4b5563] uppercase shadow-2xs dark:border-[#242831] dark:bg-[#181b22] dark:text-[#9aa1ad]">
                <GitBranch className="h-3.5 w-3.5 text-emerald-500" />
                <span>Open Source • Spring Boot 3 & Java 21</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#121417] sm:text-4xl dark:text-white leading-tight">
                Construído por estudantes, aberto para a comunidade
              </h2>

              <p className="mt-4 text-base text-[#4b5563] dark:text-[#9aa1ad] leading-relaxed">
                O Coralink é um projeto de código aberto. Se você é desenvolvedor e quer adicionar um
                coletor para sua instituição ou centro acadêmico, a API foi feita para ser estendida.
              </p>

              {/* Destaques Arquiteturais */}
              <div className="mt-6 space-y-2.5 text-sm text-[#4b5563] dark:text-[#9aa1ad]">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>Interface unificada para novos coletores (`OpportunityCollector`)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span>Scraping resiliente com fallback inteligente e curadoria assistida por IA</span>
                </div>
              </div>

              {/* Botão Oficial GitHub */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://github.com/Lucasfcz/coralinkAPI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-xl bg-[#121417] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg dark:bg-white dark:text-[#121417] dark:hover:bg-stone-100"
                >
                  <svg
                    className="h-5 w-5 fill-current transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>Ver Repositório no GitHub</span>
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </a>

                <span className="text-xs font-medium text-[#697282] dark:text-[#9aa1ad]">
                  Contribuições, issues e PRs são bem-vindos!
                </span>
              </div>
            </div>

            {/* Coluna Direita: Bloco de Código / Terminal Simulado */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-[#242831] bg-[#0c0e12] shadow-2xl">
                {/* Header do Terminal com Window Dots */}
                <div className="flex items-center justify-between border-b border-[#20242b] bg-[#12141a] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    <span className="ml-2 font-mono text-xs text-[#9aa1ad]">
                      UfpeCollector.java
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md border border-[#2b303a] bg-[#181b22] px-2.5 py-1 text-xs text-[#d2d6dc] transition-colors hover:border-stone-500 hover:text-white"
                    title="Copiar código"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Código com Syntax Highlighting Estilizado */}
                <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-[#e5e7eb]">
                  <pre>
                    <code>
                      <span className="text-emerald-400">@Component</span>
                      {'\n'}
                      <span className="text-emerald-400">@Slf4j</span>
                      {'\n'}
                      <span className="text-indigo-400">public class</span>{' '}
                      <span className="text-amber-300">UfpeCollector</span>{' '}
                      <span className="text-indigo-400">implements</span>{' '}
                      <span className="text-teal-300">OpportunityCollector</span> {'{\n\n'}
                      {'    '}
                      <span className="text-indigo-400">private final</span>{' '}
                      <span className="text-teal-300">PlaywrightScraper</span> scraper;{'\n'}
                      {'    '}
                      <span className="text-indigo-400">private final</span>{' '}
                      <span className="text-teal-300">AiCuratorService</span> aiCurator;{'\n\n'}
                      {'    '}
                      <span className="text-emerald-400">@Override</span>
                      {'\n'}
                      {'    '}
                      <span className="text-indigo-400">public</span>{' '}
                      <span className="text-teal-300">String</span>{' '}
                      <span className="text-blue-400">getSourceCode</span>() {'{\n'}
                      {'        '}
                      <span className="text-indigo-400">return</span>{' '}
                      <span className="text-emerald-300">&quot;UFPE&quot;</span>;{'\n'}
                      {'    }\n\n'}
                      {'    '}
                      <span className="text-emerald-400">@Scheduled</span>(cron ={' '}
                      <span className="text-emerald-300">&quot;0 0 6 * * *&quot;</span>){' '}
                      <span className="text-stone-500">{'// Executa diariamente às 06h'}</span>
                      {'\n'}
                      {'    '}
                      <span className="text-indigo-400">public</span>{' '}
                      <span className="text-teal-300">List&lt;Opportunity&gt;</span>{' '}
                      <span className="text-blue-400">collect</span>() {'{\n'}
                      {'        '}log.info(
                      <span className="text-emerald-300">
                        &quot;Coletando editais oficiais da UFPE...&quot;
                      </span>
                      );{'\n'}
                      {'        '}
                      <span className="text-indigo-400">var</span> rawData = scraper.fetch(
                      <span className="text-emerald-300">
                        &quot;https://ufpe.br/editais&quot;
                      </span>
                      );{'\n'}
                      {'        '}
                      <span className="text-indigo-400">return</span> aiCurator.extractOpportunities(
                      rawData, getSourceCode());{'\n'}
                      {'    }\n'}
                      {'}'}
                    </code>
                  </pre>
                </div>

                {/* Status Bar do Terminal */}
                <div className="flex items-center justify-between border-t border-[#20242b] bg-[#0e1015] px-4 py-2 text-[11px] text-[#697282]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3 w-3 text-emerald-400" />
                    <span>Spring Boot • Coralink Collector Engine</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#9aa1ad]">UTF-8 • LF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
