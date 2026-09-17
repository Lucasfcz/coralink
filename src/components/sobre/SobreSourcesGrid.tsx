'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Globe } from 'lucide-react';

interface SourceItem {
  name: string;
  fullName: string;
  logo: string;
  category: string;
  description: string;
  isFullBleed?: boolean;
}

const SOURCES: SourceItem[] = [
  {
    name: 'UFPE',
    fullName: 'Universidade Federal de Pernambuco',
    logo: '/institutions/ufpe.png',
    category: 'Universidade Pública Federal',
    description: 'Editais acadêmicos, bolsas de pesquisa PIBIC/PIBITI e programas de extensão.',
  },
  {
    name: 'CIn-UFPE',
    fullName: 'Centro de Informática da UFPE',
    logo: '/institutions/cin-ufpe.png',
    category: 'Centro de Excelência em Computação',
    description: 'Estágios, residências de software, projetos de P&D e eventos de tecnologia.',
    isFullBleed: true,
  },
  {
    name: 'IFPE',
    fullName: 'Instituto Federal de Pernambuco',
    logo: '/institutions/ifpe.png',
    category: 'Educação Tecnológica & Superior',
    description: 'Seleções estudantis, monitorias, apoio à inovação e editais de assistência.',
  },
  {
    name: 'UPE',
    fullName: 'Universidade de Pernambuco',
    logo: '/institutions/upe.png',
    category: 'Universidade Pública Estadual',
    description: 'Oportunidades de graduação, pesquisa científica e congressos acadêmicos.',
  },
  {
    name: 'Porto Digital',
    fullName: 'Parque Tecnológico de Recife',
    logo: '/institutions/porto-digital.png',
    category: 'Parque Tecnológico & Hub',
    description: 'Vagas em startups residentes, programas de aceleração e conexões de mercado.',
  },
  {
    name: 'CESAR',
    fullName: 'Centro de Estudos Avançados do Recife',
    logo: '/institutions/cesar.png',
    category: 'Instituto de Inovação & Tecnologia',
    description: 'Programas de estágio, residências tecnológicas e contratações em tecnologia.',
    isFullBleed: true,
  },
  {
    name: 'CESAR School',
    fullName: 'Escola de Inovação do CESAR',
    logo: '/institutions/cesar-school.png',
    category: 'Graduação & Pós-Graduação Tech',
    description: 'Bolsas de estudo, desafios de inovação e atividades práticas orientadas.',
  },
  {
    name: 'FACEPE',
    fullName: 'Fundação de Amparo à Ciência e Tecnologia de PE',
    logo: '/institutions/facepe.png',
    category: 'Fomento à Pesquisa Científica',
    description: 'Chamadas públicas de fomento, bolsas de pós-graduação e incentivo a cientistas.',
  },
  {
    name: 'Senac PE',
    fullName: 'Serviço Nacional de Aprendizagem Comercial',
    logo: '/institutions/senac-pe.png',
    category: 'Educação Profissional & Superior',
    description: 'Capacitações técnicas, cursos de extensão e programas de empregabilidade.',
  },
  {
    name: 'Sympla Tech',
    fullName: 'Eventos e Meetups Tecnológicos',
    logo: '/institutions/sympla.webp',
    category: 'Comunidades & Meetups PE',
    description: 'Hackathons, meetups de comunidades de desenvolvedores e conferências em PE.',
  },
  {
    name: 'UNIBRA',
    fullName: 'Centro Universitário Brasileiro',
    logo: '/institutions/unibra.png',
    category: 'Centro Universitário Privado',
    description: 'Editais acadêmicos, programas de monitoria e jornadas científicas universitárias.',
  },
  {
    name: 'UNIFAFIRE',
    fullName: 'Centro Universitário Frassinetti do Recife',
    logo: '/institutions/unifafire.png',
    category: 'Centro Universitário Privado',
    description: 'Iniciação científica, projetos comunitários e oportunidades de desenvolvimento.',
  },
];

export function SobreSourcesGrid() {
  return (
    <section id="fontes" className="relative scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-emerald-700 dark:text-emerald-300 uppercase">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>12 Fontes Oficiais Ativas</span>
          </div>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#121417] sm:text-4xl md:text-5xl dark:text-white">
            Fontes Atualmente Monitoradas
          </h2>

          <p className="mt-4 max-w-2xl text-base text-[#697282] sm:text-lg dark:text-[#9aa1ad]">
            Oportunidades coletadas diretamente dos canais oficiais dos maiores polos acadêmicos de
            Pernambuco.
          </p>
        </div>

        {/* Grade com exatamente as 12 fontes */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SOURCES.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white/80 p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#d2d6dc] hover:shadow-md dark:border-[#242831] dark:bg-[#121417]/80 dark:hover:border-[#374151] dark:hover:bg-[#15181e]"
            >
              <div>
                {/* Header do Card: Logomarca + Badge Ativo */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-2 shadow-2xs dark:border-[#242831]">
                    <Image
                      src={source.logo}
                      alt={`Logotipo oficial de ${source.name}`}
                      width={48}
                      height={48}
                      className={`h-full w-full object-contain ${
                        source.isFullBleed ? 'scale-90' : ''
                      }`}
                    />
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ativo
                  </span>
                </div>

                {/* Nome & Categoria */}
                <div className="mt-4">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#697282] dark:text-[#9aa1ad]">
                    {source.category}
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-[#121417] dark:text-white">
                    {source.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-[#4b5563] dark:text-[#9aa1ad]">
                    {source.fullName}
                  </p>
                </div>

                {/* Descrição resumida do escopo */}
                <p className="mt-2.5 text-xs text-[#697282] dark:text-[#9aa1ad] leading-relaxed">
                  {source.description}
                </p>
              </div>

              {/* Rodapé do Card com indicação de canal oficial */}
              <div className="mt-4 pt-3 border-t border-[#f1f3f6] dark:border-[#1e2229] flex items-center justify-between text-[11px] text-[#9aa1ad] dark:text-[#697282]">
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>Portal Oficial Auditado</span>
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Diário
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
