import clsx from 'clsx';
import type { ReactNode } from 'react';

type Variant = 'plain' | 'pill';
/** Background the eyebrow sits on, which decides its own colours. */
type Tone    = 'light' | 'dark' | 'contrast';

const pillTone: Record<Tone, string> = {
  light:    'bg-brand-light text-brand-magenta',
  dark:     'bg-brand-magenta/20 text-brand-pink',
  contrast: 'bg-white text-brand-magenta border border-brand-border',
};

interface EyebrowProps {
  children:  ReactNode;
  variant?:  Variant;
  tone?:     Tone;
  className?: string;
}

/** Small uppercase label that sits above section headings. */
export function Eyebrow({ children, variant = 'pill', tone = 'light', className }: EyebrowProps) {
  return (
    <span
      className={clsx(
        'inline-block type-badge font-semibold',
        variant === 'plain'
          ? 'text-brand-magenta tracking-[0.2em]'
          : clsx('px-4 py-1.5 rounded-full', pillTone[tone]),
        className,
      )}
    >
      {children}
    </span>
  );
}
