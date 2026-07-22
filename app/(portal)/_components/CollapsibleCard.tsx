import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface CollapsibleCardProps {
  /** Always-visible summary row (shown collapsed and expanded). */
  summary: ReactNode;
  /** Revealed when expanded. */
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * A card that collapses to a summary row and expands to reveal its details.
 * Built on native <details>/<summary> so it works without client-side JS and
 * stays keyboard-accessible. Styled to match <Card padding="sm">.
 */
export function CollapsibleCard({
  summary,
  children,
  defaultOpen = false,
  className,
}: CollapsibleCardProps) {
  return (
    <details
      open={defaultOpen}
      className={clsx('group rounded-2xl border border-brand-border bg-white', className)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">{summary}</div>
        <ChevronDown
          size={18}
          className="flex-shrink-0 text-gray-400 transition-transform duration-200 [[open]_&]:rotate-180"
        />
      </summary>
      <div className="border-t border-brand-border px-5 pb-5 pt-4">{children}</div>
    </details>
  );
}
