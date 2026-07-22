import clsx from 'clsx';
import type { ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg';

const sizeClass: Record<Size, string> = {
  sm: 'h-9 w-9 rounded-lg',
  md: 'h-10 w-10 rounded-xl',
  lg: 'h-14 w-14 rounded-2xl',
};

interface IconBadgeProps {
  size?:      Size;
  className?: string;
  children:   ReactNode;
}

/** Blush-filled rounded chip holding a magenta icon. */
export function IconBadge({ size = 'md', className, children }: IconBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center bg-brand-light text-brand-magenta',
        sizeClass[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
