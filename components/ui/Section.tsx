import clsx from 'clsx';
import type { ReactNode } from 'react';

type Tone  = 'white' | 'fog' | 'light' | 'dark' | 'ink';
type Width = '3xl' | '5xl' | '6xl';

const toneClass: Record<Tone, string> = {
  white: 'bg-white',
  fog:   'bg-brand-fog',
  light: 'bg-brand-light',
  dark:  'bg-brand-dark',
  ink:   'bg-brand-ink',
};

const widthClass: Record<Width, string> = {
  '3xl': 'max-w-3xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
};

interface SectionProps {
  id?:       string;
  tone?:     Tone;
  width?:    Width;
  /** vertical rhythm tier — 'lg' = py-24 (default), 'md' = py-16 */
  spacing?:  'lg' | 'md';
  /** extra classes for the inner container */
  className?: string;
  children:  ReactNode;
}

/** Page section: full-bleed tinted band + centered, padded content container. */
export function Section({ id, tone = 'white', width = '6xl', spacing = 'lg', className, children }: SectionProps) {
  return (
    <section id={id} className={clsx(spacing === 'lg' ? 'py-24' : 'py-16', toneClass[tone])}>
      <div className={clsx(widthClass[width], 'mx-auto px-6 md:px-10', className)}>
        {children}
      </div>
    </section>
  );
}
