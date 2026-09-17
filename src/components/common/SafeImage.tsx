'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Componente robusto de imagem que envolve o next/image.
 * Se a URL remota falhar (404, bloqueio de CORS, host inacessível ou formato inválido),
 * o componente chaveia imediatamente para a imagem de fallback curada em alta resolução,
 * evitando quebras no layout ou ícones de imagem quebrada.
 */
export function SafeImage({
  src,
  fallbackSrc,
  alt,
  onError,
  ...props
}: SafeImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Padrão oficial React para ajuste de estado derivado de props durante a renderização
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src);
    setHasError(false);
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={(e) => {
        if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
        onError?.(e);
      }}
    />
  );
}
