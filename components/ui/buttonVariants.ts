import clsx from 'clsx';

// Pure styling helper (no 'use client') so it can be called from BOTH server
// and client components. Single source of truth for button styling.

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand-magenta hover:bg-brand-pink text-white',
  outline: 'border border-brand-magenta text-brand-magenta hover:bg-brand-light',
  ghost: 'text-brand-magenta hover:bg-brand-light',
  // Destructive actions: same bordered pill shape as `outline`, red accent.
  danger: 'border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 type-caption',
  md: 'px-6 py-3 type-cta',
  lg: 'px-8 py-4 type-cta',
};

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return clsx(BASE, variantClass[variant], sizeClass[size], fullWidth && 'w-full', className);
}
