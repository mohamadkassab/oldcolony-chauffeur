'use client';

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc: string;
}

export function FallbackImage({ src, alt, className, fallbackSrc }: FallbackImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={e => { (e.target as HTMLImageElement).src = fallbackSrc; }}
    />
  );
}
