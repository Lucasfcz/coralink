'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface SourceItem {
  name: string;
  fullName: string;
  logo: string;
  category: string;
  isFullBleed?: boolean;
}

const SOURCES: SourceItem[] = [
  {
    name: 'UFPE',
    fullName: 'Universidade Federal de Pernambuco',
    logo: '/institutions/ufpe.png',
    category: 'Universidade Pública Federal',
  },
  {
    name: 'CIn-UFPE',
    fullName: 'Centro de Informática da UFPE',
    logo: '/institutions/cin-ufpe.png',
    category: 'Centro de Excelência em Computação',
    isFullBleed: true,
  },
  {
    name: 'IFPE',
    fullName: 'Instituto Federal de Pernambuco',
    logo: '/institutions/ifpe.png',
    category: 'Educação Tecnológica & Superior',
  },
  {
    name: 'UPE',
    fullName: 'Universidade de Pernambuco',
    logo: '/institutions/upe.png',
    category: 'Universidade Pública Estadual',
  },
  {
    name: 'Porto Digital',
    fullName: 'Parque Tecnológico de Recife',
    logo: '/institutions/porto-digital.png',
    category: 'Parque Tecnológico & Hub',
  },
  {
    name: 'CESAR',
    fullName: 'Centro de Estudos Avançados do Recife',
    logo: '/institutions/cesar.png',
    category: 'Instituto de Inovação & Tecnologia',
    isFullBleed: true,
  },
  {
    name: 'CESAR School',
    fullName: 'Escola de Inovação do CESAR',
    logo: '/institutions/cesar-school.png',
    category: 'Graduação & Pós-Graduação',
  },
  {
    name: 'FACEPE',
    fullName: 'Fundação de Amparo à Ciência e Tecnologia',
    logo: '/institutions/facepe.png',
    category: 'Fomento a Bolsas & Iniciação Científica',
  },
  {
    name: 'Senac PE',
    fullName: 'Serviço Nacional de Aprendizagem Comercial',
    logo: '/institutions/senac-pe.png',
    category: 'Cursos & Qualificação Profissional',
  },
  {
    name: 'Sympla Tech',
    fullName: 'Eventos & Meetups de Tecnologia',
    logo: '/institutions/sympla.webp',
    category: 'Comunidades & Hackathons de PE',
  },
  {
    name: 'UNIBRA',
    fullName: 'Centro Universitário Brasileiro',
    logo: '/institutions/unibra.png',
    category: 'Ensino Superior Privado',
  },
  {
    name: 'UNIFAFIRE',
    fullName: 'Centro Universitário Frassinetti do Recife',
    logo: '/institutions/unifafire.png',
    category: 'Graduação, Extensão & Carreira',
  },
];

export function SobreSourcesGrid() {
  return (
    <section id="fontes" className="relative py-20 md:py-32 border-b border-[#e5e7eb] dark:border-[#242831]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho Editorial */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 border-b border-[#e5e7eb] dark:border-[#242831]/80">
          <div>
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#697282] dark:text-[#9aa1ad]">
              CANAIS MONITORADOS
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#121417] dark:text-white">
              12 FONTES OFICIAIS
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-[#697282] dark:text-[#9aa1ad] leading-relaxed">
            Coleta contínua e direta dos portais e canais oficiais dos maiores polos acadêmicos e centros
            de tecnologia do estado de Pernambuco.
          </p>
        </div>

        {/* Galeria de Marcas Minimalista de Alto Padrão (Sem bordas de cards!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-y divide-x divide-[#e5e7eb] dark:divide-[#242831]/60 border-b border-r border-[#e5e7eb] dark:border-[#242831]/60">
          {SOURCES.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group relative p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[220px] transition-colors duration-300 hover:bg-[#f3f4f6]/60 dark:hover:bg-[#12151c]/60"
            >
              {/* Logo da Instituição */}
              <div className="relative flex h-20 w-full items-center justify-center">
                <Image
                  src={source.logo}
                  alt={`Logo oficial da instituição ${source.name}`}
                  width={140}
                  height={60}
                  className={`max-h-14 w-auto object-contain transition-all duration-300 filter grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 ${
                    source.isFullBleed ? 'scale-110' : ''
                  }`}
                />
              </div>

              {/* Informações Institucionais */}
              <div className="mt-4">
                <span className="block text-sm sm:text-base font-black tracking-tight text-[#121417] dark:text-white">
                  {source.name}
                </span>
                <span className="mt-0.5 block text-[11px] font-mono text-[#697282] dark:text-[#9aa1ad] line-clamp-1">
                  {source.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
