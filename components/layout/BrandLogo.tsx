import clsx from 'clsx';

interface BrandLogoProps {
  /** Rendered on a dark/navy surface — switches to the ivory + antique-gold lockup. */
  dark?: boolean;
  size?: 'sm' | 'md';
}

/**
 * The "Modern Marque" lockup (direction 1b): eight-point compass-star emblem
 * next to a two-line wordmark. Single source of truth for the brand mark —
 * use this everywhere instead of hand-rolled wordmarks.
 */
export function BrandLogo({ dark = false, size = 'md' }: BrandLogoProps) {
  const star   = dark ? '#F6F2EA' : '#12263A';
  const accent = dark ? '#C9A876' : '#B08D57';
  const dot    = dark ? '#12263A' : '#F6F2EA';

  return (
    <span className="flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={clsx('flex-shrink-0', size === 'md' ? 'w-9 h-9' : 'w-7 h-7')}
      >
        <polygon points="50,4 55.5,45 96,50 55.5,55 50,96 44.5,55 4,50 44.5,45" fill={star} />
        <polygon points="72,28 58,50 72,72 50,58 28,72 42,50 28,28 50,42" fill={accent} />
        <circle cx="50" cy="50" r="3.4" fill={dot} />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            'font-serif font-semibold tracking-[0.18em] whitespace-nowrap',
            size === 'md' ? 'text-[17px]' : 'text-[14px]',
            dark ? 'text-white' : 'text-brand-dark',
          )}
        >
          OLD COLONY
        </span>
        <span
          className={clsx(
            'uppercase font-medium whitespace-nowrap mt-1',
            size === 'md' ? 'text-[8px] tracking-[0.42em]' : 'text-[7px] tracking-[0.38em]',
          )}
          style={{ color: accent }}
        >
          Chauffeur
        </span>
      </span>
    </span>
  );
}
