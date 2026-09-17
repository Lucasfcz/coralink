'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import { getSourceLogoUrl } from '@/lib/utils';

interface InstitutionLogoProps {
  sourceName: string;
  size?: number;
  className?: string;
}

export function InstitutionLogo({
  sourceName,
  size = 32,
  className = '',
}: InstitutionLogoProps) {
  const [hasError, setHasError] = useState(false);
  const logoUrl = getSourceLogoUrl(sourceName);

  const isFullBleed =
    sourceName.toUpperCase().includes('CESAR') ||
    sourceName.toUpperCase().includes('CIN') ||
    logoUrl?.includes('cesar') ||
    logoUrl?.includes('cin');

  if (logoUrl && !hasError) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-white shadow-xs dark:border-[#2b303a] ${
          isFullBleed ? 'p-0' : 'p-1'
        } ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={logoUrl}
          alt={sourceName}
          width={isFullBleed ? size : size - 8}
          height={isFullBleed ? size : size - 8}
          priority
          className={`h-full w-full ${isFullBleed ? 'object-cover' : 'object-contain'}`}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback elegante com ícone acadêmico/institucional
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#e5e7eb] bg-[#f8f9fa] text-[#121417] shadow-xs dark:border-[#2b303a] dark:bg-[#1a1d24] dark:text-[#f3f4f6] ${className}`}
      style={{ width: size, height: size }}
      title={sourceName}
    >
      <GraduationCap style={{ width: size * 0.55, height: size * 0.55 }} />
    </div>
  );
}
