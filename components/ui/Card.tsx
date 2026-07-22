import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type Tone    = 'light' | 'dark';
type Border  = 'pink' | 'neutral';
type Padding = 'none' | 'sm' | 'md' | 'lg';

const toneClass: Record<Tone, string> = {
  light: 'bg-white',
  dark:  'bg-brand-dark',
};

const borderClass: Record<Tone, Record<Border, string>> = {
  light: { pink: 'border border-brand-border', neutral: 'border border-brand-line' },
  dark:  { pink: 'border border-white/8',      neutral: 'border border-white/8'    },
};

const padClass: Record<Padding, string> = {
  none: '',
  sm:   'p-5',
  md:   'p-6',
  lg:   'p-8',
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?:    Tone;
  border?:  Border;
  padding?: Padding;
  /** Add the standard magenta hover border + transition. */
  hover?:   boolean;
}

/** Rounded bordered surface used for cards across marketing + portal. */
export function Card({
  tone = 'light',
  border = 'pink',
  padding = 'lg',
  hover = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl',
        toneClass[tone],
        borderClass[tone][border],
        padClass[padding],
        hover && 'transition-all duration-300 hover:border-brand-magenta/40',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
