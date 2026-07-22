import clsx from 'clsx';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?:      ReactNode;
  title?:     string;
  message:    ReactNode;
  className?: string;
}

/** Dashed-border placeholder card for empty lists. */
export function EmptyState({ icon, title, message, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-white px-6 py-16 text-center',
        className,
      )}
    >
      {icon && <div className="mb-4">{icon}</div>}
      {title && <h2 className="type-subheading text-brand-dark">{title}</h2>}
      <p className={clsx('type-body-sm max-w-sm text-gray-500', title && 'mt-1')}>{message}</p>
    </div>
  );
}
